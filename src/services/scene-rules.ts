/**
 * PRD §6.2 / §6.3 — 用户可配置的场景规则引擎
 *
 * 将 classifyByRule 中硬编码的 *_PROCESS_PATTERNS 数组提升为：
 *   1) 内置默认规则（随版本升级持续扩充）
 *   2) 用户自定义规则（UI 可增删改查）
 *
 * 规则判定顺序：用户规则 → 内置规则（规则命中即停止）。
 *
 * 持久化：services/storage.ts（localStorage + Rust 配置文件双通道）。
 */

import {
  classifyByRule as builtinClassifyByRule,
  type SceneType,
  type WindowFeatures,
} from './scene-context';
import { loadConfig, saveConfig } from './storage';

/* ====================== 类型定义 ====================== */

/** 规则匹配模式：进程名包含 / 窗口标题包含 / 显示模式精确匹配 */
export type RulePatternField = 'process_contains' | 'title_contains' | 'display_mode';

export interface RuleCondition {
  field: RulePatternField;
  value: string;
  /** field 非 display_mode 时是否忽略大小写 */
  ignore_case?: boolean;
}

/** 单条规则：所有条件 AND 命中 → 映射到指定场景 */
export interface SceneRule {
  id: string;
  name: string;
  enabled: boolean;
  /** AND 关系：全部满足才算命中 */
  conditions: RuleCondition[];
  /** 命中后判定的场景 */
  scene: SceneType;
  /** 0–1，越大权重越高，优先于置信度相同的内置规则 */
  weight?: number;
}

const STORAGE_KEY = 'wbs_scene_rules_v1';

const DEFAULT_RULES: SceneRule[] = [
  {
    id: 'built-in-games',
    name: '游戏进程特征',
    enabled: true,
    conditions: [
      { field: 'process_contains', value: 'game', ignore_case: true },
      { field: 'process_contains', value: 'gamelauncher', ignore_case: true },
      { field: 'process_contains', value: 'steam', ignore_case: true },
      { field: 'process_contains', value: 'epic', ignore_case: true },
      { field: 'process_contains', value: 'minecraft', ignore_case: true },
    ],
    scene: 'game',
    weight: 0.9,
  },
  {
    id: 'built-in-ides',
    name: 'IDE/编辑器进程',
    enabled: true,
    conditions: [
      { field: 'process_contains', value: 'code', ignore_case: true },
      { field: 'process_contains', value: 'cursor', ignore_case: true },
      { field: 'process_contains', value: 'idea', ignore_case: true },
      { field: 'process_contains', value: 'studio', ignore_case: true },
    ],
    scene: 'office_ide',
    weight: 0.9,
  },
  {
    id: 'built-in-docs',
    name: '文档写作进程',
    enabled: true,
    conditions: [
      { field: 'process_contains', value: 'winword', ignore_case: true },
      { field: 'process_contains', value: 'excel', ignore_case: true },
      { field: 'process_contains', value: 'wps', ignore_case: true },
      { field: 'process_contains', value: 'notion', ignore_case: true },
      { field: 'process_contains', value: 'obsidian', ignore_case: true },
    ],
    scene: 'office_doc',
    weight: 0.9,
  },
  {
    id: 'built-in-meetings',
    name: '会议进程',
    enabled: true,
    conditions: [
      { field: 'process_contains', value: 'teams', ignore_case: true },
      { field: 'process_contains', value: 'zoom', ignore_case: true },
      { field: 'process_contains', value: 'discord', ignore_case: true },
    ],
    scene: 'office_meeting',
    weight: 0.9,
  },
  {
    id: 'built-in-music',
    name: '音乐平台进程',
    enabled: true,
    conditions: [
      { field: 'process_contains', value: 'spotify', ignore_case: true },
      { field: 'process_contains', value: 'netease', ignore_case: true },
      { field: 'process_contains', value: 'cloudmusic', ignore_case: true },
      { field: 'process_contains', value: 'qqmusic', ignore_case: true },
    ],
    scene: 'music',
    weight: 0.9,
  },
  {
    id: 'built-in-browsers',
    name: '浏览器进程',
    enabled: true,
    conditions: [
      { field: 'process_contains', value: 'chrome', ignore_case: true },
      { field: 'process_contains', value: 'edge', ignore_case: true },
      { field: 'process_contains', value: 'firefox', ignore_case: true },
    ],
    scene: 'browsing',
    weight: 0.7,
  },
  {
    id: 'built-in-video-players',
    name: '视频播放器进程',
    enabled: true,
    conditions: [
      { field: 'process_contains', value: 'vlc', ignore_case: true },
      { field: 'process_contains', value: 'mpv', ignore_case: true },
      { field: 'process_contains', value: 'potplayer', ignore_case: true },
    ],
    scene: 'video',
    weight: 0.9,
  },
  {
    id: 'built-in-fullscreen',
    name: '全屏显示 → 游戏/视频候选',
    enabled: true,
    conditions: [{ field: 'display_mode', value: 'fullscreen' }],
    scene: 'game',
    weight: 0.5,
  },
];

