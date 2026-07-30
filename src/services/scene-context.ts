/**
 * PRD §6 — 场景动态感知系统（多窗口投票版）
 *
 * 架构：特征采集(Rust 多窗口) → 加权投票(TS) → 场景惯性(EMA + 稳定性计数)
 *
 * 核心改进：
 *   - 不再只看焦点窗口，采集全部可见顶层窗口的特征快照
 *   - 每个窗口独立分类，按「窗口状态权重 × 进程重要度」加权投票
 *   - 场景切换需连续 N 次采样领先，且新场景 EMA 超过旧场景阈值
 *
 * 设计思想：
 *   游戏进程即使被临时切到后台，仍保持高惯性（1.5× 加权）
 *   聊天/IM 进程即使在前台，权重也较低（0.5× 加权）
 *   短暂的上下文切换（回消息、看通知）不应改变主场景判定
 */

import { invoke } from '@tauri-apps/api/core';

/* ===================== 类型定义 ===================== */

/** 单窗口特征条目（来自 Rust 多窗口枚举） */
export interface WindowEntry {
  window_title: string;
  process_name: string;
  display_mode: string;
  window_width: number;
  window_height: number;
  is_media_active: boolean;
  window_state: 'foreground' | 'maximized' | 'restored' | 'minimized';
  is_foreground: boolean;
}

/** 单窗口特征（兼容旧接口，保留 WindowFeatures 字段语义） */
export interface WindowFeatures {
  window_title: string;
  process_name: string;
  display_mode: 'fullscreen' | 'maximized' | 'windowed' | 'minimized';
  window_width: number;
  window_height: number;
  has_audio_session: boolean;
  is_media_active: boolean;
}

/** 场景分类 */
export type SceneType =
  | 'game'
  | 'video'
  | 'music'
  | 'office_ide'
  | 'office_doc'
  | 'office_meeting'
  | 'browsing'
  | 'idle'
  | 'unknown';

/** 场景冲突优先级 */
const SCENE_PRIORITY: Record<SceneType, number> = {
  game: 100,
  video: 90,
  music: 80,
  office_meeting: 70,
  office_ide: 60,
  office_doc: 60,
  browsing: 50,
  idle: 10,
  unknown: 0,
};

/** 场景上下文 */
export interface SceneContext {
  scene: SceneType;
  confidence: number;
  metadata: Partial<WindowFeatures>;
  source: 'rule' | 'cloud_ai' | 'manual';
  updated_at: number;
}

/* ===================== 规则引擎 ===================== */

/** 游戏进程关键词 */
const GAME_PROCESS_PATTERNS = [
  'game', 'gamelauncher', 'steam', 'epic', 'battle.net',
  'origin', 'ubisoft', 'gog', 'xbox', 'minecraft',
] as const;

/** 办公/IDE 进程关键词 */
const IDE_PROCESS_PATTERNS = [
  'code', 'cursor', 'windsurf', 'idea', 'clion', 'webstorm',
  'pycharm', 'vscode', 'studio', 'sublime', 'atom',
] as const;

/** 文档进程关键词 */
const DOC_PROCESS_PATTERNS = [
  'winword', 'excel', 'powerpnt', 'outlook', 'wps',
  'notion', 'obsidian', 'typora', 'logseq',
] as const;

/** 会议进程关键词 */
const MEETING_PROCESS_PATTERNS = [
  'teams', 'zoom', 'meet', 'slack', 'discord',
  'webex', 'skype', 'telegram',
] as const;

/** 浏览器进程关键词 */
const BROWSER_PROCESS_PATTERNS = [
  'chrome', 'firefox', 'edge', 'safari', 'opera',
  'brave', 'vivaldi', 'arc',
] as const;

/** 音乐进程关键词 */
const MUSIC_PROCESS_PATTERNS = [
  'spotify', 'netease', 'cloudmusic', 'music',
  'apple music', 'qqmusic', 'kugou', 'foobar',
] as const;

/** 媒体播放器进程关键词 */
const VIDEO_PLAYER_PATTERNS = [
  'vlc', 'mpv', 'potplayer', 'wmplayer',
  'mediaplayer', 'kmplayer',
] as const;

/** IM/聊天进程关键词（低权重） */
const CHAT_PROCESS_PATTERNS = [
  'wechat', 'weixin', 'qq', 'tim', 'telegram',
  'discord', 'slack', 'teams', 'lark', 'feishu',
  'dingtalk', 'whatsapp', 'signal',
] as const;

