/**
 * PRD §6.4 — 云端 AI 辅助场景识别配置
 *
 * 职责：
 *   - 保存 Provider / API Key / Base URL / Model / Prompt 模板
 *   - 三档模式：local_only / local_cloud / manual（见 PRD §6.4.2）
 *   - 对 scene-context.ts 提供 classifyByCloud() 调用入口（带调用节流、缓存、超时）
 *
 * 注：这里不包含 Rust 后端；真实调用通过前端 fetch 直连用户指定的
 * OpenAI 兼容 API。这样无需在 Rust 层再加密钥管理。
 */

import { loadConfig, saveConfig } from './storage';
import type { SceneType, WindowFeatures } from './scene-context';
import type { TranslationKey } from '../i18n';

/* ====================== 类型 ====================== */

export type AiMode = 'local_only' | 'local_cloud' | 'manual';

export type AiProvider = 'custom_openai' | 'openai' | 'anthropic' | 'doubao' | 'qwen' | 'deepseek';

export interface CloudAiConfig {
  mode: AiMode;
  provider: AiProvider;
  /** API Key，非明文存储（仅保存到本地 JSON，不走日志/告警路径） */
  apiKey: string;
  baseUrl: string;
  model: string;
  /** 调用节流最小间隔（秒）。PRD §6.4.2 要求 ≥ 30s。 */
  minIntervalSec: number;
  /** 同一 (进程名, 窗口标题) 组合缓存有效期（小时）。PRD §6.4.2 默认 1h。 */
  cacheTtlHour: number;
  /** 单请求超时秒数 */
  timeoutSec: number;
  /** 用户覆盖的 system prompt；空串使用内置 prompt */
  customPrompt: string;
  /** 是否在识别失败时提示用户切换模式 */
  showErrorHint: boolean;
  /** 自定义请求头，每行一个 Key: Value */
  customHeaders: string;
}

export interface CloudAiResult {
  scene: SceneType;
  confidence: number;
  raw?: string;
  usedCache: boolean;
}

/* ====================== 默认值 ====================== */

export const DEFAULT_CLOUD_AI: CloudAiConfig = {
  mode: 'local_only',
  provider: 'custom_openai',
  apiKey: '',
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4o-mini',
  minIntervalSec: 30,
  cacheTtlHour: 1,
  timeoutSec: 8,
  customPrompt: '',
  showErrorHint: true,
  customHeaders: '',
};

const INTERNAL_PROVIDER_PRESETS: Record<Exclude<AiProvider, 'custom_openai'>, { baseUrl: string; models: string[] }> = {
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4.1-mini'],
  },
  anthropic: {
    baseUrl: 'https://api.anthropic.com/v1',
    models: ['claude-3-5-haiku-latest', 'claude-3-5-sonnet-latest'],
  },
  doubao: {
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    models: ['doubao-seed-1-6-lite-250828', 'doubao-1-5-lite-32k-250115'],
  },
  qwen: {
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    models: ['qwen-plus-latest', 'qwen-turbo-latest'],
  },
  deepseek: {
    baseUrl: 'https://api.deepseek.com/v1',
    models: ['deepseek-chat', 'deepseek-reasoner'],
  },
};

export function getProviderPresets(): Partial<Record<AiProvider, { baseUrl: string; models: string[] }>> {
  return INTERNAL_PROVIDER_PRESETS;
}

/* ====================== 状态 & 持久化 ====================== */

const STORAGE_KEY = 'wbs_cloud_ai_v1';
const CACHE_KEY = 'wbs_cloud_ai_cache_v1';

let _config: CloudAiConfig = { ...DEFAULT_CLOUD_AI };
let _loaded = false;

export function getCloudAiConfig(): CloudAiConfig {
  return { ..._config };
}

export async function reloadCloudAiConfig(): Promise<void> {
  const saved = await loadConfig<CloudAiConfig | null>(STORAGE_KEY, null);
  if (saved) _config = { ...DEFAULT_CLOUD_AI, ...saved };
  _loaded = true;
}

export async function saveCloudAiConfig(patch: Partial<CloudAiConfig>): Promise<CloudAiConfig> {
  _config = { ..._config, ...patch };
  // 切 provider 时自动补 baseUrl（用户手动覆盖过则保留）
  if (patch.provider && patch.provider !== 'custom_openai') {
    const preset = INTERNAL_PROVIDER_PRESETS[patch.provider as Exclude<AiProvider, 'custom_openai'>];
    if (preset && !patch.baseUrl && _config.baseUrl === 'https://api.openai.com/v1') {
      _config.baseUrl = preset.baseUrl;
    }
  }
  await saveConfig(STORAGE_KEY, _config);
  return { ..._config };
}

