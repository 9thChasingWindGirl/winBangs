<template>
    <div class="dynamic-set-dashboard">

        <div class="grid-section">

            <div class="neo-card">
                <div class="card-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" class="title-icon">
                        <path
                            d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    <span>{{ t('dynamicEffect') }}</span>
                </div>
                <div class="card-body-stack">
                    <div class="spring-selector">
                        <button class="spring-btn" :class="{ active: springStyle === 'stiff' }"
                            @click="springStyle = 'stiff'">
                            <svg viewBox="0 0 24 24" class="spring-icon">
                                <path d="M4 12 L8 8 L12 16 L16 8 L20 12" stroke="currentColor" stroke-width="2" fill="none"
                                    stroke-linejoin="round" />
                            </svg>
                            <span>{{ t('springStiff') }}</span>
                        </button>
                        <button class="spring-btn" :class="{ active: springStyle === 'bouncy' }"
                            @click="springStyle = 'bouncy'">
                            <svg viewBox="0 0 24 24" class="spring-icon">
                                <path d="M3 12 C 7 2, 10 22, 14 12 C 16 7, 18 16, 21 12" stroke="currentColor"
                                    stroke-width="2" fill="none" stroke-linecap="round" />
                            </svg>
                            <span>{{ t('springBouncy') }}</span>
                        </button>
                    </div>
                    <div class="form-item inline">
                        <span class="label">{{ t('coverglassMode') }}</span>
                        <label class="neo-switch">
                            <input type="checkbox" :checked="islandTheme === 'coverglass'"
                                @change="islandTheme = ($event.target as HTMLInputElement).checked ? 'coverglass' : 'auto'">
                            <span class="neo-slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="neo-card">
                <div class="card-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" class="title-icon">
                        <rect x="4" y="4" width="12" height="12" rx="2" ry="2" />
                        <rect x="8" y="8" width="12" height="12" rx="2" ry="2" />
                    </svg>
                    <span>{{ t('windowHierarchy') }}</span>
                </div>
                <div class="form-group-list">
                    <div class="form-item">
                        <span class="label">任务栏组件</span>
                        <label class="mock-switch">
                            <input type="checkbox" v-model="enableTaskbarPlugin" @change="toggleTaskbar">
                            <span class="slider"></span>
                        </label>
                    </div>

                    <div class="form-item mt-auto">
                        <span class="label">{{ t('lyricDelay') }}</span>
                        <div class="stepper-control">
                            <button @click="lyricDelay -= 0.25">-</button>
                            <input type="text" :value="lyricDelay > 0 ? '+' + lyricDelay + 's' : lyricDelay + 's'"
                                readonly style="width: 50px;">
                            <button @click="lyricDelay += 0.25">+</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div class="list-section">
            <div class="card-header" style="margin-bottom: 12px;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" class="title-icon">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
                <span style="font-size: 16px; letter-spacing: 0.5px;">{{ t('islandSpec') }}</span>
            </div>

            <div class="slider-list-container">
                <!-- 圆角曲率 -->
                <div class="slider-row">
                    <div class="row-info">
                        <div class="title-wrapper">
                            <span class="row-title">{{ t('cornerRadius') }}</span>
                            <transition name="badge-fade">
                                <span v-if="borderRadius !== 100" class="status-badge">已生效</span>
                            </transition>
                        </div>
                        <span class="row-desc">{{ t('cornerRadiusDesc') }}</span>
                    </div>
                    <div class="row-action">
                        <input type="range" min="8" max="100" v-model.number="borderRadius"
                            class="track-slider highlight-slider" />
                        <div class="value-box">{{ borderRadius === 100 ? '100' : borderRadius }}<span class="unit">{{ borderRadius === 100 ? '%' : 'PX' }}</span></div>
                        <button class="reset-btn" @click="borderRadius = 100" :title="t('restoreDefault')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                <path d="M3 3v5h5" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="slider-row">
                    <div class="row-info">
                        <div class="title-wrapper">
                            <span class="row-title">{{ t('baseWidth') }}</span>
                            <transition name="badge-fade">
                                <span v-if="baseWidth !== 150" class="status-badge">已生效</span>
                            </transition>
                        </div>
                        <span class="row-desc">{{ t('baseWidthDesc') }}</span>
                    </div>
                    <div class="row-action">
                        <input type="range" min="140" max="300" v-model.number="baseWidth"
                            class="track-slider highlight-slider" />
                        <div class="value-box">{{ baseWidth }}<span class="unit">PX</span></div>
                        <button class="reset-btn" @click="baseWidth = 150" :title="t('restoreDefault')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                <path d="M3 3v5h5" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="slider-row">
                    <div class="row-info">
                        <div class="title-wrapper">
                            <span class="row-title">{{ t('baseHeight') }}</span>
                            <transition name="badge-fade"> <span v-if="baseHeight !== 34"
                                    class="status-badge">已生效</span>
                            </transition>
                        </div>
                        <span class="row-desc">{{ t('baseHeightDesc') }}</span>
                    </div>
                    <div class="row-action">
                        <input type="range" min="30" max="60" v-model.number="baseHeight"
                            class="track-slider highlight-slider" />
                        <div class="value-box">{{ baseHeight }}<span class="unit">PX</span></div>
                        <button class="reset-btn" @click="baseHeight = 34" :title="t('restoreDefault')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                <path d="M3 3v5h5" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="slider-row">
                    <div class="row-info">
                        <div class="title-wrapper">
                            <span class="row-title">{{ t('musicBaseWidth') }}</span>
                            <transition name="badge-fade"> <span v-if="musicBaseWidth !== 260"
                                    class="status-badge">已生效</span>
                            </transition>
                        </div>
                        <span class="row-desc">{{ t('musicBaseWidthDesc') }}</span>
                    </div>
                    <div class="row-action">
                        <input type="range" min="200" max="400" v-model.number="musicBaseWidth"
                            class="track-slider highlight-slider" />
                        <div class="value-box">{{ musicBaseWidth }}<span class="unit">PX</span></div>
                        <button class="reset-btn" @click="musicBaseWidth = 260" :title="t('restoreDefault')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                <path d="M3 3v5h5" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="slider-row">
                    <div class="row-info">
                        <div class="title-wrapper">
                            <span class="row-title">{{ t('mediaCardWidth') }}</span>
                            <transition name="badge-fade"> <span v-if="musicExpandedWidth !== 320"
                                    class="status-badge">已生效</span>
                            </transition>
                        </div>
                        <span class="row-desc">{{ t('mediaCardWidthDesc') }}</span>
                    </div>
                    <div class="row-action">
                        <input type="range" min="260" max="480" v-model.number="musicExpandedWidth"
                            class="track-slider highlight-slider" />
                        <div class="value-box">{{ musicExpandedWidth }}<span class="unit">PX</span></div>
                        <button class="reset-btn" @click="musicExpandedWidth = 320" :title="t('restoreDefault')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                <path d="M3 3v5h5" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="slider-row">
                    <div class="row-info">
                        <div class="title-wrapper">
                            <span class="row-title">{{ t('msgCardWidth') }}</span>
                            <transition name="badge-fade"> <span v-if="msgExpandedWidth !== 360"
                                    class="status-badge">已生效</span>
                            </transition>
                        </div>
                        <span class="row-desc">{{ t('msgCardWidthDesc') }}</span>
                    </div>
                    <div class="row-action">
                        <input type="range" min="300" max="600" v-model.number="msgExpandedWidth"
                            class="track-slider highlight-slider" />
                        <div class="value-box">{{ msgExpandedWidth }}<span class="unit">PX</span></div>
                        <button class="reset-btn" @click="msgExpandedWidth = 360" :title="t('restoreDefault')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                <path d="M3 3v5h5" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="slider-row">
                    <div class="row-info">
                        <div class="title-wrapper">
                            <span class="row-title">{{ t('globalScale') }}</span>
                            <transition name="badge-fade">
                                <span v-if="appScale !== 1.0" class="status-badge">已生效</span>
                            </transition>
                        </div>
                        <span class="row-desc">{{ t('globalScaleDesc') }}</span>
                    </div>
                    <div class="row-action">
                        <input type="range" min="1" max="1.75" step="0.25" v-model.number="appScale"
                            class="track-slider highlight-slider" />
                        <div class="value-box">{{ Math.round(appScale * 100) }}<span class="unit">%</span></div>
                        <button class="reset-btn" @click="appScale = 1.0" :title="t('restoreDefault')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                <path d="M3 3v5h5" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { emit } from '@tauri-apps/api/event';