/**
 * 本地离线规则引擎 — 单窗口分类
 * 返回该窗口独立判定的场景 + 置信度
 */
export function classifyByRule(features: WindowFeatures): { scene: SceneType; confidence: number } {
  const pn = features.process_name.toLowerCase();
  const isFullscreen = features.display_mode === 'fullscreen';
  const isMaximized = features.display_mode === 'maximized';
  const hasMedia = features.is_media_active;

  // 1. 全屏 + 高优先级
  if (isFullscreen) {
    if (hasMedia) return { scene: 'music', confidence: 0.85 };
    if (GAME_PROCESS_PATTERNS.some((p) => pn.includes(p))) {
      return { scene: 'game', confidence: 0.9 };
    }
    if (VIDEO_PLAYER_PATTERNS.some((p) => pn.includes(p))) {
      return { scene: 'video', confidence: 0.85 };
    }
    return { scene: 'game', confidence: 0.7 };
  }

  // 2. 媒体活跃（非全屏）
  if (hasMedia) {
    if (MUSIC_PROCESS_PATTERNS.some((p) => pn.includes(p))) {
      return { scene: 'music', confidence: 0.95 };
    }
    return { scene: 'music', confidence: 0.75 };
  }

  // 3. 办公/开发
  if (IDE_PROCESS_PATTERNS.some((p) => pn.includes(p))) {
    return { scene: 'office_ide', confidence: 0.9 };
  }
  if (DOC_PROCESS_PATTERNS.some((p) => pn.includes(p))) {
    return { scene: 'office_doc', confidence: 0.85 };
  }
  if (MEETING_PROCESS_PATTERNS.some((p) => pn.includes(p))) {
    return { scene: 'office_meeting', confidence: 0.9 };
  }

  // 4. 浏览
  if (BROWSER_PROCESS_PATTERNS.some((p) => pn.includes(p))) {
    return { scene: 'browsing', confidence: 0.7 };
  }

  // 5. 聊天进程 → idle（不直接判定为办公/会议）
  if (CHAT_PROCESS_PATTERNS.some((p) => pn.includes(p))) {
    return { scene: 'idle', confidence: 0.6 };
  }

  // 6. 窗口化 → 空闲
  if (!isFullscreen && !isMaximized) {
    return { scene: 'idle', confidence: 0.5 };
  }

  return { scene: 'unknown', confidence: 0 };
}

/* ===================== 多窗口加权投票 ===================== */

/** 窗口状态权重：决定该窗口对最终场景的贡献 */
const STATE_WEIGHT: Record<string, number> = {
  foreground: 1.0,
  maximized: 0.7,
  restored: 0.4,
  minimized: 0.1,
};

/**
 * 进程重要度乘数：决定该进程的"场景粘性"
 * 游戏/媒体进程即使在后台也保持高影响力
 * 聊天/IM 进程即使在前台也保持低影响力
 */
const PROCESS_MULTIPLIER: { patterns: readonly string[]; multiplier: number }[] = [
  { patterns: GAME_PROCESS_PATTERNS, multiplier: 1.8 },
  { patterns: VIDEO_PLAYER_PATTERNS, multiplier: 1.5 },
  { patterns: MUSIC_PROCESS_PATTERNS, multiplier: 1.5 },
  { patterns: MEETING_PROCESS_PATTERNS, multiplier: 1.3 },
  { patterns: IDE_PROCESS_PATTERNS, multiplier: 1.1 },
  { patterns: DOC_PROCESS_PATTERNS, multiplier: 1.0 },
  { patterns: BROWSER_PROCESS_PATTERNS, multiplier: 0.9 },
  { patterns: CHAT_PROCESS_PATTERNS, multiplier: 0.5 },
];

function getProcessMultiplier(processName: string): number {
  const pn = processName.toLowerCase();
  for (const { patterns, multiplier } of PROCESS_MULTIPLIER) {
    if (patterns.some((p) => pn.includes(p))) {
      return multiplier;
    }
  }
  return 1.0;
}

/**
 * 将 WindowEntry 转换为 WindowFeatures（兼容 classifyByRule）
 */
