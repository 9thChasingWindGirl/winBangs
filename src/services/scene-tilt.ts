/**
 * 场景权重倾斜方案管理
 *
 * 提供每个场景的 TILT_CONFIG 持久化与运行时访问。
 * 用户可在 UI 中调整每个场景的「权重方案」参数。
 */

import { type SceneType } from './scene-context';
import { loadConfig, saveConfig } from './storage';

/* ====================== 类型定义 ====================== */

export interface SceneTiltProfile {
  /** 场景类型 */
  scene: SceneType;
  /** 是否启用权重倾斜保护 */
  enabled: boolean;
  /** 最大地板值（t=0 时的初始保护水平） */
  maxFloor: number;
  /** 保护地板值（衰减停止的最低值） */
  floor: number;
  /** 从 maxFloor 衰减到 floor 的时长 (ms) */
  decayMs: number;
  /** 在 floor 保定的时长 (ms) */
  holdMs: number;
  /** 从 floor 衰减到 0 的时长 (ms) */
  abandonMs: number;
}

const STORAGE_KEY = 'wbs_scene_tilt_v1';

/* ====================== 默认配置 ====================== */

const DEFAULT_TILT_PROFILES: SceneTiltProfile[] = [
  {
    scene: 'game',
    enabled: true,
    maxFloor: 0.85,
    floor: 0.68,
    decayMs: 180_000,
    holdMs: 600_000,
    abandonMs: 300_000,
  },
  {
    scene: 'office_ide',
    enabled: true,
    maxFloor: 0.80,
    floor: 0.65,
    decayMs: 120_000,
    holdMs: 300_000,
    abandonMs: 240_000,
  },
  {
    scene: 'video',
    enabled: true,
    maxFloor: 0.80,
    floor: 0.65,
    decayMs: 120_000,
    holdMs: 300_000,
    abandonMs: 180_000,
  },
  {
    scene: 'office_meeting',
    enabled: true,
    maxFloor: 0.75,
    floor: 0.62,
    decayMs: 60_000,
    holdMs: 120_000,
    abandonMs: 120_000,
  },
  {
    scene: 'office_doc',
    enabled: true,
    maxFloor: 0.65,
    floor: 0.58,
    decayMs: 90_000,
    holdMs: 120_000,
    abandonMs: 120_000,
  },
  {
    scene: 'music',
    enabled: false,
    maxFloor: 0.60,
    floor: 0.45,
    decayMs: 60_000,
    holdMs: 60_000,
    abandonMs: 60_000,
  },
  {
    scene: 'browsing',
    enabled: false,
    maxFloor: 0.55,
    floor: 0.40,
    decayMs: 60_000,
    holdMs: 60_000,
    abandonMs: 60_000,
  },
];

/* ====================== 运行时状态 ====================== */

let _profiles: SceneTiltProfile[] = [...DEFAULT_TILT_PROFILES];

/** 获取全部倾斜方案 */
export function listTiltProfiles(): SceneTiltProfile[] {
  return [..._profiles];
}

/** 获取指定场景的倾斜方案，不存在时返回 null */
export function getTiltProfile(scene: SceneType): SceneTiltProfile | null {
  return _profiles.find((p) => p.scene === scene) ?? null;
}

/** 更新某个场景的倾斜方案 */
export function updateTiltProfile(
  scene: SceneType,
  patch: Partial<Omit<SceneTiltProfile, 'scene'>>,
): boolean {
  const idx = _profiles.findIndex((p) => p.scene === scene);
  if (idx < 0) return false;
  _profiles[idx] = { ..._profiles[idx], ...patch };
  void persist();
  return true;
}

/** 重置所有方案为默认值 */
export function resetTiltProfilesToDefaults(): void {
  _profiles = [...DEFAULT_TILT_PROFILES];
  void persist();
}

/* ====================== 持久化 ====================== */

async function persist(): Promise<void> {
  await saveConfig(STORAGE_KEY, { profiles: _profiles, timestamp: Date.now() });
}

/** 从存储加载（启动时调用） */
export async function reloadTiltProfiles(): Promise<void> {
  const saved = await loadConfig<{ profiles: SceneTiltProfile[] } | null>(STORAGE_KEY, null);
  if (saved?.profiles?.length) {
    // 合并：保留所有默认场景，用存储值覆盖
    const savedMap = new Map(saved.profiles.map((p) => [p.scene, p]));
    _profiles = DEFAULT_TILT_PROFILES.map(
      (d) => savedMap.get(d.scene) ?? d,
    );
    // 新增用户自创建场景暂不支持
  } else {
    _profiles = [...DEFAULT_TILT_PROFILES];
  }
}

/**
 * 构建 scene-context 所需的 TiltConfig 映射
 * 供 scene-context 内部调用，导出给 scene-context.ts 使用
 */
export function buildTiltConfigMap(): Partial<Record<SceneType, {
  maxFloor: number;
  floor: number;
  decayMs: number;
  holdMs: number;
  abandonMs: number;
}>> {
  const map: Record<string, any> = {};
  for (const p of _profiles) {
    if (!p.enabled) continue;
    map[p.scene] = {
      maxFloor: p.maxFloor,
      floor: p.floor,
      decayMs: p.decayMs,
      holdMs: p.holdMs,
      abandonMs: p.abandonMs,
    };
  }
  return map;
}