import { t } from '../i18n';
import { invoke } from '@tauri-apps/api/core';

const baseWidth = ref(Number(localStorage.getItem('wbs_base_width')) || 150);
const baseHeight = ref(Number(localStorage.getItem('wbs_base_height')) || 34);
const musicBaseWidth = ref(Number(localStorage.getItem('wbs_music_base_width')) || 260);
const musicExpandedWidth = ref(Number(localStorage.getItem('wbs_music_expanded_width')) || 320);
const msgExpandedWidth = ref(Number(localStorage.getItem('wbs_msg_expanded_width')) || 360);
const appScale = ref(Number(localStorage.getItem('wbs_app_scale')) || 1.0);

const borderRadius = ref(Number(localStorage.getItem('wbs_border_radius')) || 100);
const islandTheme = ref(localStorage.getItem('wbs_island_theme') || 'auto');

const springStyle = ref<'stiff' | 'bouncy'>((localStorage.getItem('wbs_spring_style') as 'stiff' | 'bouncy') || 'bouncy');

const lyricDelay = ref(Number(localStorage.getItem('wbs_lyric_delay')) || 0);

const emits = defineEmits(['show-plugin-dialog']);
const enableTaskbarPlugin = ref(localStorage.getItem('wbs_taskbar_plugin') === 'true');
const toggleTaskbar = async () => {
    try {
        await invoke('toggle_taskbar_plugin', { enable: enableTaskbarPlugin.value });
        localStorage.setItem('wbs_taskbar_plugin', String(enableTaskbarPlugin.value));
    } catch (err: any) {
        enableTaskbarPlugin.value = false;
        localStorage.setItem('wbs_taskbar_plugin', 'false');
        emits('show-plugin-dialog');
    }
};