function entryToFeatures(entry: WindowEntry): WindowFeatures {
  const displayMode = entry.display_mode as WindowFeatures['display_mode'];
  return {
    window_title: entry.window_title,
    process_name: entry.process_name,
    display_mode: displayMode || 'windowed',
    window_width: entry.window_width,
    window_height: entry.window_height,
    has_audio_session: false,
    is_media_active: entry.is_media_active,
  };
}

/**
 * 多窗口加权投票
 * 输入：全部可见窗口的特征快照
 * 输出：各场景的加权分数
 *
 * 计算方式：
 *   score[scene] += confidence × stateWeight × processMultiplier
 *
 * 示例场景：
 *   前台 WeChat（聊天 × 0.5）：score[idle] += 0.6 × 1.0 × 0.5 = 0.30
 *   后台游戏窗口（游戏 × 1.8）：score[game] += 0.9 × 0.4 × 1.8 = 0.65
 *   → game 胜出，不因临时切到聊天而改变场景
 */
export function voteScenes(entries: WindowEntry[]): {
  scores: Partial<Record<SceneType, number>>;
  totalWeight: number;
} {
  const scores: Partial<Record<SceneType, number>> = {};
  let totalWeight = 0;

  for (const entry of entries) {
    if (!entry.process_name || entry.process_name === 'unknown') continue;
    if (!entry.window_title && entry.window_state === 'minimized') continue;

    const features = entryToFeatures(entry);
    const { scene, confidence } = classifyByRule(features);

    const stateWeight = STATE_WEIGHT[entry.window_state] ?? 0.3;
    const processMultiplier = getProcessMultiplier(entry.process_name);
    const weight = stateWeight * processMultiplier;

    scores[scene] = (scores[scene] ?? 0) + confidence * weight;
    totalWeight += weight;
  }

  return { scores, totalWeight };
}

/* ===================== 场景惯性 (Hysteresis) ===================== */

const EMA_ALPHA = 0.3;
const STABILITY_THRESHOLD = 3;
const MIN_EMA_TO_SWITCH = 0.35;
const OVERRIDE_RATIO = 1.15;

/**
 * 场景惯性引擎
 *
 * 解决的问题：短暂的前台切换（回消息、看通知）不应立即改变场景
 *
 * 策略：
 *   1. EMA 平滑：每个场景的得分使用指数移动平均，避免瞬时波动
 *   2. 稳定性计数：新场景必须连续 N 次采样领先才允许切换
 *   3. 双条件触发：新场景 EMA > 旧场景 EMA × 1.15 且稳定性达标
 *   4. 紧急切换：旧场景 EMA 跌破 MIN_EMA_TO_SWITCH 时允许立即切换
 */
class SceneInertiaEngine {
  private emaScores = new Map<SceneType, number>();
  private stableCounts = new Map<SceneType, number>();
  private current: SceneType = 'idle';
  private currentConfidence = 0;

  reset(scene: SceneType, confidence: number) {
    this.current = scene;
    this.currentConfidence = confidence;
    this.emaScores.clear();
    this.stableCounts.clear();
    this.emaScores.set(scene, confidence);
    this.stableCounts.set(scene, 3);
  }

  apply(
    scores: Partial<Record<SceneType, number>>,
    totalWeight: number,
  ): { scene: SceneType; confidence: number; changed: boolean } {
    // 归一化分数（0-1 范围）
    const normalized: Partial<Record<SceneType, number>> = {};
    if (totalWeight > 0) {
      for (const [scene, score] of Object.entries(scores)) {
        normalized[scene as SceneType] = (score as number) / totalWeight;
      }
    } else {
      // 无有效窗口 → idle
      normalized['idle'] = 1.0;
    }

    // 更新 EMA
    for (const [scene, score] of Object.entries(normalized)) {
      const key = scene as SceneType;
      const prev = this.emaScores.get(key) ?? 0;
      this.emaScores.set(key, EMA_ALPHA * (score as number) + (1 - EMA_ALPHA) * prev);
    }

    // 找出当前 EMA 最高的场景
    let best: SceneType = 'idle';
    let bestEma = 0;
    for (const [scene, ema] of this.emaScores) {
      if (ema > bestEma) {
        bestEma = ema;
        best = scene;
      }
    }

    // 边界条件：best 为 idle 且 current 不是 idle
    if (best === 'idle' && bestEma < 0.5 && this.current !== 'idle') {
      // 无有效信息，保持当前
      return { scene: this.current, confidence: this.currentConfidence, changed: false };
    }

    if (best === this.current) {
      // 同一场景 → 递增稳定性计数
      const count = (this.stableCounts.get(best) ?? 0) + 1;
      this.stableCounts.set(best, count);
      this.currentConfidence = Math.min(1, bestEma);
      return { scene: this.current, confidence: this.currentConfidence, changed: false };
    }

    // 不同场景 → 判断是否允许切换
    const currentEma = this.emaScores.get(this.current) ?? 0;
    const newStable = (this.stableCounts.get(best) ?? 0) + 1;

    const stabilityOk = newStable >= STABILITY_THRESHOLD;
    const ratioOk = bestEma > currentEma * OVERRIDE_RATIO;
    const emergencySwitch = currentEma < MIN_EMA_TO_SWITCH && bestEma > 0.4;

    if ((stabilityOk && ratioOk) || emergencySwitch) {
      // 切换场景
      const oldScene = this.current;
      this.current = best;
      this.currentConfidence = Math.min(1, bestEma);
      this.stableCounts.clear();
      this.stableCounts.set(best, 1);
      return { scene: this.current, confidence: this.currentConfidence, changed: true };
    } else {
      // 保持当前场景，但更新挑战者的稳定性计数
      this.stableCounts.set(best, newStable);
      this.currentConfidence = Math.min(1, currentEma);
      return { scene: this.current, confidence: this.currentConfidence, changed: false };
    }
  }
}

