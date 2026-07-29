/**
 * PRD §6 — 场景动态感知系统
 *
 * 轻量特征采集 + 规则引擎 → 场景上下文。
 * 消费方：窗口管理器、内容调度器、插件系统。
 *
 * 核心理念：感知即服务（Perception as a Service）
 */

import { invoke } from '@tauri-apps/api/core';

/* ===================== 类型定义 ===================== */

/** 特征采集结果（来自 Rust 后端） */
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
  confidence: number; // 0–1
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

/**
 * 本地离线规则引擎
 * 第一级：确定性匹配，~O(1) 快速判定
 */
export function classifyByRule(features: WindowFeatures): { scene: SceneType; confidence: number } {
  const pn = features.process_name.toLowerCase();
  const isFullscreen = features.display_mode === 'fullscreen';
  const isMaximized = features.display_mode === 'maximized';
  const hasAudio = features.has_audio_session;
  const hasMedia = features.is_media_active;

  // 1. 全屏 + 高优先级
  if (isFullscreen) {
    // 全屏 + 媒体活跃 → 视频/音乐
    if (hasMedia) return { scene: 'music', confidence: 0.85 };

    // 全屏 + 游戏进程特征
    if (GAME_PROCESS_PATTERNS.some((p) => pn.includes(p))) {
      return { scene: 'game', confidence: 0.9 };
    }

    // 全屏 + 视频播放器
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

  // 3. 有音频输出
  if (hasAudio) {
    if (VIDEO_PLAYER_PATTERNS.some((p) => pn.includes(p))) {
      return { scene: 'video', confidence: 0.8 };
    }
    if (MUSIC_PROCESS_PATTERNS.some((p) => pn.includes(p))) {
      return { scene: 'music', confidence: 0.85 };
    }
  }

  // 4. 办公/开发
  if (IDE_PROCESS_PATTERNS.some((p) => pn.includes(p))) {
    return { scene: 'office_ide', confidence: 0.9 };
  }
  if (DOC_PROCESS_PATTERNS.some((p) => pn.includes(p))) {
    return { scene: 'office_doc', confidence: 0.85 };
  }
  if (MEETING_PROCESS_PATTERNS.some((p) => pn.includes(p))) {
    return { scene: 'office_meeting', confidence: 0.9 };
  }

  // 5. 浏览
  if (BROWSER_PROCESS_PATTERNS.some((p) => pn.includes(p))) {
    return { scene: 'browsing', confidence: 0.7 };
  }

  // 6. 窗口化 → 空闲
  if (!isFullscreen && !isMaximized) {
    return { scene: 'idle', confidence: 0.5 };
  }

  return { scene: 'unknown', confidence: 0 };
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
  opacity: number; // 0–1
  reduceMotion: boolean;
  reduceFps: boolean;
  showPerformance: boolean;
  showMediaControl: boolean;
}

const SCENE_BEHAVIORS: Record<SceneType, SceneBehavior> = {
  game: {
    hideIsland: false, // 默认不隐藏，由全屏逻辑触发
    opacity: 0.85,
    reduceMotion: true,
    reduceFps: true,
    showPerformance: true,
    showMediaControl: false,
  },
  video: {
    hideIsland: false,
    opacity: 0.3, // 低透明度，不遮挡字幕
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
    opacity: 0.2, // 幽灵模式
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

const SCENE_CACHE_TTL = 60 * 60 * 1000; // 1 小时
const featureCache = new Map<string, { scene: SceneType; ts: number }>();

function cacheKey(f: WindowFeatures): string {
  return `${f.process_name}::${f.window_title}`;
}

function getCached(f: WindowFeatures): SceneType | null {
  const key = cacheKey(f);
  const entry = featureCache.get(key);
  if (entry && Date.now() - entry.ts < SCENE_CACHE_TTL) return entry.scene;
  return null;
}

function setCache(f: WindowFeatures, scene: SceneType) {
  featureCache.set(cacheKey(f), { scene, ts: Date.now() });
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
const POLL_INTERVAL_ACTIVE = 500;  // 活跃时 500ms
const POLL_INTERVAL_IDLE = 5000;   // 空闲时退避到 5s

function notify(ctx: SceneContext) {
  lastContext = ctx;
  listeners.forEach((cb) => cb(ctx));
}

/** 获取当前场景上下文（同步快照） */
export function getCurrentScene(): SceneContext | null {
  return lastContext;
}

/**
 * 执行一次采集与分类
 */
async function pollOnce(isManual = false) {
  try {
    const features = await invoke<WindowFeatures>('get_window_features');
    if (!features) return;

    // 1. 检查缓存
    const cached = getCached(features);
    if (cached && !isManual) {
      const ctx: SceneContext = {
        scene: cached,
        confidence: 1,
        metadata: features,
        source: 'rule',
        updated_at: Date.now(),
      };
      notify(ctx);
      return;
    }

    // 2. 规则引擎分类
    const { scene, confidence } = classifyByRule(features);
    setCache(features, scene);

    const ctx: SceneContext = {
      scene,
      confidence,
      metadata: features,
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
 * 手动锁定场景
 */
export function lockScene(scene: SceneType) {
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
 * 解锁（恢复自动识别）
 */
export function unlockScene() {
  pollOnce(true);
}