watch([baseWidth, baseHeight, musicBaseWidth, musicExpandedWidth, msgExpandedWidth, borderRadius, islandTheme, springStyle, appScale, lyricDelay], async () => {
    localStorage.setItem('wbs_base_width', String(baseWidth.value));
    localStorage.setItem('wbs_base_height', String(baseHeight.value));
    localStorage.setItem('wbs_music_base_width', String(musicBaseWidth.value));
    localStorage.setItem('wbs_music_expanded_width', String(musicExpandedWidth.value));
    localStorage.setItem('wbs_msg_expanded_width', String(msgExpandedWidth.value));
    localStorage.setItem('wbs_border_radius', String(borderRadius.value));
    localStorage.setItem('wbs_island_theme', String(islandTheme.value));
    localStorage.setItem('wbs_spring_style', springStyle.value);
    localStorage.setItem('wbs_app_scale', String(appScale.value));
    localStorage.setItem('wbs_lyric_delay', String(lyricDelay.value));

    await emit('control-island-theme', { theme: islandTheme.value });

    await emit('sync-dynamic-settings', {
        baseWidth: baseWidth.value,
        baseHeight: baseHeight.value,
        musicBaseWidth: musicBaseWidth.value,
        musicExpandedWidth: musicExpandedWidth.value,
        msgExpandedWidth: msgExpandedWidth.value,
        borderRadius: borderRadius.value,
        springStyle: springStyle.value,
        appScale: appScale.value,
        lyricDelay: lyricDelay.value,
    });
}, { deep: true });
</script>

<style scoped>
.dynamic-set-dashboard {
    display: flex;
    flex-direction: column;
    gap: 18px;
    height: 100%;
    max-height: calc(100vh - 120px);
    overflow: hidden;
    box-sizing: border-box;
    user-select: none;
}

.grid-section {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    flex-shrink: 0;
}

.neo-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 18px;
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
    box-shadow: 0 2px 12px var(--card-shadow);
    position: relative;
    overflow: hidden;
}
.neo-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent, #22c55e), transparent);
    opacity: 0;
    transition: opacity 0.3s;
}
.neo-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px var(--card-shadow);
}
.neo-card:hover::before { opacity: 1; }

.card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: var(--item-title);
    margin-bottom: 14px;
    letter-spacing: 0.01em;
}

.title-icon {
    width: 16px;
    height: 16px;
    color: var(--accent);
    opacity: 0.8;
}

.card-body-stack {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
}
.spring-selector {
    display: flex;
    gap: 10px;
    flex: 1;
}
.form-item.inline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: rgba(0,0,0,0.02);
    border: 1px solid var(--divider-border);
    border-radius: 12px;
}
:global(.dark-theme) .form-item.inline { background: rgba(255,255,255,0.03); }

.spring-btn {
    flex: 1;
    background: rgba(0,0,0,0.02);
    border: 1.5px solid var(--divider-border);
    border-radius: 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: var(--item-desc);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 12px 8px;
    position: relative;
}
.spring-btn:hover {
    background: rgba(0,0,0,0.04);
    color: var(--item-title);
    transform: translateY(-1px);
}
.spring-btn.active {
    background: linear-gradient(135deg, color-mix(in oklab, var(--accent) 15%, transparent), color-mix(in oklab, var(--accent) 5%, transparent));
    border-color: var(--accent);
    color: var(--accent);
    box-shadow: 0 4px 16px -4px color-mix(in oklab, var(--accent) 40%, black 60%);
}

.spring-icon {
    width: 24px;
    height: 24px;
}

.form-group-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
    flex: 1;
}

.form-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.mt-auto { margin-top: auto; }

.label {
    font-size: 13px;
    color: var(--item-title);
    font-weight: 500;
}

.shape-toggle { display: flex; gap: 6px; }

.shape-toggle button {
    width: 32px;
    height: 20px;
    background: rgba(0,0,0,0.04);
    border: 2px solid transparent;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
}
.shape-toggle button.active {
    border-color: var(--accent);
    background: color-mix(in oklab, var(--accent) 12%, transparent);
    box-shadow: 0 0 0 1px color-mix(in oklab, var(--accent) 30%, transparent);
}