/* ===================== 场景冲突消解 ===================== */

export function resolveConflict(candidates: { scene: SceneType; confidence: number }[]): SceneType {
  if (candidates.length === 0) return 'unknown';
  return candidates.reduce((a, b) =>
    SCENE_PRIORITY[a.scene] > SCENE_PRIORITY[b.scene] ? a : b
  ).scene;
}

/* ===================== 场景驱动的行为策略 ===================== */

export interface SceneBehavior {
  hideIsland: boolean;
  opacity: number;
  reduceMotion: boolean;
  reduceFps: boolean;
  showPerformance: boolean;
  showMediaControl: boolean;
}

const SCENE_BEHAVIORS: Record<SceneType, SceneBehavior> = {
  game: {
    hideIsland: false,
    opacity: 0.85,
    reduceMotion: true,
    reduceFps: true,
    showPerformance: true,
    showMediaControl: false,
  },
  video: {
    hideIsland: false,
    opacity: 0.3,
    reduceMotion: true,
    reduceFps: false,
    showPerformance: false,
    showMediaControl: true,
  },
  music: {
    hideIsland: false,
    opacity: 0.9,
    reduceMotion: false,
    reduceFps: false,
    showPerformance: false,
    showMediaControl: true,
  },
  office_meeting: {
    hideIsland: false,
    opacity: 0.2,
    reduceMotion: true,
    reduceFps: true,
    showPerformance: false,
    showMediaControl: false,
  },
  office_ide: {
    hideIsland: false,
    opacity: 0.6,
    reduceMotion: false,
    reduceFps: false,
    showPerformance: true,
    showMediaControl: false,
  },
  office_doc: {
    hideIsland: false,
    opacity: 0.6,
    reduceMotion: false,
    reduceFps: false,
    showPerformance: false,
    showMediaControl: false,
  },
  browsing: {
    hideIsland: false,
    opacity: 0.8,
    reduceMotion: false,
    reduceFps: false,
    showPerformance: false,
    showMediaControl: false,
  },
  idle: {
    hideIsland: false,
    opacity: 1.0,
    reduceMotion: false,
    reduceFps: true,
    showPerformance: false,
    showMediaControl: false,
  },
  unknown: {
    hideIsland: false,
    opacity: 1.0,
    reduceMotion: false,
    reduceFps: false,
    showPerformance: false,
    showMediaControl: false,
  },
};

export function getSceneBehavior(scene: SceneType): SceneBehavior {
  return SCENE_BEHAVIORS[scene] ?? SCENE_BEHAVIORS.unknown;
}

/* ===================== 特征缓存（防抖） ===================== */

const SCENE_CACHE_TTL = 60 * 60 * 1000;
const featureCache = new Map<string, { scene: SceneType; ts: number }>();

function cacheKey(entries: WindowEntry[]): string {
  const sig = entries
    .map((e) => `${e.process_name}|${e.window_state}|${e.window_title.slice(0, 30)}`)
    .sort()
    .join(';;');
  return sig || 'empty';
}