/* ====================== 运行时状态 ====================== */

let _rules: SceneRule[] = [...DEFAULT_RULES];
let _loaded = false;

/** 获取全部规则（按 weight 降序，用户规则插在最前） */
export function listRules(): SceneRule[] {
  return [..._rules].sort((a, b) => (b.weight ?? 0.5) - (a.weight ?? 0.5));
}

/** 新增规则。自动生成 id，weight 默认 0.95（覆盖内置规则）。 */
export function addRule(rule: Omit<SceneRule, 'id'> & { id?: string }): SceneRule {
  const next: SceneRule = {
    id: rule.id ?? `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    name: rule.name,
    enabled: rule.enabled,
    conditions: rule.conditions,
    scene: rule.scene,
    weight: rule.weight ?? 0.95,
  };
  _rules.push(next);
  void persist();
  return next;
}

export function updateRule(id: string, patch: Partial<Omit<SceneRule, 'id'>>): boolean {
  const idx = _rules.findIndex((r) => r.id === id);
  if (idx < 0) return false;
  _rules[idx] = { ..._rules[idx], ...patch };
  void persist();
  return true;
}

export function deleteRule(id: string): boolean {
  const before = _rules.length;
  _rules = _rules.filter((r) => r.id !== id);
  if (_rules.length < before) {
    void persist();
    return true;
  }
  return false;
}

export function setRulesEnabled(ids: string[], enabled: boolean): number {
  let changed = 0;
  for (const id of ids) {
    const r = _rules.find((x) => x.id === id);
    if (r && r.enabled !== enabled) {
      r.enabled = enabled;
      changed++;
    }
  }
  if (changed) void persist();
  return changed;
}

export function resetRulesToDefaults(): void {
  _rules = [...DEFAULT_RULES];
  void persist();
}

/* ====================== 持久化 ====================== */

const USER_PREFIX = 'u_';

function isUserRule(r: SceneRule): boolean {
  return r.id.startsWith(USER_PREFIX);
}

async function persist(): Promise<void> {
  const userRules = _rules.filter(isUserRule);
  await saveConfig(STORAGE_KEY, { userRules, timestamp: Date.now() });
}

export async function reloadRules(): Promise<void> {
  const saved = await loadConfig<{ userRules: SceneRule[] } | null>(STORAGE_KEY, null);
  const userRules = saved?.userRules ?? [];
  // 先恢复内置规则，再合并用户规则，保证用户规则不被覆盖
  _rules = [...DEFAULT_RULES, ...userRules];
  _loaded = true;
}

/* ====================== 规则执行引擎 ====================== */

function conditionMatches(cond: RuleCondition, f: WindowFeatures): boolean {
  const ignore = cond.ignore_case ?? true;
  switch (cond.field) {
    case 'process_contains': {
      const needle = ignore ? cond.value.toLowerCase() : cond.value;
      const hay = ignore ? f.process_name.toLowerCase() : f.process_name;
      return hay.includes(needle);
    }
    case 'title_contains': {
      const needle = ignore ? cond.value.toLowerCase() : cond.value;
      const hay = ignore ? f.window_title.toLowerCase() : f.window_title;
      return hay.includes(needle);
    }
    case 'display_mode':
      return f.display_mode === cond.value;
  }
}

/** 按规则集 + 内置分类器综合判定场景。返回场景 + 置信度。 */
export function classifyWithRules(
  features: WindowFeatures,
): { scene: SceneType; confidence: number; source: 'user_rule' | 'builtin_rule' } {
  const ordered = listRules().filter((r) => r.enabled);

  for (const rule of ordered) {
    // AND 关系：全部条件满足才算命中
    const allMatch = rule.conditions.length > 0
      && rule.conditions.every((c) => conditionMatches(c, features));
    if (allMatch) {
      return {
        scene: rule.scene,
        confidence: Math.max(0.5, rule.weight ?? 0.9),
        source: isUserRule(rule) ? 'user_rule' : 'builtin_rule',
      };
    }
  }

  const builtin = builtinClassifyByRule(features);
  return { scene: builtin.scene, confidence: builtin.confidence, source: 'builtin_rule' };
}
export { SceneType };