export function validateConfig(cfg: CloudAiConfig): { ok: boolean; issues: TranslationKey[] } {
  const issues: TranslationKey[] = [];
  if (cfg.mode !== 'local_only' && !cfg.apiKey.trim()) issues.push('aiValidateApiKeyEmpty');
  if (cfg.mode !== 'local_only' && !cfg.baseUrl.trim()) issues.push('aiValidateBaseUrlEmpty');
  if (cfg.mode !== 'local_only' && !cfg.model.trim()) issues.push('aiValidateModelEmpty');
  if (cfg.minIntervalSec < 10) issues.push('aiValidateIntervalShort');
  if (cfg.timeoutSec < 1 || cfg.timeoutSec > 60) issues.push('aiValidateTimeoutRange');
  return { ok: issues.length === 0, issues };
}

/* ====================== 调用节流 & 缓存 ====================== */

type CacheEntry = { scene: SceneType; confidence: number; ts: number };
const _memCache = new Map<string, CacheEntry>();
let _lastCallAt = 0;

function cacheKey(f: WindowFeatures): string {
  return `${f.process_name}::${f.window_title}`;
}

export async function clearAiCache(): Promise<void> {
  _memCache.clear();
  await saveConfig(CACHE_KEY, {});
}

async function _getCached(key: string, ttlMs: number): Promise<CacheEntry | null> {
  const mem = _memCache.get(key);
  if (mem && Date.now() - mem.ts < ttlMs) return mem;
  const disk = await loadConfig<Record<string, CacheEntry> | null>(CACHE_KEY, null);
  if (disk && disk[key] && Date.now() - disk[key].ts < ttlMs) {
    _memCache.set(key, disk[key]);
    return disk[key];
  }
  return null;
}

async function _setCached(key: string, entry: CacheEntry): Promise<void> {
  _memCache.set(key, entry);
  const all = (await loadConfig<Record<string, CacheEntry> | null>(CACHE_KEY, null)) ?? {};
  all[key] = entry;
  await saveConfig(CACHE_KEY, all);
}

/* ====================== Prompt 构造 ====================== */

const SCENE_VALUES: SceneType[] = [
  'game',
  'video',
  'music',
  'office_ide',
  'office_doc',
  'office_meeting',
  'browsing',
  'idle',
  'unknown',
];

const SYSTEM_PROMPT = `你是一位 Windows 桌面场景分类助手。根据用户提供的前台窗口特征，判断用户当前的使用场景。

候选场景：
${SCENE_VALUES.map((s) => `- ${s}`).join('\n')}

必须遵守：
1. 只输出一个 JSON 对象，格式：{"scene": string, "confidence": number, "reason": string}
2. scene 只能取上面列出的值
3. confidence 为 0~1 的浮点数
4. 禁止输出任何额外文字、Markdown、代码块`;

function buildUserPrompt(f: WindowFeatures): string {
  return [
    `进程名: ${f.process_name || '(空)'}`,
    `窗口标题: ${f.window_title || '(空)'}`,
    `显示模式: ${f.display_mode}`,
    `窗口尺寸: ${f.window_width}x${f.window_height}`,
    `有音频会话: ${f.has_audio_session}`,
    `媒体活跃: ${f.is_media_active}`,
    '',
    '请分类为 JSON。',
  ].join('\n');
}

/* ====================== 云端调用 ====================== */