function getCached(entries: WindowEntry[]): SceneType | null {
  const key = cacheKey(entries);
  const entry = featureCache.get(key);
  if (entry && Date.now() - entry.ts < SCENE_CACHE_TTL) return entry.scene;
  return null;
}

function setCache(entries: WindowEntry[], scene: SceneType) {
  featureCache.set(cacheKey(entries), { scene, ts: Date.now() });
}

/* ===================== 主流程 ===================== */

type SceneListener = (ctx: SceneContext) => void;
const listeners = new Set<SceneListener>();

/** 注册场景变更监听器 */
export function onSceneChange(cb: SceneListener) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

let lastContext: SceneContext | null = null;
let pollingTimer: number | null = null;
const POLL_INTERVAL_ACTIVE = 500;
const POLL_INTERVAL_IDLE = 5000;

const inertia = new SceneInertiaEngine();
let inertiaInitialized = false;

function notify(ctx: SceneContext) {
  lastContext = ctx;
  listeners.forEach((cb) => cb(ctx));
}

/** 获取当前场景上下文（同步快照） */
export function getCurrentScene(): SceneContext | null {
  return lastContext;
}

/**
 * 执行一次采集与分类（多窗口投票版）
 */
async function pollOnce(isManual = false) {
  try {
    const entries = await invoke<WindowEntry[]>('get_all_window_features');
    if (!entries || entries.length === 0) {
      // 无窗口信息 → idle
      if (lastContext?.scene !== 'idle') {
        const ctx: SceneContext = {
          scene: 'idle',
          confidence: 0,
          metadata: {},
          source: 'rule',
          updated_at: Date.now(),
        };
        notify(ctx);
      }
      return;
    }

    // 检查缓存
    const cached = getCached(entries);
    if (cached && !isManual) {
      const ctx: SceneContext = {
        scene: cached,
        confidence: 1,
        metadata: {},
        source: 'rule',
        updated_at: Date.now(),
      };
      notify(ctx);
      return;
    }

    // 多窗口加权投票
    const { scores, totalWeight } = voteScenes(entries);

    // 选出最高原始分场景（用于 inertia 紧急切换判断）
    const rawWinner = Object.entries(scores).reduce<[SceneType, number] | null>(
      (acc, [scene, score]) => {
        if (!acc || (score as number) > acc[1]) return [scene as SceneType, score as number];
        return acc;
      },
      null,
    );

    // 场景惯性判定
    const result = inertia.apply(scores, totalWeight);

    // 首次初始化
    if (!inertiaInitialized) {
      inertia.reset(result.scene, result.confidence);
      inertiaInitialized = true;
    }

    if (!isManual && result.changed) {
      // 缓存场景
      setCache(entries, result.scene);
    }

    // 构建元数据（聚合所有窗口信息）
    const primaryEntry = entries.find((e) => e.is_foreground) ?? entries[0];
    const metadata: Partial<WindowFeatures> = primaryEntry
      ? entryToFeatures(primaryEntry)
      : {};

    const ctx: SceneContext = {
      scene: result.scene,
      confidence: result.confidence,
      metadata,
      source: 'rule',
      updated_at: Date.now(),
    };
    notify(ctx);
  } catch (err) {
    console.error('[SceneContext] 采集失败', err);
  }
}

/**
 * 启动场景轮询
 */
export function startScenePolling() {
  if (pollingTimer) return;
  pollOnce();

  const loop = () => {
    const interval = lastContext && lastContext.scene === 'idle'
      ? POLL_INTERVAL_IDLE
      : POLL_INTERVAL_ACTIVE;

    pollingTimer = window.setTimeout(async () => {
      await pollOnce();
      loop();
    }, interval);
  };
  loop();
}

/**
 * 停止场景轮询
 */
export function stopScenePolling() {
  if (pollingTimer) {
    clearTimeout(pollingTimer);
    pollingTimer = null;
  }
}

/**
 * 手动锁定场景（立即生效，绕过惯性）
 */
export function lockScene(scene: SceneType) {
  inertia.reset(scene, 1);
  inertiaInitialized = true;
  const ctx: SceneContext = {
    scene,
    confidence: 1,
    metadata: {},
    source: 'manual',
    updated_at: Date.now(),
  };
  notify(ctx);
}

/**
 * 解锁（恢复自动识别，重置惯性）
 */
export function unlockScene() {
  inertiaInitialized = false;
  inertia.reset('idle', 0);
  void pollOnce(true);
}
