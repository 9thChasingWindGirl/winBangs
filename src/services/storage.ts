/**
 * 通用 JSON 配置持久化工具
 *
 * 设计：
 *   - 开发期（Tauri 不可用）: localStorage 兜底，保证热更新可运行
 *   - 生产期（Tauri 可用）:   通过 @tauri-apps/plugin-store 或
 *                             invoke('save_config'/'load_config') 落到
 *                             %APPDATA%/winBangs/ 目录下的 JSON 文件
 *
 * 调用方只需关心 get/set，不感知底层存储介质。
 */

import type { Ref } from 'vue';
import { ref, watch } from 'vue';

type Serializer<T> = {
  parse: (raw: string) => T;
  stringify: (value: T) => string;
};

const defaultSerializer: Serializer<unknown> = {
  parse: (s) => {
    try {
      return JSON.parse(s);
    } catch {
      return null;
    }
  },
  stringify: (v) => JSON.stringify(v),
};

function hasTauriStore(): boolean {
  try {
    // @ts-expect-error runtime probe
    return typeof window.__TAURI_INTERNALS__ !== 'undefined' || typeof window.__TAURI__ !== 'undefined';
  } catch {
    return false;
  }
}

/**
 * 读取一个配置项
 */
export async function loadConfig<T>(key: string, fallback: T, serializer?: Serializer<T>): Promise<T> {
  const s = (serializer ?? defaultSerializer) as Serializer<T>;
  try {
    if (hasTauriStore()) {
      // 优先走 tauri-plugin-store（若已在 Cargo.toml 注册）
      try {
        const moduleName = '@tauri-apps/plugin-store';
        const mod = await import(/* @vite-ignore */ moduleName);
        const store = await mod.Store.load('settings.json', {});
        const raw = await store.get<T>(key);
        if (raw !== undefined && raw !== null) return raw as T;
      } catch {
        // store 未安装 → 走 invoke 通道，由 Rust 命令负责读写
        try {
          const { invoke } = await import('@tauri-apps/api/core');
          const raw = await invoke<string | null>('load_config', { key });
          if (raw) return s.parse(raw) ?? fallback;
        } catch {
          // 命令也没有 → 降级 localStorage
        }
      }
    }
    const local = localStorage.getItem(key);
    if (local) return s.parse(local) ?? fallback;
  } catch {
    /* ignore */
  }
  return fallback;
}

/**
 * 写入一个配置项
 */
export async function saveConfig<T>(key: string, value: T, serializer?: Serializer<T>): Promise<void> {
  const s = (serializer ?? defaultSerializer) as Serializer<T>;
  try {
    localStorage.setItem(key, s.stringify(value));
    if (hasTauriStore()) {
      try {
        const moduleName = '@tauri-apps/plugin-store';
        const mod = await import(/* @vite-ignore */ moduleName);
        const store = await mod.Store.load('settings.json', {});
        await store.set(key, value as unknown as Record<string, unknown> | string | number | boolean | null);
        await store.save();
        return;
      } catch {
        try {
          const { invoke } = await import('@tauri-apps/api/core');
          await invoke('save_config', { key, value: s.stringify(value) });
          return;
        } catch {
          /* 两端都不可用，保留 localStorage 即可 */
        }
      }
    }
  } catch {
    /* ignore */
  }
}

/**
 * 将 Vue ref 与配置存储双向绑定。写入自动持久化，启动时自动加载。
 */
export function usePersistentRef<T>(
  key: string,
  initial: T,
  serializer?: Serializer<T>,
): Ref<T> & { ready: Promise<void> } {
  const state = ref(initial) as Ref<T> & { ready?: Promise<void> };
  let loaded = false;

  const ready = loadConfig<T>(key, initial, serializer).then((v) => {
    state.value = v;
    loaded = true;
  });
  state.ready = ready;

  watch(
    state,
    (val) => {
      if (!loaded) return;
      void saveConfig<T>(key, val, serializer);
    },
    { deep: true },
  );

  return state as Ref<T> & { ready: Promise<void> };
}