.neo-switch {
    position: relative; display: inline-block;
    width: 42px; height: 24px;
}
.neo-switch input { opacity: 0; width: 0; height: 0; }
.neo-slider {
    position: absolute; cursor: pointer; inset: 0;
    background: rgba(0,0,0,0.1); border-radius: 999px;
    transition: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
:global(.dark-theme) .neo-slider { background: rgba(255,255,255,0.1); }
.neo-slider::before {
    content: ""; position: absolute;
    height: 18px; width: 18px; left: 3px; bottom: 3px;
    background: #fff; border-radius: 50%;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    transition: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.neo-switch input:checked + .neo-slider {
    background: var(--accent);
}
.neo-switch input:checked + .neo-slider::before {
    transform: translateX(18px);
}

.mock-switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
}

.mock-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: var(--slider-bg);
    transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 24px;
    border: 1px solid var(--divider-border);
}

.slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 2px;
    bottom: 2px;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 50%;
}

input:checked + .slider {
    background-color: var(--accent);
    border-color: var(--accent);
}
input:checked + .slider:before { transform: translateX(20px); }

.stepper-control {
    display: flex;
    align-items: center;
    background: rgba(0,0,0,0.03);
    border-radius: 10px;
    border: 1px solid var(--divider-border);
    overflow: hidden;
}

.stepper-control button {
    width: 28px;
    height: 24px;
    background: transparent;
    border: none;
    color: var(--item-title);
    cursor: pointer;
    font-weight: bold;
}
.stepper-control button:hover {
    background: var(--accent);
    color: #fff;
}
.stepper-control input {
    width: 44px;
    text-align: center;
    background: transparent;
    border: none;
    color: var(--item-title);
    font-size: 13px;
    font-family: 'Geist Mono', 'JetBrains Mono', monospace;
    pointer-events: none;
}

.list-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 18px;
    padding: 16px 18px;
    overflow-y: auto;
    box-shadow: 0 2px 12px var(--card-shadow);
}

.list-section::-webkit-scrollbar { width: 4px; }
.list-section::-webkit-scrollbar-track { background: transparent; }
.list-section::-webkit-scrollbar-thumb { background-color: var(--slider-bg); border-radius: 4px; }
.list-section::-webkit-scrollbar-thumb:hover { background-color: var(--accent); }

.slider-list-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    align-content: flex-start;
}

.slider-row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 14px;
    background: rgba(0,0,0,0.015);
    border-radius: 12px;
    border: 1px solid rgba(0,0,0,0.03);
    transition: border-color 0.2s, background 0.2s;
}
.slider-row:hover {
    background: rgba(0,0,0,0.03);
    border-color: color-mix(in oklab, var(--accent) 20%, transparent);
}

.row-info { display: flex; flex-direction: column; gap: 2px; width: 100%; }

.row-title { font-size: 13px; font-weight: 600; color: var(--item-title); }

.row-desc { font-size: 11px; color: var(--muted); }

.row-action {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 10px;
}

.track-slider {
    -webkit-appearance: none;
    appearance: none;
    flex: 1;
    width: auto;
    height: 6px;
    background: var(--slider-bg);
    border-radius: 3px;
    outline: none;
}

.track-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 2px 8px color-mix(in oklab, var(--accent) 30%, black 70%);
    cursor: pointer;
    transition: transform 0.1s;
}
.track-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }

.value-box {
    width: 54px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.04);
    border: 1px solid var(--divider-border);
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    color: var(--item-title);
    font-family: 'JetBrains Mono', ui-monospace, monospace;
}

.value-box .unit {
    font-size: 10px;
    padding: 1px 3px;
    border-radius: 4px;
    background: rgba(0,0,0,0.04);
    color: var(--muted);
    margin-left: 2px;
}

.reset-btn {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.03);
    border: 1px solid var(--divider-border);
    border-radius: 8px;
    color: var(--item-title);
    cursor: pointer;
    transition: all 0.2s;
    padding: 0;
}
.reset-btn:hover {
    background: var(--accent);
    color: #fff;
    border-color: var(--accent);
}

.reset-btn svg { width: 12px; height: 12px; }

.title-wrapper {
    display: flex;
    align-items: center;
    gap: 6px;
}

.status-badge {
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 4px;
    background: color-mix(in oklab, var(--accent) 15%, transparent);
    color: var(--accent);
    font-weight: 600;
    line-height: 1;
}

.badge-fade-enter-active,
.badge-fade-leave-active {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.badge-fade-enter-from,
.badge-fade-leave-to {
    opacity: 0;
    transform: scale(0.8);
}
</style>