async function _callLlm(
  cfg: CloudAiConfig,
  features: WindowFeatures,
  signal: AbortSignal,
): Promise<{ scene: SceneType; confidence: number; raw?: string }> {
  const userPrompt = buildUserPrompt(features);
  const systemPrompt = cfg.customPrompt.trim() || SYSTEM_PROMPT;

  const url = `${cfg.baseUrl.replace(/\/$/, '')}/chat/completions`;
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    authorization: `Bearer ${cfg.apiKey}`,
  };
  if (cfg.provider === 'anthropic') {
    headers['x-api-key'] = cfg.apiKey;
    headers['anthropic-version'] = '2023-06-01';
    delete headers.authorization;
  }

  const body: Record<string, unknown> = {
    model: cfg.model,
    temperature: 0,
    max_tokens: cfg.provider === 'anthropic' ? 256 : undefined,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  };
  if (cfg.provider === 'anthropic') {
    body.system = systemPrompt;
    body.messages = [{ role: 'user', content: userPrompt }];
  }

  const resp = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal,
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`HTTP ${resp.status}: ${text.slice(0, 200)}`);
  }
  const json = (await resp.json()) as { choices?: { message?: { content?: string } }[] };
  const content = json.choices?.[0]?.message?.content ?? '';
  const parsed = extractJson(content);
  if (!parsed) throw new Error(`invalid response: ${content.slice(0, 120)}`);
  const scene = (SCENE_VALUES.includes(parsed.scene as SceneType) ? parsed.scene : 'unknown') as SceneType;
  const confidence = typeof parsed.confidence === 'number' ? Math.max(0, Math.min(1, parsed.confidence)) : 0.5;
  return { scene, confidence, raw: content };
}

function extractJson(text: string): { scene?: unknown; confidence?: unknown } | null {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end < start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

/** 对外主入口：在 config.mode 允许时调用云端 AI 补充分类 */
export async function classifyByCloud(features: WindowFeatures): Promise<CloudAiResult | null> {
  if (!_loaded) await reloadCloudAiConfig();
  const cfg = _config;

  if (cfg.mode === 'local_only' || cfg.mode === 'manual') return null;

  const key = cacheKey(features);
  const ttlMs = cfg.cacheTtlHour * 60 * 60 * 1000;
  const cached = await _getCached(key, ttlMs);
  if (cached) return { scene: cached.scene, confidence: cached.confidence, usedCache: true };

  // 节流
  const intervalMs = cfg.minIntervalSec * 1000;
  if (Date.now() - _lastCallAt < intervalMs) return null;
  _lastCallAt = Date.now();

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), cfg.timeoutSec * 1000);
  try {
    const result = await _callLlm(cfg, features, controller.signal);
    await _setCached(key, { scene: result.scene, confidence: result.confidence, ts: Date.now() });
    return { ...result, usedCache: false };
  } catch (err) {
    if (cfg.showErrorHint) {
      // eslint-disable-next-line no-console
      console.warn('[CloudAI] classify failed', err instanceof Error ? err.message : String(err));
    }
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}

/* ====================== 模型列表获取 & 延迟测试 ====================== */

/** 解析自定义请求头字符串为对象 */
export function parseCustomHeaders(raw: string): Record<string, string> {
  const headers: Record<string, string> = {};
  if (!raw) return headers;
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf(':');
    if (idx < 1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    if (key) headers[key] = val;
  }
  return headers;
}

/** 获取服务商可用模型列表 (OpenAI 兼容 /v1/models) */
export async function fetchModelList(cfg: CloudAiConfig): Promise<string[]> {
  const url = `${cfg.baseUrl.replace(/\/$/, '')}/models`;
  const headers: Record<string, string> = {
    authorization: `Bearer ${cfg.apiKey}`,
    ...parseCustomHeaders(cfg.customHeaders),
  };
  if (cfg.provider === 'anthropic') {
    headers['x-api-key'] = cfg.apiKey;
    headers['anthropic-version'] = '2023-06-01';
    delete headers.authorization;
  }
  const resp = await fetch(url, { headers, signal: AbortSignal.timeout(8000) });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const json = await resp.json() as { data?: { id: string }[] };
  if (!json.data?.length) return [];
  return json.data.map(m => m.id).filter(Boolean).sort();
}

/** 测试模型连通性并返回延迟 (ms) */
export async function testModelLatency(cfg: CloudAiConfig): Promise<number> {
  const start = performance.now();
  const url = `${cfg.baseUrl.replace(/\/$/, '')}/chat/completions`;
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    authorization: `Bearer ${cfg.apiKey}`,
    ...parseCustomHeaders(cfg.customHeaders),
  };
  if (cfg.provider === 'anthropic') {
    headers['x-api-key'] = cfg.apiKey;
    headers['anthropic-version'] = '2023-06-01';
    delete headers.authorization;
  }
  const body = {
    model: cfg.model,
    max_tokens: 1,
    messages: [{ role: 'user', content: 'hi' }],
  };
  const resp = await fetch(url, {
    method: 'POST', headers, body: JSON.stringify(body),
    signal: AbortSignal.timeout(cfg.timeoutSec * 1000),
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  await resp.text();
  return Math.round(performance.now() - start);
}
