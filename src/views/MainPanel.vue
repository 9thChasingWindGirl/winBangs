<template>
    <div class="app-shell">
        <div v-if="themeMode === 'coverglass'" class="coverglass-bg-container">
            <div class="coverglass-bg-image" :style="coverUrl ? { backgroundImage: `url(${coverUrl})` } : {}"></div>
            <div class="coverglass-blur-layer"></div>
            <div class="coverglass-noise-layer"></div>
        </div>

        <!-- ===================== Header (网易云顶部栏样式) ===================== -->
        <header class="app-header" data-tauri-drag-region>
            <div class="header-left">
                <div class="brand-mini">
                    <img src="../assets/logo.png" class="logo-mini">
                    <span class="app-name">winBangs</span>
                </div>
            </div>

            <div class="header-right">
                <div class="window-ctl">
                    <button class="win-btn" title="Minimize" @click="minimizeWindow">
                        <svg viewBox="0 0 12 12" fill="currentColor">
                            <rect x="1" y="5" width="10" height="1.5" rx="0.5" />
                        </svg>
                    </button>
                    <button class="win-btn close" title="Close" @click="closeWindow">
                        <svg viewBox="0 0 12 12" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
                            <path d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>

        <!-- ===================== Body: Sidebar + Main Zone ===================== -->
        <div class="app-body">
            <!-- Sidebar (网易云左侧导航风格) -->
            <aside class="app-sidebar">
                <nav class="nav-group">
                    <p class="nav-group-title">{{ t('navOverview') }}</p>
                    <button class="nav-item" :class="{ active: activePage === 'overview' }" @click="activePage = 'overview'">
                        <svg viewBox="0 0 24 24" class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="3" width="7" height="9"></rect>
                            <rect x="14" y="3" width="7" height="5"></rect>
                            <rect x="14" y="12" width="7" height="9"></rect>
                            <rect x="3" y="16" width="7" height="5"></rect>
                        </svg>
                        <span>{{ t('navOverview') }}</span>
                    </button>
                    <button class="nav-item" :class="{ active: activePage === 'personalize' }" @click="activePage = 'personalize'">
                        <svg viewBox="0 0 24 24" class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 3l2.4 5.4L20 9l-4 3.9.9 5.5L12 15.8 7.1 18.4 8 12.9 4 9l5.6-.6z"></path>
                        </svg>
                        <span>{{ t('navPersonalization') }}</span>
                    </button>
                </nav>

                <nav class="nav-group">
                    <p class="nav-group-title">{{ t('navSceneRules') }}</p>
                    <button class="nav-item" :class="{ active: activePage === 'scene-rules' }" @click="activePage = 'scene-rules'">
                        <svg viewBox="0 0 24 24" class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 4h16v4H4zM4 12h16v4H4zM4 20h10"></path>
                            <circle cx="19" cy="20" r="2"></circle>
                        </svg>
                        <span>{{ t('navSceneRules') }}</span>
                    </button>
                    <button class="nav-item" :class="{ active: activePage === 'cloud-ai' }" @click="activePage = 'cloud-ai'">
                        <svg viewBox="0 0 24 24" class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
                        </svg>
                        <span>{{ t('navCloudAi') }}</span>
                    </button>
                </nav>

                <nav class="nav-group">
                    <p class="nav-group-title">{{ t('navSettings') }}</p>
                    <button class="nav-item" :class="{ active: activePage === 'settings' }" @click="activePage = 'settings'">
                        <svg viewBox="0 0 24 24" class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                        <span>{{ t('navSettings') }}</span>
                    </button>
                    <button class="nav-item" :class="{ active: activePage === 'about' }" @click="activePage = 'about'">
                        <svg viewBox="0 0 24 24" class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                        <span>{{ t('navAbout') }}</span>
                    </button>
                </nav>
            </aside>

            <!-- Main Zone -->
            <main class="app-main">
                <div class="main-scroll">

                    <!-- ========== Page: Overview (总览) ========== -->
                    <section v-if="activePage === 'overview'" class="page page-overview">
                        <header class="page-header">
                            <h2>{{ t('overviewTitle') }}</h2>
                            <p class="page-sub">Dashboard — Scene, Island, Weather, Media</p>
                        </header>

                        <!-- 识别模式切换 + 主题色 -->
                        <div class="overview-row">
                            <div class="overview-section">
                                <div class="section-label">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
                                    </svg>
                                    {{ t('aiMode') }}
                                </div>
                                <div class="segmented">
                                    <button v-for="m in aiModes" :key="m.value"
                                        class="seg-btn" :class="{ active: cloudCfg.mode === m.value }"
                                        :disabled="m.value === 'local_cloud' && !aiIsConfigured"
                                        @click="patchAiCfg({ mode: m.value })">
                                        {{ t(m.labelKey) }}
                                    </button>
                                </div>
                            </div>
                            <!-- 主题色选择器 -->
                            <div class="accent-picker-wrap">
                                <div class="accent-picker-label">{{ t('themeColor') }}</div>
                                <div class="accent-picker" role="radiogroup" :title="t('themeColor')">
                                    <button
                                        v-for="c in accentColors" :key="c.hex"
                                        class="accent-swatch"
                                        :class="{ 'is-selected': accentColor === c.hex }"
                                        :style="{ '--swatch-color': c.hex }"
                                        :aria-label="c.label + ' ' + c.hex"
                                        @click="selectAccentColor(c.hex)">
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="overview-grid">
                            <!-- 当前场景卡片 -->
                            <article class="big-card scene-card">
                                <div class="card-top">
                                    <h3>{{ t('currentScene') }}</h3>
                                    <span class="confidence-chip">
                                        {{ Math.round(currentSceneCtx.confidence * 100) }}% {{ t('confidence') }}
                                    </span>
                                </div>
                                <div class="scene-display">
                                    <div class="scene-hero" :class="'scene-' + currentSceneCtx.scene">
                                        <span class="scene-emoji">{{ sceneEmoji(currentSceneCtx.scene) }}</span>
                                        <div class="scene-titles">
                                            <div class="scene-name">{{ tScene(currentSceneCtx.scene) }}</div>
                                            <div class="scene-src">{{ tSource(currentSceneCtx.source) }}</div>
                                        </div>
                                    </div>
                                    <div class="scene-actions">
                                        <div class="custom-dropdown" tabindex="0" @blur="lockDropdownOpen = false">
                                            <button class="btn btn-secondary dropdown-trigger"
                                                @click.stop="lockDropdownOpen = !lockDropdownOpen">
                                                {{ t('manualLockScene') }}
                                                <svg viewBox="0 0 24 24" class="arrow-icon" :class="{ 'is-open': lockDropdownOpen }">
                                                    <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                                                </svg>
                                            </button>
                                            <transition name="dropdown">
                                                <div class="dropdown-menu" v-show="lockDropdownOpen">
                                                    <template v-for="cat in sceneCategories" :key="cat.key">
                                                        <div class="dropdown-group-label">
                                                            <span class="group-icon">{{ cat.icon }}</span>
                                                            <span class="group-name">{{ t(cat.titleKey) }}</span>
                                                        </div>
                                                        <div class="dropdown-item" v-for="s in cat.scenes" :key="s"
                                                            :class="{ 'is-active': currentSceneCtx.source === 'manual' && currentSceneCtx.scene === s }"
                                                            @click="doLockScene(s)">
                                                            <span class="item-indicator" v-if="currentSceneCtx.source === 'manual' && currentSceneCtx.scene === s">●</span>
                                                            <span class="item-indicator placeholder" v-else></span>
                                                            {{ sceneEmoji(s) }} {{ tScene(s) }}
                                                        </div>
                                                    </template>
                                                    <div class="dropdown-divider"></div>
                                                    <div class="dropdown-item" @click="doUnlockScene">
                                                        ♻️ {{ t('unlockScene') }}
                                                    </div>
                                                </div>
                                            </transition>
                                        </div>
                                    </div>
                                </div>
                                <div class="meta-row">
                                    <div class="meta">
                                        <span class="meta-k">{{ t('widgetState') }}</span>
                                        <label class="pixel-toggle-label" :for="'pixel-toggle-widget'">
                                            <input type="checkbox" id="pixel-toggle-widget" class="pixel-checkbox"
                                                :checked="isWidgetVisible" @change="toggleWidget">
                                            <div class="pixel-toggle-track">
                                                <div class="indicator-wrapper indicator-on-wrap">
                                                    <svg viewBox="0 0 8 8" class="pixel-indicator ind-on" fill="currentColor">
                                                        <path d="M1,4h2v2H1zm1,1h2v2H2zm1,1h2v2H3zm1,-2h2v3H4zm1,-2h2v3H5zm1,-2h2v3H6z" />
                                                    </svg>
                                                </div>
                                                <div class="indicator-wrapper indicator-off-wrap">
                                                    <svg viewBox="0 0 8 8" class="pixel-indicator ind-off" fill="currentColor">
                                                        <path d="M3,3h2v2H3zM2,2h2v2H2zM1,1h2v2H1zM4,2h2v2H4zM5,1h2v2H5zM2,4h2v2H2zM1,5h2v2H1zM4,4h2v2H4zM5,5h2v2H5z" />
                                                    </svg>
                                                </div>
                                                <div class="pixel-coin-thumb">
                                                    <div class="face-svg face-sad">
                                                        <svg viewBox="0 0 16 16" fill="currentColor">
                                                            <path d="M3,2h3v1H3zm7,1h3v-1h-3z" />
                                                            <path d="M4,4h2v3H4zm6,0h2v3h-2z" />
                                                            <path d="M3,11h2v2H3zm8,0h2v2h-2zm-6,-2h6v2H5z" />
                                                        </svg>
                                                    </div>
                                                    <div class="face-svg face-happy">
                                                        <svg viewBox="0 0 16 16" fill="currentColor">
                                                            <path d="M3,2h3v1H3zm7,0h3v1h-3z" />
                                                            <path d="M4,4h2v3H4zm6,0h2v3h-2z" />
                                                            <path d="M3,9h2v2H3zm8,0h2v2h-2zm-6,2h6v2H5z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                    <div class="meta">
                                        <span class="meta-k">{{ t('lastUpdated') }}</span>
                                        <span class="meta-v">{{ formatTime(currentSceneCtx.updated_at) }}</span>
                                    </div>
                                    <div class="meta">
                                        <span class="meta-k">Process</span>
                                        <span class="meta-v mono">{{ currentSceneCtx.metadata.process_name || '—' }}</span>
                                    </div>
                                </div>
                            </article>

                            <!-- 右侧栏：天气 + 媒体控制合并卡片 -->
                            <div class="widget-col">
                                <WeatherCard />

                                <!-- 音乐控制器 (场景引擎识别平台) -->
                                <article class="big-card media-ctrl-card">
                                    <div class="card-top">
                                        <h3>{{ t('musicController') }}</h3>
                                        <label class="switch mini-switch">
                                            <input type="checkbox" v-model="enableMusicCtrl">
                                            <span class="slider"></span>
                                        </label>
                                    </div>
                                    <div class="media-ctrl-body">
                                        <!-- 场景引擎识别到的音乐平台 -->
                                        <div class="music-detected-display" v-if="detectedMusicPlatform">
                                            <span class="detected-label">{{ t('detectedMusicPlatform') }}</span>
                                            <div class="detected-platform-tag" :class="{ unknown: detectedMusicPlatform === 'unknown' }">
                                                <template v-if="detectedMusicPlatform === 'netease'"><img src="../assets/musci163.svg" class="platform-icon"> {{ t('netease') }}</template>
                                                <template v-else-if="detectedMusicPlatform === 'spotify'"><img src="../assets/Spotify.svg" class="platform-icon"> Spotify</template>
                                                <template v-else-if="detectedMusicPlatform === 'apple'"><img src="../assets/applemusic.svg" class="platform-icon"> Apple</template>
                                                <template v-else-if="detectedMusicPlatform === 'qqmusic'"><img src="../assets/qqmusic.svg" class="platform-icon"> {{ t('qqMusic') }}</template>
                                                <template v-else-if="detectedMusicPlatform === 'kugou'"><img src="../assets/kugou.svg" class="platform-icon"> {{ t('kugouMusic') }}</template>
                                                <template v-else-if="detectedMusicPlatform === 'echo'"><img src="../assets/echomusic.ico" class="platform-icon"> Echo</template>
                                                <template v-else-if="detectedMusicPlatform === 'lx-music'"><img src="../assets/lxmusic.png" class="platform-icon"> {{ t('lxMusic') }}</template>
                                                <template v-else-if="detectedMusicPlatform === 'other'">
                                                    <svg viewBox="0 0 24 24" class="platform-icon" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path></svg>
                                                    {{ t('otherMediaControl') }}
                                                </template>
                                                <template v-else>
                                                    <svg viewBox="0 0 24 24" class="platform-icon" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                                    {{ t('unknownPlatform') }}
                                                </template>
                                            </div>
                                            <!-- 未识别时支持手动修正 -->
                                            <button class="correct-btn" v-if="detectedMusicPlatform === 'unknown'"
                                                @click="isPlayerDropdownOpen = !isPlayerDropdownOpen">
                                                {{ t('correctPlatform') }}
                                            </button>
                                            <transition name="dropdown">
                                                <div class="dropdown-menu correction-menu" v-show="isPlayerDropdownOpen && detectedMusicPlatform === 'unknown'">
                                                    <div class="dropdown-item" @click="correctMusicPlatform('netease')"><img src="../assets/musci163.svg" class="platform-icon"> {{ t('netease') }}</div>
                                                    <div class="dropdown-item" @click="correctMusicPlatform('spotify')"><img src="../assets/Spotify.svg" class="platform-icon"> Spotify</div>
                                                    <div class="dropdown-item" @click="correctMusicPlatform('apple')"><img src="../assets/applemusic.svg" class="platform-icon"> Apple</div>
                                                    <div class="dropdown-item" @click="correctMusicPlatform('qqmusic')"><img src="../assets/qqmusic.svg" class="platform-icon"> {{ t('qqMusic') }}</div>
                                                    <div class="dropdown-item" @click="correctMusicPlatform('kugou')"><img src="../assets/kugou.svg" class="platform-icon"> {{ t('kugouMusic') }}</div>
                                                    <div class="dropdown-item" @click="correctMusicPlatform('echo')"><img src="../assets/echomusic.ico" class="platform-icon"> Echo</div>
                                                    <div class="dropdown-item" @click="correctMusicPlatform('lx-music')"><img src="../assets/lxmusic.png" class="platform-icon"> {{ t('lxMusic') }}</div>
                                                    <div class="dropdown-item" @click="correctMusicPlatform('other')">
                                                        <svg viewBox="0 0 24 24" class="platform-icon" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path></svg>
                                                        {{ t('otherMediaControl') }}
                                                    </div>
                                                </div>
                                            </transition>
                                        </div>
                                        <!-- 未检测到音乐进程 -->
                                        <div class="music-detected-display no-music" v-else>
                                            <span class="muted">{{ t('noMusicDetected') }}</span>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </section>

                    <!-- ========== Page: Personalization (个性化) ========== -->
                    <section v-if="activePage === 'personalize'" class="page page-personalize">
                        <header class="page-header">
                            <h2>{{ t('dynamicSetTitle') }}</h2>
                        </header>
                        <DynamicSet @show-plugin-dialog="handlePluginDialog" />
                    </section>

                    <!-- ========== Page: Scene Rules (场景规则) ========== -->
                    <section v-if="activePage === 'scene-rules'" class="page page-scenerules">

                        <!-- ===== 场景分类列表页 ===== -->
                        <template v-if="!activeSceneCat">
                            <header class="page-header between">
                                <div>
                                    <h2>{{ t('sceneRulesTitle') }}</h2>
                                    <p class="page-sub">{{ t('sceneRulesDesc') }}</p>
                                </div>
                            </header>

                            <div class="scene-cat-grid">
                                <article v-for="cat in sceneCategories" :key="cat.key"
                                    class="scene-cat-card"
                                    :style="{ '--cat-color': cat.color }"
                                    @click="enterSceneCat(cat.key)">
                                    <div class="cat-icon-wrap" :style="{ background: cat.color + '20' }">
                                        <span class="cat-icon">{{ cat.icon }}</span>
                                    </div>
                                    <div class="cat-info">
                                        <h3>{{ t(cat.titleKey) }}</h3>
                                        <p>{{ t(cat.descKey) }}</p>
                                    </div>
                                    <div class="cat-stats">
                                        <span class="cat-stat-num">{{ sceneCatRules.get(cat.key)?.total ?? 0 }}</span>
                                        <span class="cat-stat-label">{{ t('rulesCount') }}</span>
                                    </div>
                                    <svg class="cat-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </article>
                            </div>
                        </template>

                        <!-- ===== 场景详情页 ===== -->
                        <template v-else>
                            <header class="page-header between">
                                <div class="scene-detail-head">
                                    <button class="btn btn-secondary mini back-btn" @click="backToSceneList">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                            <polyline points="15 18 9 12 15 6"></polyline>
                                        </svg>
                                    </button>
                                    <span class="cat-icon-sm">{{ currentCat?.icon }}</span>
                                    <div>
                                        <h2>{{ currentCat ? t(currentCat.titleKey) : '' }}</h2>
                                        <p class="page-sub">{{ currentCat ? t(currentCat.descKey) : '' }}</p>
                                    </div>
                                </div>
                                <div class="head-actions">
                                    <button class="btn btn-secondary" @click="resetTiltForCat">
                                        {{ t('resetTiltToDefault') }}
                                    </button>
                                </div>
                            </header>

                            <!-- ===== 权重方案（主） ===== -->
                            <section class="tilt-scheme-section">
                                <header class="section-header tilt-scheme-header">
                                    <div class="tilt-scheme-header-left">
                                        <h3>{{ t('tiltSchemeTitle') }}</h3>
                                        <p class="page-sub">{{ t('tiltSchemeDesc') }}</p>
                                    </div>
                                    <div class="head-actions tilt-scheme-actions">
                                        <button class="btn btn-secondary" @click="handleAiGenRules"
                                            :disabled="cloudCfg.mode === 'local_only' || !aiIsConfigured">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px;">
                                                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8 5.8 21.3l2.4-7.4L2 9.4h7.6z"></path>
                                            </svg>
                                            {{ t('aiGenerateRules') }}
                                        </button>
                                    </div>
                                </header>
                                <div class="tilt-card-grid">
                                    <article v-for="tp in currentCatTiltProfiles" :key="tp.scene"
                                        class="tilt-card" :class="{ disabled: !tp.enabled }">
                                        <div class="tilt-card-head">
                                            <div class="tilt-card-title">
                                                <span class="cat-icon-sm">{{ sceneEmoji(tp.scene) }}</span>
                                                <h4>{{ tScene(tp.scene) }}</h4>
                                            </div>
                                            <label class="switch mini-switch">
                                                <input type="checkbox" :checked="tp.enabled"
                                                    @change="toggleTiltEnabled(tp.scene, $event)">
                                                <span class="slider"></span>
                                            </label>
                                        </div>
                                        <div class="tilt-params">
                                            <!-- 最大保护值 -->
                                            <div class="tilt-param" :title="t('tiltMaxFloorDesc')">
                                                <span class="tilt-param-label">{{ t('tiltMaxFloor') }}</span>
                                                <input type="range" min="0.5" max="1.0" step="0.05"
                                                    :value="tp.maxFloor"
                                                    @input="updateTiltNow(tp.scene, 'maxFloor', Number(($event.target as HTMLInputElement).value))"
                                                    class="tilt-slider">
                                                <span class="tilt-param-val">{{ (tp.maxFloor * 100).toFixed(0) }}%</span>
                                            </div>
                                            <!-- 保护地板 -->
                                            <div class="tilt-param" :title="t('tiltFloorDesc')">
                                                <span class="tilt-param-label">{{ t('tiltFloor') }}</span>
                                                <input type="range" min="0.30" max="0.80" step="0.05"
                                                    :value="tp.floor"
                                                    @input="updateTiltNow(tp.scene, 'floor', Number(($event.target as HTMLInputElement).value))"
                                                    class="tilt-slider">
                                                <span class="tilt-param-val">{{ (tp.floor * 100).toFixed(0) }}%</span>
                                            </div>
                                            <!-- 衰减时长 -->
                                            <div class="tilt-param" :title="t('tiltDecayTimeDesc')">
                                                <span class="tilt-param-label">{{ t('tiltDecayTime') }}</span>
                                                <input type="range" min="10" max="600" step="10"
                                                    :value="Math.round(tp.decayMs / 1000)"
                                                    @input="updateTiltMs(tp.scene, 'decayMs', Number(($event.target as HTMLInputElement).value) * 1000)"
                                                    class="tilt-slider">
                                                <span class="tilt-param-val">{{ msToDisplay(tp.decayMs) }}</span>
                                            </div>
                                            <!-- 保定期 -->
                                            <div class="tilt-param" :title="t('tiltHoldTimeDesc')">
                                                <span class="tilt-param-label">{{ t('tiltHoldTime') }}</span>
                                                <input type="range" min="0" max="30" step="1"
                                                    :value="Math.round(tp.holdMs / 60000)"
                                                    @input="updateTiltMs(tp.scene, 'holdMs', Number(($event.target as HTMLInputElement).value) * 60000)"
                                                    class="tilt-slider">
                                                <span class="tilt-param-val">{{ msToDisplay(tp.holdMs) }}</span>
                                            </div>
                                            <!-- 放弃期 -->
                                            <div class="tilt-param" :title="t('tiltAbandonTimeDesc')">
                                                <span class="tilt-param-label">{{ t('tiltAbandonTime') }}</span>
                                                <input type="range" min="0" max="30" step="1"
                                                    :value="Math.round(tp.abandonMs / 60000)"
                                                    @input="updateTiltMs(tp.scene, 'abandonMs', Number(($event.target as HTMLInputElement).value) * 60000)"
                                                    class="tilt-slider">
                                                <span class="tilt-param-val">{{ msToDisplay(tp.abandonMs) }}</span>
                                            </div>
                                        </div>
                                    </article>
                                </div>
                            </section>

                            <!-- ===== 场景属性 - 进程特征识别（辅） ===== -->
                            <section class="affinity-section">
                                <header class="section-header">
                                    <h3>{{ t('sceneAffinityTitle') }}</h3>
                                    <p class="page-sub">{{ t('sceneAffinityDesc') }}</p>
                                </header>

                                <div class="rules-list" v-if="currentCatRules.length">
                                    <article v-for="rule in currentCatRules" :key="rule.id" class="rule-card" :class="{ disabled: !rule.enabled }">
                                        <header class="rule-head">
                                            <div class="rule-head-l">
                                                <label class="switch mini-switch">
                                                    <input type="checkbox" :checked="rule.enabled"
                                                        @change="toggleRuleEnabled(rule.id, $event)">
                                                    <span class="slider"></span>
                                                </label>
                                                <h4 class="rule-name">{{ rule.name }}</h4>
                                                <span class="tag" :class="'tag-' + (rule.id.startsWith('u_') ? 'user' : 'builtin')">
                                                    {{ rule.id.startsWith('u_') ? t('sourceUser') : t('sourceBuiltin') }}
                                                </span>
                                                <span class="tag scene-tag">{{ sceneEmoji(rule.scene) }} {{ tScene(rule.scene) }}</span>
                                            </div>
                                            <div class="rule-head-r">
                                                <button v-if="rule.id.startsWith('u_')" class="icon-btn xs"
                                                    :title="t('editRule')"
                                                    @click="openEditRule(rule)">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                    </svg>
                                                </button>
                                                <button v-if="rule.id.startsWith('u_')" class="icon-btn xs danger"
                                                    :title="t('deleteRule')"
                                                    @click="delRule(rule.id)">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                        <path d="M19 6l-2 14H7L5 6M10 11v6M14 11v6M9 6V4h6v2"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </header>
                                        <div class="rule-body">
                                            <div class="conds">
                                                <span class="cond" v-for="(c, i) in rule.conditions" :key="i">
                                                    <span class="cond-field">{{ tField(c.field) }}</span>
                                                    <span class="cond-op">{{ c.field === 'display_mode' ? '=' : '∈' }}</span>
                                                    <span class="cond-value">{{ c.value }}</span>
                                                    <span v-if="c.ignore_case !== false && c.field !== 'display_mode'" class="cond-tag">/i</span>
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                </div>

                                <div v-else class="empty-state">
                                    <p>{{ t('noRulesYet') }}</p>
                                    <button class="btn btn-primary" @click="openAddRule">+ {{ t('addRule') }}</button>
                                </div>
                            </section>
                        </template>

                    </section>

                    <!-- ========== Page: Cloud AI (云端 AI) ========== -->
                    <section v-if="activePage === 'cloud-ai'" class="page page-cloudai">
                        <header class="page-header">
                            <h2>{{ t('cloudAiTitle') }}</h2>
                            <p class="page-sub">{{ t('cloudAiDesc') }}</p>
                        </header>

                        <div class="cloudai-stack">
                            <!-- 卡片1: 服务商选择 -->
                            <article class="cloudai-card">
                                <div class="cloudai-card-head">
                                    <span class="cloudai-card-num">1</span>
                                    <span class="cloudai-card-title">{{ t('aiProvider') }}</span>
                                </div>
                                <div class="provider-grid">
                                    <button v-for="p in providerList" :key="p.value"
                                        class="provider-chip"
                                        :class="{ 'is-active': cloudCfg.provider === p.value }"
                                        @click="handleQuickProvider(p.value)">
                                        <span class="chip-tag">{{ p.tag }}</span>
                                        <span class="chip-name">{{ t(p.labelKey) }}</span>
                                        <span v-if="cloudCfg.provider === p.value" class="chip-check">✓</span>
                                    </button>
                                </div>
                            </article>

                            <!-- 卡片2: API Key + Base URL -->
                            <article class="cloudai-card">
                                <div class="cloudai-card-head">
                                    <span class="cloudai-card-num">2</span>
                                    <span class="cloudai-card-title">{{ t('aiApiKey') }} & {{ t('aiBaseUrl') }}</span>
                                </div>
                                <div class="cloudai-fields">
                                    <div class="field-row">
                                        <label>{{ t('aiApiKey') }}</label>
                                        <input type="password" v-model="cloudCfg.apiKey"
                                            :placeholder="t('aiValidateApiKeyEmpty')" spellcheck="false">
                                    </div>
                                    <div class="field-row">
                                        <label>{{ t('aiBaseUrl') }}</label>
                                        <input type="text" v-model="cloudCfg.baseUrl" spellcheck="false">
                                    </div>
                                </div>
                            </article>

                            <!-- 卡片3: 模型选择 + 操作按钮 -->
                            <article class="cloudai-card">
                                <div class="cloudai-card-head">
                                    <span class="cloudai-card-num">3</span>
                                    <span class="cloudai-card-title">{{ t('aiModel') }}</span>
                                </div>
                                <div class="model-section">
                                    <div class="model-input-row">
                                        <input type="text" class="model-input"
                                            v-model="cloudCfg.model" spellcheck="false"
                                            :list="'fetched-models-list'"
                                            :placeholder="t('aiModel')">
                                        <datalist id="fetched-models-list">
                                            <option v-for="m in fetchedModels" :key="m" :value="m" />
                                            <option v-for="m in providerModels[cloudCfg.provider] ?? []" :key="'p'+m" :value="m" />
                                        </datalist>
                                        <button class="cloudai-action-btn"
                                            :disabled="!cloudCfg.apiKey || !cloudCfg.baseUrl"
                                            @click="handleFetchModels">
                                            {{ fetchModelsState === 'loading' ? t('aiFetchingModels') : t('aiFetchModels') }}
                                        </button>
                                        <button class="cloudai-action-btn"
                                            :disabled="!cloudCfg.apiKey || !cloudCfg.baseUrl || !cloudCfg.model"
                                            @click="handleLatencyTest">
                                            {{ latencyState === 'loading' ? t('aiLatencyTesting') : t('aiLatencyTest') }}
                                        </button>
                                    </div>
                                    <div class="model-status-row">
                                        <span v-if="fetchModelsState === 'ok'" class="status-ok">✓ {{ fetchModelsMsg }}</span>
                                        <span v-if="fetchModelsState === 'fail'" class="status-bad">✕ {{ fetchModelsMsg }}</span>
                                        <span v-if="latencyState === 'ok'" class="status-ok" :class="{ 'latency-slow': latencyMs > 2000 }">
                                            ✓ {{ t('aiLatencyResult').replace('{ms}', String(latencyMs)) }}
                                        </span>
                                        <span v-if="latencyState === 'fail'" class="status-bad">✕ {{ t('aiLatencyFail') }}</span>
                                    </div>
                                    <div v-if="fetchedModels.length" class="fetched-models-list">
                                        <button v-for="m in fetchedModels.slice(0, 12)" :key="m"
                                            class="model-pill"
                                            :class="{ 'is-selected': cloudCfg.model === m }"
                                            @click="selectFetchedModel(m)">
                                            {{ m }}
                                        </button>
                                    </div>
                                </div>
                            </article>

                            <!-- 卡片4: 进阶配置（可折叠） -->
                            <article class="cloudai-card collapsible" :class="{ 'is-expanded': showAdvanced }">
                                <div class="cloudai-card-head clickable" @click="showAdvanced = !showAdvanced">
                                    <span class="cloudai-card-num">4</span>
                                    <span class="cloudai-card-title">{{ t('aiAdvanced') }}</span>
                                    <svg class="expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                        <path d="M6 9l6 6 6-6" />
                                    </svg>
                                </div>
                                <transition name="collapse">
                                    <div v-show="showAdvanced" class="cloudai-card-body">
                                        <div class="cloudai-fields">
                                            <div class="field-row half">
                                                <label>{{ t('aiMinInterval') }}</label>
                                                <input type="number" min="10" v-model.number="cloudCfg.minIntervalSec">
                                            </div>
                                            <div class="field-row half">
                                                <label>{{ t('aiCacheTtl') }}</label>
                                                <input type="number" min="0" v-model.number="cloudCfg.cacheTtlHour">
                                            </div>
                                            <div class="field-row half">
                                                <label>{{ t('aiTimeout') }}</label>
                                                <input type="number" min="1" max="60" v-model.number="cloudCfg.timeoutSec">
                                            </div>
                                            <div class="field-row half check-row">
                                                <label class="check-label">
                                                    <input type="checkbox" v-model="cloudCfg.showErrorHint">
                                                    <span>{{ t('aiShowErrorHint') }}</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div class="field-row">
                                            <label>{{ t('aiCustomPrompt') }}</label>
                                            <textarea rows="3" v-model="cloudCfg.customPrompt"></textarea>
                                        </div>
                                        <div class="field-row">
                                            <label>{{ t('aiCustomHeaders') }}
                                                <span class="field-hint">{{ t('aiCustomHeadersHint') }}</span>
                                            </label>
                                            <textarea rows="3" v-model="cloudCfg.customHeaders"
                                                placeholder="X-Custom-Header: value&#10;Authorization: Bearer ..."></textarea>
                                        </div>
                                    </div>
                                </transition>
                            </article>

                            <!-- 操作栏 -->
                            <div class="cloudai-footer">
                                <p class="validate" v-if="validateIssues.length">
                                    ⚠️ <span v-for="(k, i) in validateIssues" :key="i">{{ t(k) }} </span>
                                </p>
                                <div class="footer-actions">
                                    <button class="btn btn-secondary" @click="handleClearAiCache">{{ t('aiClearCache') }}</button>
                                    <button class="btn btn-secondary" @click="handleTestAiConnection">
                                        {{ testConnState === 'loading' ? '...' : t('aiTestConnection') }}
                                    </button>
                                    <button class="btn btn-primary" :disabled="!!validateIssues.length" @click="handleSaveAiCfg">
                                        {{ t('confirm') }}
                                    </button>
                                </div>
                                <p v-if="testConnState !== 'idle'" class="test-result" :class="testConnState === 'ok' ? 'ok' : 'bad'">
                                    {{ testConnState === 'ok' ? '✅ ' + t('aiTestSuccess')
                                        : testConnState === 'bad' ? '❌ ' + t('aiTestFailed') + (testConnMsg ? ': ' + testConnMsg : '')
                                        : '⏳ ...' }}
                                </p>
                            </div>
                        </div>
                    </section>

                    <!-- ========== Page: Settings (设置) ========== -->
                    <section v-if="activePage === 'settings'" class="page page-settings">
                        <header class="page-header">
                            <h2>{{ t('consoleSettings') }}</h2>
                        </header>

                        <div class="settings-grid">
                            <!-- 主题 -->
                            <article class="card-setting">
                                <div class="item-meta">
                                    <span class="item-title">{{ t('themeColor') }}</span>
                                    <span class="item-desc">{{ t('themeColorDesc') }}</span>
                                </div>
                                <div class="custom-dropdown" tabindex="0" @blur="isThemeModeDropdownOpen = false">
                                    <div class="dropdown-trigger" @click="isThemeModeDropdownOpen = !isThemeModeDropdownOpen">
                                        <div class="current-item">
                                            {{ t(currentThemeLabel()) }}
                                        </div>
                                        <svg viewBox="0 0 24 24" class="arrow-icon"
                                            :class="{ 'is-open': isThemeModeDropdownOpen }">
                                            <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                                        </svg>
                                    </div>
                                    <transition name="dropdown">
                                        <div class="dropdown-menu" v-show="isThemeModeDropdownOpen">
                                            <div v-for="m in themeModes" :key="m.value" class="dropdown-item"
                                                :class="{ 'is-active': themeMode === m.value }"
                                                @click="handleSelectThemeMode(m.value)">
                                                {{ t(m.labelKey) }}
                                            </div>
                                        </div>
                                    </transition>
                                </div>
                            </article>

                            <!-- 开机自启 -->
                            <article class="card-setting">
                                <div class="item-meta">
                                    <span class="item-title">{{ t('autoStart') }}</span>
                                    <span class="item-desc">{{ t('autoStartDesc') }}</span>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" v-model="autoStart" @change="toggleAutoStart">
                                    <span class="slider"></span>
                                </label>
                            </article>

                            <!-- 透明度 -->
                            <article class="card-setting wide">
                                <div class="item-meta">
                                    <span class="item-title">{{ t('islandOpacity') }}</span>
                                    <span class="item-desc">{{ t('islandOpacityDesc') }} ({{ opacity }}%)</span>
                                </div>
                                <input type="range" min="0" max="100" v-model.number="opacity" class="range-input" />
                            </article>

                            <!-- 语言 -->
                            <article class="card-setting">
                                <div class="item-meta">
                                    <span class="item-title">{{ t('language') }}</span>
                                    <span class="item-desc">{{ t('languageDesc') }}</span>
                                </div>
                                <div class="custom-dropdown" tabindex="0" @blur="isLanguageDropdownOpen = false">
                                    <div class="dropdown-trigger" @click="isLanguageDropdownOpen = !isLanguageDropdownOpen">
                                        <div class="current-item">
                                            {{ t(currentLanguage === 'zh-CN' ? 'simplifiedChinese' : 'english') }}
                                        </div>
                                        <svg viewBox="0 0 24 24" class="arrow-icon"
                                            :class="{ 'is-open': isLanguageDropdownOpen }">
                                            <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                                        </svg>
                                    </div>
                                    <transition name="dropdown">
                                        <div class="dropdown-menu" v-show="isLanguageDropdownOpen">
                                            <div v-for="o in languageOptions" :key="o.value" class="dropdown-item"
                                                :class="{ 'is-active': currentLanguage === o.value }"
                                                @click="handleSelectLanguage(o.value)">
                                                {{ t(o.labelKey) }}
                                            </div>
                                        </div>
                                    </transition>
                                </div>
                            </article>

                            <!-- 消息通知 -->
                            <article class="card-setting">
                                <div class="item-meta">
                                    <span class="item-title">{{ t('messageNotifications') }}</span>
                                    <span class="item-desc">{{ t('messageNotificationsDesc') }}</span>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" v-model="enableMsgNotify" @change="toggleMsgNotify">
                                    <span class="slider"></span>
                                </label>
                            </article>

                            <!-- 静默模式 -->
                            <article class="card-setting">
                                <div class="item-meta">
                                    <span class="item-title">{{ t('quietMode') }}</span>
                                    <span class="item-desc">{{ t('quietModeDesc') }}</span>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" v-model="msgModeEnabled" @change="toggleMsgMode">
                                    <span class="slider"></span>
                                </label>
                            </article>

                            <!-- 全屏自动隐藏 -->
                            <article class="card-setting">
                                <div class="item-meta">
                                    <span class="item-title">{{ t('fullscreenAutoHide') }}</span>
                                    <span class="item-desc">{{ t('fullscreenAutoHideDesc') }}</span>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" v-model="autoHideFullscreen" @change="toggleAutoHide">
                                    <span class="slider"></span>
                                </label>
                            </article>

                            <!-- 音乐控制器 -->
                            <article class="card-setting">
                                <div class="item-meta">
                                    <span class="item-title">{{ t('musicController') }}</span>
                                    <span class="item-desc">{{ t('musicControllerDesc') }}</span>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" v-model="enableMusicCtrl">
                                    <span class="slider"></span>
                                </label>
                            </article>
                        </div>
                    </section>

                    <!-- ========== Page: About (关于) ========== -->
                    <section v-if="activePage === 'about'" class="page page-about">
                        <header class="page-header">
                            <h2>{{ t('navAbout') }}</h2>
                        </header>
                        <article class="about-card">
                            <div class="about-logo">
                                <img src="../assets/logo.png" class="logo-lg">
                                <div>
                                    <h3>winBangs Desktop Dynamic Island</h3>
                                    <p class="muted">v{{ appVersion }} · MIT Licensed</p>
                                </div>
                            </div>
                            <div class="about-links">
                                <button class="link-pill" @click="openRepo">
                                    <svg viewBox="0 0 24 24" class="nav-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                    </svg>
                                    {{ t('openSourceRepo') }}
                                </button>
                                <button class="link-pill"
                                    :style="{ opacity: isChecking ? 0.5 : 1, pointerEvents: isChecking ? 'none' : 'auto' }"
                                    @click="checkUpdate">
                                    <span v-if="hasNewVersion" class="update-dot"></span>
                                    {{ isChecking ? t('checking') : (hasNewVersion ? t('newVersionDetected') : t('checkUpdate')) }}
                                </button>
                            </div>
                            <div class="about-copyright">
                                <span class="muted">&copy; 2026 winBangs · All rights reserved.</span>
                            </div>
                        </article>
                    </section>

                </div>
            </main>
        </div>

        <!-- ===================== Footer / Controller (网易云底部播放栏) ===================== -->
        <Transition name="footer-slide">
            <footer v-if="activePage !== 'overview'" class="app-footer">
                <div class="ft-summary">
                    <!-- 灵动岛开关 -->
                    <div class="ft-summary-item">
                        <span class="ft-label">{{ t('islandSwitch') }}</span>
                        <label class="switch mini-switch" :title="t('widgetState')">
                            <input type="checkbox" :checked="isWidgetVisible" @change="toggleWidget">
                            <span class="slider"></span>
                        </label>
                    </div>

                    <!-- 云端AI状态 -->
                    <div class="ft-summary-item">
                        <button class="ai-status-btn" :class="aiStatusClass"
                            :title="aiStatusTitle"
                            @click="toggleCloudAi">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
                            </svg>
                            <span class="ai-dot" v-if="cloudCfg.mode !== 'local_only'"></span>
                        </button>
                    </div>

                    <!-- 当前场景 -->
                    <div class="ft-summary-item scene-chip">
                        <span class="ft-scene-emoji">{{ sceneEmoji(currentSceneCtx.scene) }}</span>
                        <span class="ft-scene-name">{{ tScene(currentSceneCtx.scene) }}</span>
                    </div>

                    <div class="ft-spacer"></div>

                    <!-- 设置按钮 -->
                    <button class="ft-summary-item icon-only" @click="activePage = 'settings'" :title="t('navSettings')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
                        </svg>
                    </button>
                </div>
            </footer>
        </Transition>

        <!-- ===================== 规则新增/编辑 Dialog ===================== -->
        <Transition name="fade">
            <div v-if="ruleDlg.visible" class="modal-overlay" @click.self="closeRuleDlg">
                <div class="modal-card rule-modal">
                    <div class="modal-header">
                        <h4>{{ ruleDlg.editing ? t('editRule') : t('addRule') }}</h4>
                    </div>
                    <div class="modal-body">
                        <div class="form-stack">
                            <!-- 规则名称 -->
                            <div class="form-item col-6 full">
                                <label>{{ t('ruleName') }}</label>
                                <input type="text" v-model="ruleDlg.form.name" :placeholder="t('ruleName')">
                            </div>
                            <!-- 启用 + 场景 + 权重 -->
                            <div class="form-grid">
                                <div class="form-item check">
                                    <label class="check-label">
                                        <input type="checkbox" v-model="ruleDlg.form.enabled">
                                        <span>{{ t('ruleEnabled') }}</span>
                                    </label>
                                </div>
                                <div class="form-item">
                                    <label>{{ t('ruleTargetScene') }}</label>
                                    <select v-model="ruleDlg.form.scene">
                                        <option v-for="s in sceneTypes" :key="s" :value="s">
                                            {{ sceneEmoji(s) }} {{ tScene(s) }}
                                        </option>
                                    </select>
                                </div>
                                <div class="form-item">
                                    <label>{{ t('ruleWeight') }}</label>
                                    <input type="number" min="0" max="1" step="0.05" v-model.number="ruleDlg.form.weight">
                                </div>
                            </div>
                            <!-- 匹配条件 -->
                            <div class="conds-block">
                                <div class="conds-head">
                                    <label>{{ t('ruleConditions') }}</label>
                                    <button class="btn btn-secondary mini" @click="addCondition">+ {{ t('condField') }}</button>
                                </div>
                                <div class="cond-rows">
                                    <div v-for="(c, idx) in ruleDlg.form.conditions" :key="idx" class="cond-row">
                                        <select v-model="c.field" class="cond-f">
                                            <option value="process_contains">{{ t('fieldProcessContains') }}</option>
                                            <option value="title_contains">{{ t('fieldTitleContains') }}</option>
                                            <option value="display_mode">{{ t('fieldDisplayMode') }}</option>
                                        </select>
                                        <template v-if="c.field === 'display_mode'">
                                            <select v-model="c.value" class="cond-v">
                                                <option value="fullscreen">{{ t('displayFullscreen') }}</option>
                                                <option value="maximized">{{ t('displayMaximized') }}</option>
                                                <option value="windowed">{{ t('displayWindowed') }}</option>
                                                <option value="minimized">{{ t('displayMinimized') }}</option>
                                            </select>
                                        </template>
                                        <template v-else>
                                            <input type="text" v-model="c.value" class="cond-v" :placeholder="t('condValue')">
                                            <label class="check-label cond-ic">
                                                <input type="checkbox" v-model="c.ignore_case">
                                                <span>{{ t('condIgnoreCase') }}</span>
                                            </label>
                                        </template>
                                        <button class="icon-btn xs danger cond-del" title="删除条件"
                                            v-if="ruleDlg.form.conditions.length > 1"
                                            @click="removeCondition(idx)">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" @click="closeRuleDlg">{{ t('cancel') }}</button>
                        <button class="btn btn-primary" @click="submitRuleDlg">{{ t('confirm') }}</button>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- ===================== 权重方案编辑 Dialog ===================== -->
        <Transition name="fade">
            <div v-if="editingTilt" class="modal-overlay" @click.self="closeTiltEdit">
                <div class="modal-card tilt-edit-modal">
                    <div class="modal-header">
                        <h4>{{ t('tiltSchemeTitle') }} - {{ tScene(editingTilt.scene) }}</h4>
                    </div>
                    <div class="modal-body">
                        <div class="form-stack">
                            <!-- 启用 -->
                            <div class="form-item check">
                                <label class="check-label">
                                    <input type="checkbox" v-model="editingTilt.enabled">
                                    <span>{{ t('tiltEnabled') }}</span>
                                </label>
                            </div>
                            <!-- 参数滑块 -->
                            <div class="tilt-edit-grid">
                                <div class="tilt-edit-field" :title="t('tiltMaxFloorDesc')">
                                    <label>{{ t('tiltMaxFloor') }}</label>
                                    <div class="tilt-edit-input-row">
                                        <input type="range" min="0.5" max="1.0" step="0.05"
                                            v-model.number="editingTilt.maxFloor">
                                        <span class="tilt-edit-val">{{ (editingTilt.maxFloor * 100).toFixed(0) }}%</span>
                                    </div>
                                </div>
                                <div class="tilt-edit-field" :title="t('tiltFloorDesc')">
                                    <label>{{ t('tiltFloor') }}</label>
                                    <div class="tilt-edit-input-row">
                                        <input type="range" min="0.30" max="0.80" step="0.05"
                                            v-model.number="editingTilt.floor">
                                        <span class="tilt-edit-val">{{ (editingTilt.floor * 100).toFixed(0) }}%</span>
                                    </div>
                                </div>
                                <div class="tilt-edit-field" :title="t('tiltDecayTimeDesc')">
                                    <label>{{ t('tiltDecayTime') }}</label>
                                    <div class="tilt-edit-input-row">
                                        <input type="range" min="10" max="600" step="10"
                                            :value="Math.round(editingTilt.decayMs / 1000)"
                                            @input="editingTilt.decayMs = Number(($event.target as HTMLInputElement).value) * 1000">
                                        <span class="tilt-edit-val">{{ Math.round(editingTilt.decayMs / 1000) }}{{ t('tiltSeconds') }}</span>
                                    </div>
                                </div>
                                <div class="tilt-edit-field" :title="t('tiltHoldTimeDesc')">
                                    <label>{{ t('tiltHoldTime') }}</label>
                                    <div class="tilt-edit-input-row">
                                        <input type="range" min="0" max="30" step="1"
                                            :value="Math.round(editingTilt.holdMs / 60000)"
                                            @input="editingTilt.holdMs = Number(($event.target as HTMLInputElement).value) * 60000">
                                        <span class="tilt-edit-val">{{ Math.round(editingTilt.holdMs / 60000) }}{{ t('tiltMinutes') }}</span>
                                    </div>
                                </div>
                                <div class="tilt-edit-field" :title="t('tiltAbandonTimeDesc')">
                                    <label>{{ t('tiltAbandonTime') }}</label>
                                    <div class="tilt-edit-input-row">
                                        <input type="range" min="0" max="30" step="1"
                                            :value="Math.round(editingTilt.abandonMs / 60000)"
                                            @input="editingTilt.abandonMs = Number(($event.target as HTMLInputElement).value) * 60000">
                                        <span class="tilt-edit-val">{{ Math.round(editingTilt.abandonMs / 60000) }}{{ t('tiltMinutes') }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" @click="closeTiltEdit">{{ t('cancel') }}</button>
                        <button class="btn btn-primary" @click="submitTiltEdit">{{ t('confirm') }}</button>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- ===================== 通用 Dialog ===================== -->
        <Transition name="fade">
            <div v-if="dialog.visible" class="modal-overlay" @click.self="closeDialog">
                <div class="modal-card">
                    <div class="modal-header">
                        <h4>{{ dialog.title }}</h4>
                    </div>
                    <div class="modal-body">
                        <p>{{ dialog.message }}</p>
                    </div>
                    <div class="modal-footer">
                        <button v-if="dialog.isConfirm" class="btn btn-secondary" @click="closeDialog">
                            {{ t('cancel') }}
                        </button>
                        <button class="btn btn-primary" @click="handleDialogConfirm">
                            {{ t('confirm') }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { invoke } from '@tauri-apps/api/core';
import { emit, listen } from '@tauri-apps/api/event';
import { getVersion } from '@tauri-apps/api/app';
import { enable, disable, isEnabled } from '@tauri-apps/plugin-autostart';
import { openUrl } from '@tauri-apps/plugin-opener';
import { getCurrentWindow } from '@tauri-apps/api/window';

import DynamicSet from '../components/DynamicSet.vue';
import WeatherCard from '../components/WeatherCard.vue';
import { t, currentLanguage, setLanguage, languageOptions, type TranslationKey, type AppLanguage } from '../i18n';

import {
    listRules, addRule, deleteRule, updateRule, reloadRules,
    type SceneRule, type SceneType, type RuleCondition, type RulePatternField,
} from '../services/scene-rules';
import {
    reloadCloudAiConfig, saveCloudAiConfig, getCloudAiConfig, classifyByCloud,
    getProviderPresets, validateConfig, clearAiCache, fetchModelList, testModelLatency,
    type CloudAiConfig, type AiMode, type AiProvider,
} from '../services/cloud-ai';
import {
    startScenePolling, stopScenePolling, onSceneChange, lockScene, unlockScene,
    type SceneContext,
} from '../services/scene-context';
import {
    listTiltProfiles, updateTiltProfile, reloadTiltProfiles,
    type SceneTiltProfile,
} from '../services/scene-tilt';

/* ==================== Sidebar 页面切换 ==================== */
type PageKey = 'overview' | 'personalize' | 'scene-rules' | 'cloud-ai' | 'settings' | 'about';
const activePage = ref<PageKey>('overview');
const savedActive = localStorage.getItem('wbs_active_page');
if (savedActive) activePage.value = savedActive as PageKey;

watch(activePage, (p) => localStorage.setItem('wbs_active_page', p));

/* ==================== 基础状态 ==================== */
const isWidgetVisible = ref(localStorage.getItem('wbs_widget_visible') !== 'false');
const autoStart = ref(false);
const opacity = ref(Number(localStorage.getItem('wbs_island_opacity') || '100'));

const savedTheme = localStorage.getItem('wbs_theme_mode') || 'light';
const themeMode = ref<ThemeMode>((['light', 'dark', 'coverglass', 'system'] as const).includes(savedTheme as ThemeMode)
    ? savedTheme as ThemeMode : 'light');

/* ==================== 主题色 ==================== */
interface AccentColorDef {
    hex: string;
    label: string;
}
const accentColors: AccentColorDef[] = [
    { hex: '#e11d48', label: 'Rose' },
    { hex: '#f472b6', label: 'Pink' },
    { hex: '#fb923c', label: 'Orange' },
    { hex: '#facc15', label: 'Yellow' },
    { hex: '#84cc16', label: 'Lime' },
    { hex: '#10b981', label: 'Emerald' },
    { hex: '#0ea5e9', label: 'Sky' },
    { hex: '#3b82f6', label: 'Blue' },
    { hex: '#8b5cf6', label: 'Violet' },
];
const DEFAULT_ACCENT = '#3b82f6';

function hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}
function mixColor(hex: string, targetHex: string, ratio: number): string {
    const [r1, g1, b1] = hexToRgb(hex);
    const [r2, g2, b2] = hexToRgb(targetHex);
    return rgbToHex(
        r1 + (r2 - r1) * ratio,
        g1 + (g2 - g1) * ratio,
        b1 + (b2 - b1) * ratio,
    );
}

const savedAccent = localStorage.getItem('wbs_accent_hex') || DEFAULT_ACCENT;
const accentColor = ref<string>(savedAccent);

function applyAccentColor(hex: string) {
    const root = document.documentElement;
    const isDark = root.classList.contains('dark-theme');
    const accent = isDark ? mixColor(hex, '#ffffff', 0.15) : hex;
    const accentSoft = isDark ? mixColor(hex, '#ffffff', 0.25) : mixColor(hex, '#ffffff', 0.35);
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--accent-soft', accentSoft);
}

function selectAccentColor(hex: string) {
    accentColor.value = hex;
    localStorage.setItem('wbs_accent_hex', hex);
    applyAccentColor(hex);
}

watch(themeMode, () => applyAccentColor(accentColor.value));

const coverUrl = ref('');
const coverCache = new Map<string, string>();
const currentTrackInfo = ref('');
let coverTimer: number | null = null;

const appVersion = ref('1.0.0');
const isChecking = ref(false);
const hasNewVersion = ref(false);

const targetPlayer = ref(localStorage.getItem('wbs_target_player') || 'netease');

/** 进程名 → 音乐平台 映射（用户修正结果持久化） */
const processPlatformMap = ref<Record<string, string>>(
    JSON.parse(localStorage.getItem('wbs_process_platform_map') || '{}')
);
function saveProcessPlatformMap() {
    localStorage.setItem('wbs_process_platform_map', JSON.stringify(processPlatformMap.value));
}

/** 场景引擎识别到的音乐平台 */
const detectedMusicPlatform = computed(() => {
    const proc = currentSceneCtx.value?.metadata?.process_name;
    if (!proc) return null;
    // 已知映射
    const mapped = processPlatformMap.value[proc.toLowerCase()];
    if (mapped) return mapped;
    // 内置匹配
    const pn = proc.toLowerCase();
    if (pn.includes('cloudmusic') || pn.includes('netease')) return 'netease';
    if (pn.includes('spotify')) return 'spotify';
    if (pn.includes('apple') && pn.includes('music')) return 'apple';
    if (pn.includes('qqmusic')) return 'qqmusic';
    if (pn.includes('kugou')) return 'kugou';
    if (pn.includes('echo')) return 'echo';
    if (pn.includes('lx-music') || pn.includes('lxmusic')) return 'lx-music';
    // 检测到进程但未识别出平台
    return 'unknown';
});

/** 用户修正音乐平台 → 与进程关联 */
function correctMusicPlatform(platform: string) {
    const proc = currentSceneCtx.value?.metadata?.process_name;
    if (proc) {
        processPlatformMap.value[proc.toLowerCase()] = platform;
        saveProcessPlatformMap();
        // 同步到后端
        setTargetPlayer(platform);
    }
    isPlayerDropdownOpen.value = false;
}

const enableMusicCtrl = ref(localStorage.getItem('wbs_music_ctrl') === 'true');
const enableMsgNotify = ref(localStorage.getItem('wbs_msg_notify') === 'true');
const msgModeEnabled = ref(localStorage.getItem('wbs_msg_mode') === 'true');
const autoHideFullscreen = ref(localStorage.getItem('wbs_autohide_fs') === 'true');

/* ==================== 主题下拉 ==================== */
type ThemeMode = 'light' | 'dark' | 'coverglass' | 'system';
const isThemeModeDropdownOpen = ref(false);
const isLanguageDropdownOpen = ref(false);
const isPlayerDropdownOpen = ref(false);
const lockDropdownOpen = ref(false);

const themeModes: { value: ThemeMode; labelKey: 'lightMode' | 'darkMode' | 'coverglassMode' | 'systemMode' }[] = [
    { value: 'light', labelKey: 'lightMode' },
    { value: 'dark', labelKey: 'darkMode' },
    { value: 'coverglass', labelKey: 'coverglassMode' },
    { value: 'system', labelKey: 'systemMode' },
];

function currentThemeLabel(): 'lightMode' | 'darkMode' | 'coverglassMode' | 'systemMode' {
    return themeModes.find((m) => m.value === themeMode.value)!.labelKey;
}

function handleSelectThemeMode(m: ThemeMode) {
    themeMode.value = m;
    isThemeModeDropdownOpen.value = false;
    handleThemeChange();
}

async function handleSelectLanguage(language: AppLanguage) {
    setLanguage(language);
    isLanguageDropdownOpen.value = false;
    await emit('control-language', { language });
}

async function setTargetPlayer(player: string) {
    targetPlayer.value = player;
    localStorage.setItem('wbs_target_player', player);
    try { await invoke('set_target_player', { player }); } catch { /* ignore */ }
}

/* ==================== 音乐封面模糊 (沉浸模式) ==================== */
const bakeBlurImage = (url: string): Promise<string> =>
    new Promise((resolve) => {
        const img = new Image();
        if (url.startsWith('http')) img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 120; canvas.height = 120;
            const ctx = canvas.getContext('2d');
            if (!ctx) return resolve(url);
            ctx.filter = 'blur(10px)';
            ctx.drawImage(img, -10, -10, 140, 140);
            try { resolve(canvas.toDataURL('image/jpeg', 0.6)); }
            catch { resolve(url); }
        };
        img.onerror = () => resolve(url);
        img.src = url;
    });

async function syncMusicCover() {
    if (themeMode.value !== 'coverglass') return;
    try {
        const res = await invoke<[string, string, boolean] | null>('fetch_netease_music_info');
        if (res) {
            const [song, artist] = res;
            const info = artist ? `${song} - ${artist}` : song;
            if (currentTrackInfo.value !== info) {
                currentTrackInfo.value = info;
                if (coverCache.has(info)) coverUrl.value = coverCache.get(info)!;
                else {
                    try {
                        const real = await invoke<string>('get_random_cover_url', { songName: song, artistName: artist });
                        const baked = await bakeBlurImage(real);
                        coverUrl.value = baked;
                        if (coverCache.size > 50) coverCache.clear();
                        coverCache.set(info, baked);
                    } catch { coverUrl.value = ''; }
                }
            }
        } else {
            currentTrackInfo.value = '';
            coverUrl.value = '';
        }
    } catch { /* ignore */ }
}

watch(themeMode, (m) => {
    if (m === 'coverglass') {
        syncMusicCover();
        if (!coverTimer) coverTimer = window.setInterval(syncMusicCover, 2000);
    } else if (coverTimer) {
        clearInterval(coverTimer);
        coverTimer = null;
    }
}, { immediate: true });

/* ==================== 消息/通知/隐藏相关 ==================== */
const toggleMsgMode = async () => {
    if (msgModeEnabled.value) { enableMsgNotify.value = true; toggleMsgNotify(); }
    localStorage.setItem('wbs_msg_mode', String(msgModeEnabled.value));
    await emit('control-msg-mode', { enabled: msgModeEnabled.value });
};
const toggleMsgNotify = () => {
    localStorage.setItem('wbs_msg_notify', String(enableMsgNotify.value));
};
const toggleAutoHide = async () => {
    localStorage.setItem('wbs_autohide_fs', String(autoHideFullscreen.value));
    await emit('control-autohide-fs', { enabled: autoHideFullscreen.value });
};

watch(opacity, async (v) => {
    localStorage.setItem('wbs_island_opacity', v.toString());
    await emit('control-island-opacity', { opacity: v });
});

watch(enableMusicCtrl, async (v) => {
    localStorage.setItem('wbs_music_ctrl', String(v));
    await emit('control-music-ctl', { enabled: v });
});

/* ==================== 场景规则引擎 UI ==================== */
const rules = ref<SceneRule[]>([]);
const tiltProfiles = ref<SceneTiltProfile[]>([]);

/** 获取当前分类下各场景的 tilt 配置 */
const currentCatTiltProfiles = computed<SceneTiltProfile[]>(() => {
    if (!currentCat.value) return [];
    return tiltProfiles.value.filter(p => currentCat.value!.scenes.includes(p.scene));
});

/** 编辑中的 tilt profile（临时副本） */
const editingTilt = ref<SceneTiltProfile | null>(null);

/* 场景分类：默认五大场景 */
type SceneCategory = 'default' | 'media' | 'office' | 'develop' | 'game';

interface SceneCategoryDef {
    key: SceneCategory;
    icon: string;
    color: string;
    titleKey: TranslationKey;
    descKey: TranslationKey;
    scenes: SceneType[];
}

const sceneCategories: SceneCategoryDef[] = [
    { key: 'default', icon: '⚙️', color: '#8b95a5', titleKey: 'sceneCatDefault', descKey: 'sceneCatDefaultDesc', scenes: ['idle', 'unknown'] },
    { key: 'media',   icon: '🎬', color: '#ec4899', titleKey: 'sceneCatMedia',   descKey: 'sceneCatMediaDesc',   scenes: ['video', 'music'] },
    { key: 'office',  icon: '📄', color: '#3b82f6', titleKey: 'sceneCatOffice',  descKey: 'sceneCatOfficeDesc',  scenes: ['office_doc', 'office_meeting', 'browsing'] },
    { key: 'develop', icon: '💻', color: '#22c55e', titleKey: 'sceneCatDevelop', descKey: 'sceneCatDevelopDesc', scenes: ['office_ide'] },
    { key: 'game',    icon: '🎮', color: '#a855f7', titleKey: 'sceneCatGame',    descKey: 'sceneCatGameDesc',    scenes: ['game'] },
];

/* 当前进入的场景分类（null = 列表页） */
const activeSceneCat = ref<SceneCategory | null>(null);

const sceneCatRules = computed(() => {
    const result: Map<SceneCategory, { total: number; enabled: number }> = new Map();
    for (const cat of sceneCategories) {
        const catRules = rules.value.filter(r => cat.scenes.includes(r.scene));
        result.set(cat.key, {
            total: catRules.length,
            enabled: catRules.filter(r => r.enabled).length,
        });
    }
    return result;
});

const currentCat = computed(() => sceneCategories.find(c => c.key === activeSceneCat.value) || null);

const currentCatRules = computed<SceneRule[]>(() => {
    if (!currentCat.value) return [];
    return rules.value.filter(r => currentCat.value!.scenes.includes(r.scene));
});

const enterSceneCat = (cat: SceneCategory) => {
    activeSceneCat.value = cat;
};

const backToSceneList = () => {
    activeSceneCat.value = null;
};

const handleAiGenRules = async () => {
    showDialog(t('aiGenerateRules'), t('aiGenerateRulesDesc'), true, async () => {
        const cat = currentCat.value;
        const targetScenes = cat ? cat.scenes : sceneCategories.flatMap(c => c.scenes);
        for (const scene of targetScenes.slice(0, 2)) {
            const newRule: Omit<SceneRule, 'id'> = {
                name: `${t('aiGenerated')} - ${tScene(scene)}`,
                enabled: true,
                scene,
                weight: 0.8,
                conditions: [{ field: 'process_contains', value: 'auto-generated', ignore_case: true }],
            };
            addRule(newRule);
        }
        rules.value = listRules();
    });
};

const reloadRulesList = async () => {
    await reloadRules();
    rules.value = listRules();
};
const reloadTiltList = async () => {
    await reloadTiltProfiles();
    tiltProfiles.value = listTiltProfiles();
};
const toggleRuleEnabled = (id: string, ev: Event) => {
    const checked = (ev.target as HTMLInputElement).checked;
    updateRule(id, { enabled: checked });
    rules.value = listRules();
};
const delRule = (id: string) => {
    deleteRule(id);
    rules.value = listRules();
};

/* ----- tilt 权重方案操作 ----- */
const toggleTiltEnabled = (scene: SceneType, ev: Event) => {
    const checked = (ev.target as HTMLInputElement).checked;
    updateTiltProfile(scene, { enabled: checked });
    tiltProfiles.value = listTiltProfiles();
};

const closeTiltEdit = () => {
    editingTilt.value = null;
};

const submitTiltEdit = () => {
    const e = editingTilt.value;
    if (!e) return;
    updateTiltProfile(e.scene, {
        enabled: e.enabled,
        maxFloor: e.maxFloor,
        floor: e.floor,
        decayMs: e.decayMs,
        holdMs: e.holdMs,
        abandonMs: e.abandonMs,
    });
    tiltProfiles.value = listTiltProfiles();
    editingTilt.value = null;
};

const resetTiltForCat = () => {
    if (!currentCat.value) return;
    const scenes = currentCat.value.scenes;
    for (const scene of scenes) {
        updateTiltProfile(scene, {
            enabled: true,
            maxFloor: 0.85,
            floor: 0.68,
            decayMs: 180_000,
            holdMs: 600_000,
            abandonMs: 300_000,
        });
    }
    tiltProfiles.value = listTiltProfiles();
};

/** 权重方案滑块实时保存（0-1 浮点值） */
const updateTiltNow = (scene: SceneType, key: 'maxFloor' | 'floor', val: number) => {
    updateTiltProfile(scene, { [key]: val });
    tiltProfiles.value = listTiltProfiles();
};

/** 权重方案滑块实时保存（毫秒值） */
const updateTiltMs = (scene: SceneType, key: 'decayMs' | 'holdMs' | 'abandonMs', val: number) => {
    updateTiltProfile(scene, { [key]: val });
    tiltProfiles.value = listTiltProfiles();
};

/** 毫秒 → 用户友好的显示（如 "3 分钟" / "30 秒"） */
const msToDisplay = (ms: number): string => {
    const sec = Math.round(ms / 1000);
    if (sec < 120) return `${sec} ${t('tiltSeconds')}`;
    return `${Math.round(sec / 60)} ${t('tiltMinutes')}`;
};

/* ----- 规则新增/编辑 Dialog ----- */
interface RuleDlgForm {
    name: string;
    enabled: boolean;
    scene: SceneType;
    weight: number;
    conditions: RuleCondition[];
}
const ruleDlg = ref<{
    visible: boolean;
    editing: boolean;
    editId: string | null;
    form: RuleDlgForm;
}>({
    visible: false,
    editing: false,
    editId: null,
    form: {
        name: '',
        enabled: true,
        scene: 'office_ide',
        weight: 0.95,
        conditions: [{ field: 'process_contains', value: '', ignore_case: true }],
    },
});

const emptyRuleDlgForm = (): RuleDlgForm => ({
    name: '',
    enabled: true,
    scene: 'office_ide',
    weight: 0.95,
    conditions: [{ field: 'process_contains', value: '', ignore_case: true }],
});

const openAddRule = () => {
    ruleDlg.value = {
        visible: true,
        editing: false,
        editId: null,
        form: emptyRuleDlgForm(),
    };
};

const openEditRule = (rule: SceneRule) => {
    ruleDlg.value = {
        visible: true,
        editing: true,
        editId: rule.id,
        form: {
            name: rule.name,
            enabled: rule.enabled,
            scene: rule.scene,
            weight: rule.weight ?? 0.5,
            conditions: rule.conditions.map((c) => ({ ...c })),
        },
    };
};

const closeRuleDlg = () => {
    ruleDlg.value.visible = false;
};

const addCondition = () => {
    ruleDlg.value.form.conditions.push({ field: 'process_contains', value: '', ignore_case: true });
};

const removeCondition = (idx: number) => {
    if (ruleDlg.value.form.conditions.length > 1) {
        ruleDlg.value.form.conditions.splice(idx, 1);
    }
};

const submitRuleDlg = () => {
    const f = ruleDlg.value.form;
    // 简单校验
    if (!f.name.trim()) {
        showDialog(t('tipTitle'), t('ruleName') + ' ' + t('confirm') + '?');
        return;
    }
    const validConds = f.conditions.filter((c) => c.value && c.value.trim());
    if (!validConds.length) {
        showDialog(t('tipTitle'), t('ruleConditions'));
        return;
    }
    const payload: Omit<SceneRule, 'id'> & { id?: string } = {
        name: f.name.trim(),
        enabled: f.enabled,
        scene: f.scene,
        weight: Math.max(0, Math.min(1, Number(f.weight) || 0.5)),
        conditions: validConds.map((c) => ({
            field: c.field as RulePatternField,
            value: c.value.trim(),
            ignore_case: c.field === 'display_mode' ? false : (c.ignore_case ?? true),
        })),
    };

    if (ruleDlg.value.editing && ruleDlg.value.editId) {
        updateRule(ruleDlg.value.editId, payload);
    } else {
        addRule(payload);
    }
    rules.value = listRules();
    closeRuleDlg();
};


/* ==================== 云端 AI UI ==================== */
const DEFAULT_CFG = getCloudAiConfig();
const cloudCfg = ref<CloudAiConfig>({ ...DEFAULT_CFG });

const aiModes: { value: AiMode; labelKey: 'aiModeLocalOnly' | 'aiModeLocalCloud' }[] = [
    { value: 'local_only', labelKey: 'aiModeLocalOnly' },
    { value: 'local_cloud', labelKey: 'aiModeLocalCloud' },
];

const presets = getProviderPresets();
const providerModels: Record<string, string[]> = {
    custom_openai: [],
    openai: presets.openai?.models ?? [],
    anthropic: presets.anthropic?.models ?? [],
    doubao: presets.doubao?.models ?? [],
    qwen: presets.qwen?.models ?? [],
    deepseek: presets.deepseek?.models ?? [],
};

const testConnState = ref<'idle' | 'loading' | 'ok' | 'bad'>('idle');
const testConnMsg = ref('');

const fetchedModels = ref<string[]>([]);
const fetchModelsState = ref<'idle' | 'loading' | 'ok' | 'fail'>('idle');
const fetchModelsMsg = ref('');

const latencyState = ref<'idle' | 'loading' | 'ok' | 'fail'>('idle');
const latencyMs = ref(0);

const showAdvanced = ref(false);

const providerList: { value: AiProvider; labelKey: TranslationKey; tag: string }[] = [
    { value: 'openai', labelKey: 'aiOpenAI', tag: 'GPT-4o' },
    { value: 'anthropic', labelKey: 'aiAnthropic', tag: 'Claude' },
    { value: 'deepseek', labelKey: 'aiDeepseek', tag: 'DeepSeek' },
    { value: 'doubao', labelKey: 'aiDoubao', tag: '豆包' },
    { value: 'qwen', labelKey: 'aiQwen', tag: '通义' },
    { value: 'custom_openai', labelKey: 'aiCustomOpenAI', tag: 'DIY' },
];

const handleQuickProvider = (p: AiProvider) => {
    cloudCfg.value = { ...cloudCfg.value, provider: p };
    if (p !== 'custom_openai') {
        const preset = presets[p as Exclude<AiProvider, 'custom_openai'>];
        if (preset) {
            cloudCfg.value.baseUrl = preset.baseUrl;
            if (preset.models[0]) cloudCfg.value.model = preset.models[0];
        }
    }
};

const handleFetchModels = async () => {
    fetchModelsState.value = 'loading';
    fetchModelsMsg.value = '';
    try {
        const models = await fetchModelList(cloudCfg.value);
        fetchedModels.value = models;
        fetchModelsState.value = 'ok';
        fetchModelsMsg.value = t('aiFetchModelsOk').replace('{n}', String(models.length));
    } catch (err) {
        fetchModelsState.value = 'fail';
        fetchModelsMsg.value = err instanceof Error ? err.message.slice(0, 80) : String(err);
    }
};

const handleLatencyTest = async () => {
    latencyState.value = 'loading';
    try {
        await saveCloudAiConfig(cloudCfg.value);
        const ms = await testModelLatency(cloudCfg.value);
        latencyMs.value = ms;
        latencyState.value = 'ok';
    } catch (err) {
        latencyState.value = 'fail';
        latencyMs.value = 0;
    }
};

const selectFetchedModel = (m: string) => {
    cloudCfg.value = { ...cloudCfg.value, model: m };
};

const validateIssues = computed(() => validateConfig(cloudCfg.value).issues);

/* ==================== Cloud AI 状态按钮 ==================== */
const aiIsConfigured = computed(() => {
    const c = cloudCfg.value;
    return c.apiKey && c.apiKey.length > 0 && c.baseUrl && c.provider;
});

const aiStatusClass = computed(() => {
    if (!aiIsConfigured.value) return 'ai-unconfigured';
    if (cloudCfg.value.mode === 'local_only') return 'ai-inactive';
    return 'ai-active';
});

const aiStatusTitle = computed(() => {
    if (!aiIsConfigured.value) return t('aiStatusNotConfigured');
    if (cloudCfg.value.mode === 'local_only') return t('aiStatusInactive');
    return t('aiStatusActive');
});

const toggleCloudAi = () => {
    if (!aiIsConfigured.value) {
        activePage.value = 'cloud-ai';
        return;
    }
    const nextMode: AiMode = cloudCfg.value.mode === 'local_only' ? 'local_cloud' : 'local_only';
    patchAiCfg({ mode: nextMode });
    saveCloudAiConfig({ mode: nextMode });
};

const patchAiCfg = (p: Partial<CloudAiConfig>) => {
    cloudCfg.value = { ...cloudCfg.value, ...p };
};
const handleSaveAiCfg = async () => {
    if (validateIssues.value.length) return;
    const saved = await saveCloudAiConfig(cloudCfg.value);
    cloudCfg.value = saved;
    showDialog(t('tipTitle'), t('confirm') + ' ✅');
};
const handleClearAiCache = async () => {
    await clearAiCache();
    showDialog(t('tipTitle'), t('aiClearCache') + ' ✅');
};
const handleTestAiConnection = async () => {
    if (validateIssues.value.length) return;
    // 先保存（写回 key/baseUrl）用于测试
    await saveCloudAiConfig(cloudCfg.value);
    testConnState.value = 'loading';
    testConnMsg.value = '';
    try {
        const res = await classifyByCloud({
            window_title: 'Spotify Premium - Song by Artist',
            process_name: 'Spotify.exe',
            display_mode: 'maximized',
            window_width: 1200, window_height: 800,
            has_audio_session: true,
            is_media_active: true,
        });
        testConnState.value = res ? 'ok' : 'bad';
        testConnMsg.value = res ? `→ ${res.scene} ${Math.round(res.confidence * 100)}%` : 'no response';
    } catch (err) {
        testConnState.value = 'bad';
        testConnMsg.value = err instanceof Error ? err.message.slice(0, 120) : String(err);
    }
};

/* ==================== 场景上下文 (Overview) ==================== */
const sceneTypes: SceneType[] = [
    'game', 'video', 'music', 'office_ide', 'office_doc', 'office_meeting',
    'browsing', 'idle', 'unknown',
];
const currentSceneCtx = ref<SceneContext & { confidence: number }>({
    scene: 'unknown',
    confidence: 0,
    metadata: {},
    source: 'rule',
    updated_at: 0,
});

const sceneEmoji = (s: SceneType) => ({
    game: '🎮', video: '🎬', music: '🎵',
    office_ide: '💻', office_doc: '📄', office_meeting: '📹',
    browsing: '🌐', idle: '☕', unknown: '❓',
}[s]);

/** 场景 → 对应翻译 key 的映射，保证类型安全 */
const SCENE_I18N_KEYS: Record<SceneType, TranslationKey> = {
    game: 'sceneGame',
    video: 'sceneVideo',
    music: 'sceneMusic',
    office_ide: 'sceneOfficeIde',
    office_doc: 'sceneOfficeDoc',
    office_meeting: 'sceneOfficeMeeting',
    browsing: 'sceneBrowsing',
    idle: 'sceneIdle',
    unknown: 'sceneUnknown',
};

/** 类型安全的场景翻译 */
const tScene = (scene: SceneType): string => t(SCENE_I18N_KEYS[scene]);

/** 识别来源翻译 key 映射 */
const SOURCE_I18N_KEYS: Record<string, TranslationKey> = {
    rule: 'sourceRule',
    user_rule: 'sourceUser',
    builtin_rule: 'sourceBuiltin',
    cloud_ai: 'sourceCloudAi',
    manual: 'sourceManual',
};

/** 类型安全的识别来源翻译 */
const tSource = (source: string): string => t(SOURCE_I18N_KEYS[source] ?? 'sourceManual');

/** 规则匹配字段 → 对应翻译 key 的映射 */
const FIELD_I18N_KEYS: Record<RulePatternField, TranslationKey> = {
    process_contains: 'fieldProcessContains',
    title_contains: 'fieldTitleContains',
    display_mode: 'fieldDisplayMode',
};

/** 类型安全的规则匹配字段翻译 */
const tField = (field: RulePatternField): string => t(FIELD_I18N_KEYS[field]);

const formatTime = (ts: number): string => {
    if (!ts) return '—';
    const d = new Date(ts);
    const p = (n: number) => n.toString().padStart(2, '0');
    return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
};

const doLockScene = (s: SceneType) => {
    lockScene(s);
    currentSceneCtx.value = {
        ...currentSceneCtx.value, scene: s, confidence: 1, source: 'manual', updated_at: Date.now(),
    };
    lockDropdownOpen.value = false;
};
const doUnlockScene = () => {
    unlockScene();
    lockDropdownOpen.value = false;
};

/* ==================== 主题应用 ==================== */
let systemThemeMedia: MediaQueryList;
const applyTheme = () => {
    const root = document.documentElement;
    if (themeMode.value === 'dark' || themeMode.value === 'coverglass') root.classList.add('dark-theme');
    else if (themeMode.value === 'light') root.classList.remove('dark-theme');
    else if (themeMode.value === 'system') {
        const m = window.matchMedia('(prefers-color-scheme: dark)');
        root.classList.toggle('dark-theme', m.matches);
    }
};
const handleThemeChange = () => {
    localStorage.setItem('wbs_theme_mode', themeMode.value);
    applyTheme();
    // 通知灵动岛同步主题模式
    emit('control-app-theme', { mode: themeMode.value });
};
const handleSystemThemeUpdate = () => {
    if (themeMode.value === 'system') {
        applyTheme();
        emit('control-app-theme', { mode: 'system' });
    }
};

/* ==================== Dialog ==================== */
const dialog = ref({
    visible: false, title: 'winBangs', message: '', isConfirm: false,
    callback: null as (() => void) | null,
});
const showDialog = (title: string, message: string, isConfirm = false, onConfirm: (() => void) | null = null) => {
    dialog.value = { visible: true, title, message, isConfirm, callback: onConfirm };
};
const closeDialog = () => { dialog.value.visible = false; };
const handleDialogConfirm = () => {
    if (dialog.value.callback) dialog.value.callback();
    closeDialog();
};

const handlePluginDialog = () => {
    showDialog(
        '组件缺失提示',
        '未检测到任务栏组件，请重启软件，或确保插件已放置在软件根目录下。是否立即前往 GitHub 下载？',
        true,
        () => openUrl('https://github.com/9thChasingWindGirl/winBangs/releases/latest'),
    );
};

/* ==================== 更新检查 ==================== */
const parseVersion = (v: string): number[] => {
    const m = v.match(/\d+\.\d+\.\d+/);
    return m ? m[0].split('.').map(Number) : [0, 0, 0];
};

const openRepo = () => openUrl('https://github.com/9thChasingWindGirl/winBangs');

const silentCheckUpdate = async () => {
    try {
        const local = await getVersion();
        const r = await fetch('https://api.github.com/repos/9thChasingWindGirl/winBangs/releases/latest', {
            headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'winBangs-App' },
        });
        if (!r.ok) return;
        const d = await r.json();
        const lArr = parseVersion(local);
        const rArr = parseVersion(d.tag_name);
        for (let i = 0; i < 3; i++) {
            const rn = rArr[i] || 0, ln = lArr[i] || 0;
            if (rn > ln) { hasNewVersion.value = true; return; }
            else if (rn < ln) return;
        }
    } catch { /* ignore */ }
};

const checkUpdate = async () => {
    if (isChecking.value) return;
    isChecking.value = true;
    try {
        const local = await getVersion();
        const ctl = new AbortController();
        const timer = setTimeout(() => ctl.abort(), 10000);
        const r = await fetch('https://api.github.com/repos/9thChasingWindGirl/winBangs/releases/latest', {
            headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'winBangs-App' },
            signal: ctl.signal,
        });
        clearTimeout(timer);
        if (r.status === 404) return showDialog(t('checkUpdateTitle'), t('updateNotFound'));
        if (!r.ok) return showDialog(t('checkUpdateTitle'), t('updateCheckFailed'));

        const d = await r.json();
        const lArr = parseVersion(local);
        const rArr = parseVersion(d.tag_name);
        let newer = false;
        for (let i = 0; i < 3; i++) {
            const rn = rArr[i] || 0, ln = lArr[i] || 0;
            if (rn > ln) { newer = true; break; }
            else if (rn < ln) break;
        }
        if (newer) {
            hasNewVersion.value = true;
            showDialog(t('newVersionTitle'), t('newVersionMessage', { remote: d.tag_name, local }), true,
                () => { openUrl(d.html_url); hasNewVersion.value = false; });
        } else {
            hasNewVersion.value = false;
            showDialog(t('tipTitle'), t('latestVersion'));
        }
    } catch (e: any) {
        if (e?.name === 'AbortError') showDialog(t('networkTimeoutTitle'), t('networkTimeoutMessage'));
        else showDialog(t('networkErrorTitle'), t('networkErrorMessage'));
    } finally { isChecking.value = false; }
};

const toggleAutoStart = async () => {
    try { autoStart.value ? await enable() : await disable(); }
    catch {
        autoStart.value = !autoStart.value;
        showDialog(t('settingFailedTitle'), t('autoStartFailed'));
    }
};

const toggleWidget = async () => {
    const next = !isWidgetVisible.value;
    localStorage.setItem('wbs_widget_visible', String(next));
    await emit('control-island-visibility', { show: next });
    isWidgetVisible.value = next;
};

const minimizeWindow = () => getCurrentWindow().minimize();
const closeWindow = () => getCurrentWindow().hide();

/* ==================== Lifecycle ==================== */
onMounted(async () => {
    await invoke('set_target_player', { player: targetPlayer.value }).catch(() => { });
    if (localStorage.getItem('wbs_taskbar_plugin') === 'true') {
        invoke('toggle_taskbar_plugin', { enable: true }).catch(() => {
            localStorage.setItem('wbs_taskbar_plugin', 'false');
        });
    }
    silentCheckUpdate();
    window.addEventListener('contextmenu', (e) => e.preventDefault(), { capture: true });

    applyTheme();
    applyAccentColor(accentColor.value);
    systemThemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
    systemThemeMedia.addEventListener('change', handleSystemThemeUpdate);

    try { autoStart.value = await isEnabled(); } catch { /* ignore */ }
    try { appVersion.value = await getVersion(); } catch { /* ignore */ }

    // 加载云端 AI 配置
    await reloadCloudAiConfig();
    cloudCfg.value = getCloudAiConfig();

    // 加载场景规则
    await reloadRulesList();
    // 加载权重方案
    await reloadTiltList();

    // 启动场景感知并订阅（用于 Overview 的实时状态）
    startScenePolling();
    const offScene = onSceneChange((ctx) => { currentSceneCtx.value = ctx as typeof currentSceneCtx.value; });

    await listen('open-settings-panel', async () => {
        const w = getCurrentWindow();
        await w.show();
        await w.unminimize();
        await w.setFocus();
    });

    await listen<{ visible: boolean }>('island-status-sync', (e) => {
        isWidgetVisible.value = e.payload.visible;
    });
    const saved = localStorage.getItem('wbs_widget_visible') !== 'false';
    isWidgetVisible.value = saved;
    if (saved) emit('control-island-visibility', { show: true });

    // 清理监听器引用存入闭包
    // @ts-expect-error store cleanup
    window.__wbs_cleanup = offScene;
});

onUnmounted(() => {
    stopScenePolling();
    // @ts-expect-error stored cleanup
    window.__wbs_cleanup?.();
    systemThemeMedia?.removeEventListener('change', handleSystemThemeUpdate);
    if (coverTimer) clearInterval(coverTimer);
});
</script>

<style scoped>
/* =================== 全局语义变量 (PRD §5.2) =================== */
:global(:root) {
    --bg-body: #f5f5f7;
    --text-body: #1e293b;
    --h1-color: #0f172a;
    --muted: #8a8f98;
    --sidebar-bg: #fafafa;
    --sidebar-border: #ececec;
    --header-bg: #ffffffcc;
    --footer-bg: #fffffffa;
    --divider-border: #ececec;

    --card-bg: #ffffff;
    --card-border: #ececec;
    --card-shadow: rgba(15, 23, 42, 0.04);
    --card-h3: #0f172a;

    --accent: oklch(0.58 0.23 25); /* 网易红 */
    --accent-soft: oklch(0.72 0.15 20);

    --item-title: #1e293b;
    --item-desc: #64748b;
    --slider-bg: #d7dce2;
    --slider-on: var(--accent);

    --modal-bg: #ffffff;
    --overlay-bg: rgba(15, 23, 42, 0.3);
}
:global(.dark-theme) {
    --bg-body: #141414;
    --text-body: #e5e7eb;
    --h1-color: #f8fafc;
    --muted: #7f8590;
    --sidebar-bg: #1a1a1a;
    --sidebar-border: #282828;
    --header-bg: #1e1e1ee0;
    --footer-bg: #1e1e1eea;
    --divider-border: #282828;

    --card-bg: #1c1c1d;
    --card-border: #262628;
    --card-shadow: rgba(0, 0, 0, 0.35);
    --card-h3: #f8fafc;

    --accent: oklch(0.62 0.22 20);
    --accent-soft: oklch(0.52 0.12 20);

    --item-title: #f8fafc;
    --item-desc: #94a3b8;
    --slider-bg: #36363a;
    --modal-bg: #1c1c1d;
}

:global(html) {
    color: var(--text-body);
    background: transparent;
}
:global(body) {
    background: transparent !important;
    color: inherit;
    font-family: 'Geist', 'Satoshi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    user-select: none;
    -webkit-font-smoothing: antialiased;
}

/* =================== Shell 布局 =================== */
.app-shell {
    position: relative;
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-rows: 60px 1fr;
    background: var(--bg-body);
    overflow: hidden;
}

/* Coverglass 背景叠加层 */
.coverglass-bg-container {
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
}
.coverglass-bg-image {
    position: absolute; inset: -24px; background-size: cover; background-position: center; filter: blur(24px) saturate(1.2);
}
.coverglass-blur-layer { position: absolute; inset: 0; backdrop-filter: blur(4px); }
.coverglass-noise-layer {
    position: absolute; inset: 0;
    background-image: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px);
    background-size: 3px 3px;
    mix-blend-mode: overlay; opacity: 0.4;
}

/* =================== Header =================== */
.app-header {
    position: relative;
    z-index: 3;
    background: var(--header-bg);
    backdrop-filter: blur(14px) saturate(1.4);
    -webkit-backdrop-filter: blur(14px) saturate(1.4);
    border-bottom: 1px solid var(--divider-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 18px 0 0;
}

.header-left, .header-right {
    display: flex; align-items: center; gap: 14px;
}
.header-left { padding-left: 16px; }
.header-right { justify-content: flex-end; }

.brand-mini { display: flex; align-items: center; gap: 10px; }
.logo-mini { width: 28px; height: 28px; border-radius: 7px; box-shadow: 0 2px 8px rgba(0,0,0,0.25); }
.app-name { font-weight: 700; font-size: 15px; color: var(--h1-color); }

.icon-btn {
    width: 32px; height: 32px; border: none; border-radius: 8px;
    background: transparent; color: var(--item-title);
    display: inline-flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.15s;
}
.icon-btn:hover { background: rgba(0,0,0,0.06); }
:global(.dark-theme) .icon-btn:hover { background: rgba(255,255,255,0.07); }
.icon-btn svg { width: 16px; height: 16px; }
.icon-btn.xs { width: 28px; height: 28px; }
.icon-btn.xs svg { width: 14px; height: 14px; }
.icon-btn.xs.danger { color: oklch(0.55 0.2 25); }

.island-switcher { display: flex; align-items: center; gap: 10px; }
.status-badge {
    font-size: 11px; padding: 2px 8px; border-radius: 999px;
    color: var(--muted);
    background: rgba(0,0,0,0.04);
}
.status-badge.is-active { color: #fff; background: var(--accent); }

.header-switch { transform: scale(0.9); }

.window-ctl { display: flex; gap: 4px; }
.win-btn {
    width: 32px; height: 28px; border: none; border-radius: 6px;
    display: inline-flex; align-items: center; justify-content: center;
    color: var(--item-title); background: transparent; cursor: pointer;
}
.win-btn:hover { background: rgba(0,0,0,0.06); }
.win-btn.close:hover { background: #e5484d; color: #fff; }
.win-btn svg { width: 10px; height: 10px; }

/* =================== Body =================== */
.app-body {
    display: grid;
    grid-template-columns: 220px 1fr;
    grid-template-rows: 1fr auto;
    overflow: hidden;
    min-height: 0;
}

/* ===== Sidebar ===== */
.app-sidebar {
    background: var(--sidebar-bg);
    border-right: 1px solid var(--sidebar-border);
    padding: 16px 10px 24px;
    overflow-y: auto;
}
.nav-group + .nav-group { margin-top: 18px; }
.nav-group-title {
    font-size: 11px; font-weight: 600; color: var(--muted);
    text-transform: uppercase; letter-spacing: 0.08em;
    margin: 6px 10px 6px;
}
.nav-item {
    width: 100%;
    display: flex; align-items: center; gap: 12px;
    padding: 9px 12px;
    background: transparent; border: none;
    border-radius: 9px;
    color: var(--item-title);
    font-size: 14px; font-weight: 500;
    cursor: pointer;
    transition: background 0.14s, color 0.14s;
    text-align: left;
}
.nav-item:hover {
    background: color-mix(in oklab, var(--accent) 8%, transparent);
    color: var(--accent);
}
:global(.dark-theme) .nav-item:hover {
    background: color-mix(in oklab, var(--accent) 10%, transparent);
}
.nav-item.active {
    background: var(--accent);
    color: #fff;
    box-shadow: 0 6px 14px -6px color-mix(in oklab, var(--accent) 70%, black 30%);
}
.nav-icon { width: 16px; height: 16px; flex: 0 0 auto; transition: color 0.14s; }

/* ===== Main Zone ===== */
.app-main {
    position: relative;
    overflow: hidden;
    min-height: 0;
}
.main-scroll {
    position: absolute;
    inset: 0;
    overflow-y: auto;
    padding: 24px 32px;
    scroll-behavior: smooth;
}

.page-header {
    display: flex; flex-direction: column; gap: 4px;
    margin-bottom: 20px;
}
.page-header.between {
    flex-direction: row; justify-content: space-between; align-items: flex-end;
}
.page-header h2 {
    margin: 0;
    font-size: 22px; font-weight: 700; letter-spacing: -0.015em;
    color: var(--h1-color);
}
.page-sub { margin: 0; color: var(--muted); font-size: 13px; }

/* ----- Overview ----- */
.overview-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 20px;
}
.big-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 18px;
    padding: 22px;
    box-shadow: 0 4px 18px var(--card-shadow);
}
.card-top {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 14px;
}
.card-top h3 { margin: 0; color: var(--card-h3); font-size: 15px; font-weight: 600; }
.confidence-chip {
    font-size: 12px; color: var(--accent);
    padding: 2px 10px; border-radius: 999px;
    background: color-mix(in oklab, var(--accent) 12%, transparent);
    border: 1px solid color-mix(in oklab, var(--accent) 24%, transparent);
}
.scene-display {
    display: flex; align-items: center; justify-content: space-between; gap: 20px;
    padding: 18px;
    border-radius: 14px;
    background: linear-gradient(135deg, color-mix(in oklab, var(--accent) 14%, transparent), transparent 60%);
    margin-bottom: 14px;
}
.scene-hero { display: flex; align-items: center; gap: 14px; }
.scene-emoji {
    width: 56px; height: 56px; border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    font-size: 28px;
    background: var(--card-bg);
    box-shadow: 0 6px 18px var(--card-shadow);
    border: 1px solid var(--card-border);
}
.scene-name { font-size: 20px; font-weight: 700; color: var(--card-h3); }
.scene-src { font-size: 12px; color: var(--muted); margin-top: 2px; }

.meta-row {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
}
.meta {
    display: flex; flex-direction: column; gap: 2px;
    padding: 10px 14px;
    border-radius: 10px;
    background: rgba(0,0,0,0.02);
    border: 1px solid var(--divider-border);
}
:global(.dark-theme) .meta { background: rgba(255,255,255,0.03); }
.meta-k { font-size: 11px; color: var(--muted); letter-spacing: 0.04em; text-transform: uppercase; }
.meta-v { font-size: 13px; color: var(--item-title); font-weight: 500; }
.meta-v.on { color: var(--accent); }
.meta-v.mono { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 12px; word-break: break-all; }

/* ----- Widget column (天气) ----- */
.widget-col {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.widget-col .weather-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 18px;
    box-shadow: 0 4px 18px var(--card-shadow);
}

/* ----- Buttons (PRD §5.4) ----- */
.btn {
    height: 34px;
    padding: 0 14px;
    border-radius: 999px;
    border: 1px solid var(--btn-border, var(--divider-border));
    font-size: 13px; font-weight: 600;
    cursor: pointer;
    display: inline-flex; align-items: center; gap: 8px;
    transition: transform 0.08s, background 0.15s, border-color 0.15s;
}
.btn:active { transform: scale(0.98); }
.btn-primary {
    --btn-border: var(--accent);
    background: var(--accent); color: #fff;
    box-shadow: 0 6px 16px -6px color-mix(in oklab, var(--accent) 60%, black 40%);
}
.btn-primary:hover { filter: brightness(1.06); }
.btn-primary:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
.btn-secondary {
    background: transparent; color: var(--item-title);
}
.btn-secondary:hover { background: rgba(0,0,0,0.04); }
:global(.dark-theme) .btn-secondary:hover { background: rgba(255,255,255,0.05); }

.head-actions { display: flex; gap: 8px; }

/* ----- Segmented ----- */
.segmented {
    display: inline-flex;
    padding: 3px;
    border-radius: 999px;
    background: rgba(0,0,0,0.04);
    border: 1px solid var(--divider-border);
}
:global(.dark-theme) .segmented { background: rgba(255,255,255,0.04); }
.seg-btn {
    border: none; background: transparent;
    height: 30px; padding: 0 14px;
    border-radius: 999px;
    color: var(--item-title); font-size: 13px; font-weight: 500;
    cursor: pointer;
}
.seg-btn.active { background: var(--accent); color: #fff; box-shadow: 0 2px 6px -2px rgba(0,0,0,0.2); }
.seg-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    color: var(--muted);
}

/* ----- Settings ----- */
.settings-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
}
.card-setting {
    grid-column: span 1;
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 14px;
    padding: 18px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    box-shadow: 0 2px 10px var(--card-shadow);
}
.card-setting.wide { grid-column: span 2; }
.item-meta { display: flex; flex-direction: column; gap: 3px; }
.item-title { font-size: 14px; font-weight: 600; color: var(--item-title); }
.item-desc { font-size: 12px; color: var(--item-desc); }

/* ----- Dropdown (复用旧样式) ----- */
.custom-dropdown {
    position: relative;
    min-width: 180px;
    user-select: none;
}
.dropdown-trigger {
    display: flex; align-items: center; justify-content: space-between; gap: 10px;
    padding: 7px 12px;
    border-radius: 9px;
    border: 1px solid var(--divider-border);
    background: rgba(0,0,0,0.02);
    font-size: 13px; color: var(--item-title);
    cursor: pointer;
}
:global(.dark-theme) .dropdown-trigger { background: rgba(255,255,255,0.03); }
.current-item { display: flex; align-items: center; gap: 6px; }
.arrow-icon { width: 14px; height: 14px; transition: transform 0.15s; }
.arrow-icon.is-open { transform: rotate(180deg); }
.dropdown-menu {
    position: absolute; right: 0; top: calc(100% + 6px); z-index: 50;
    min-width: 100%;
    background: var(--modal-bg);
    border: 1px solid var(--divider-border);
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(15,23,42,0.12);
    padding: 6px; overflow: hidden;
}
.dropdown-item {
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 13px; color: var(--item-title);
    cursor: pointer;
    display: flex; align-items: center; gap: 8px;
}
.dropdown-item:hover { background: rgba(0,0,0,0.04); }
:global(.dark-theme) .dropdown-item:hover { background: rgba(255,255,255,0.05); }
.dropdown-item.is-active { background: color-mix(in oklab, var(--accent) 14%, transparent); color: var(--accent); }
.dropdown-group-label {
    display: flex; align-items: center; gap: 6px;
    padding: 6px 10px 4px;
    font-size: 11px; font-weight: 600;
    color: var(--item-desc);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    user-select: none;
}
.dropdown-group-label .group-icon { font-size: 13px; }
.dropdown-group-label .group-name { opacity: 0.85; }
.dropdown-item .item-indicator {
    display: inline-block; width: 10px; font-size: 10px; color: var(--accent);
}
.dropdown-item .item-indicator.placeholder { visibility: hidden; }
.dropdown-divider { height: 1px; background: var(--divider-border); margin: 4px 0; }
.dropdown-enter-active, .dropdown-leave-active { transition: opacity 0.1s, transform 0.12s; transform-origin: top; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-4px); }

.platform-icon { width: 16px; height: 16px; display: inline-block; }

/* ----- Switch ----- */
.switch {
    position: relative;
    display: inline-block;
    width: 40px; height: 22px;
    flex: 0 0 auto;
}
.switch input { opacity: 0; width: 0; height: 0; }
.switch .slider {
    position: absolute; inset: 0;
    background: var(--slider-bg);
    border-radius: 999px;
    transition: 0.18s;
    cursor: pointer;
}
.switch .slider::before {
    content: ''; position: absolute;
    left: 3px; top: 3px;
    width: 16px; height: 16px;
    border-radius: 50%;
    background: #fff;
    transition: 0.18s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.switch input:checked + .slider { background: var(--slider-on); }
.switch input:checked + .slider::before { transform: translateX(18px); }
.mini-switch { width: 32px; height: 18px; }
.mini-switch .slider::before { width: 12px; height: 12px; }
.mini-switch input:checked + .slider::before { transform: translateX(14px); }

.range-input {
    flex: 1;
    -webkit-appearance: none; appearance: none;
    height: 6px; border-radius: 999px;
    background: var(--slider-bg);
    outline: none;
}
.range-input::-webkit-slider-thumb {
    -webkit-appearance: none; appearance: none;
    width: 18px; height: 18px; border-radius: 50%;
    background: #fff;
    border: 2px solid var(--accent);
    box-shadow: 0 1px 4px rgba(0,0,0,0.18);
    cursor: pointer;
}

/* ----- Scene Category Cards (场景分类卡片) ----- */
.scene-cat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 16px;
}
.scene-cat-card {
    display: flex; align-items: center; gap: 16px;
    padding: 20px;
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 16px;
    cursor: pointer;
    transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
    box-shadow: 0 2px 10px var(--card-shadow);
    position: relative;
    overflow: hidden;
}
.scene-cat-card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 4px;
    background: var(--cat-color, var(--accent));
    opacity: 0;
    transition: opacity 0.2s;
}
.scene-cat-card:hover {
    transform: translateY(-3px);
    border-color: var(--cat-color, var(--accent));
    box-shadow: 0 8px 24px -6px color-mix(in oklab, var(--cat-color, var(--accent)) 30%, black 70%);
}
.scene-cat-card:hover::before { opacity: 1; }

.cat-icon-wrap {
    width: 52px; height: 52px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
}
.cat-icon { font-size: 26px; }

.cat-info { flex: 1; min-width: 0; }
.cat-info h3 { margin: 0 0 4px; font-size: 16px; font-weight: 600; color: var(--item-title); }
.cat-info p { margin: 0; font-size: 12px; color: var(--muted); line-height: 1.4;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.cat-stats { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
.cat-stat-num { font-size: 22px; font-weight: 700; color: var(--cat-color, var(--accent)); line-height: 1; }
.cat-stat-label { font-size: 11px; color: var(--muted); margin-top: 2px; }

.cat-arrow { width: 18px; height: 18px; color: var(--muted); flex-shrink: 0; transition: transform 0.15s; }
.scene-cat-card:hover .cat-arrow { transform: translateX(3px); color: var(--cat-color, var(--accent)); }

/* 场景详情页头 */
.scene-detail-head { display: flex; align-items: center; gap: 12px; }
.back-btn { padding: 6px 8px !important; }
.cat-icon-sm { font-size: 28px; }

/* 规则标签：场景标记 */
.tag.scene-tag { background: rgba(0,0,0,0.04); color: var(--item-title); }
:global(.dark-theme) .tag.scene-tag { background: rgba(255,255,255,0.06); }

.empty-state { padding: 40px; text-align: center; display: flex; flex-direction: column; gap: 14px; align-items: center; }
.empty-state p { color: var(--muted); font-size: 14px; margin: 0; }
.rules-list { display: flex; flex-direction: column; gap: 12px; }
.rule-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 14px;
    padding: 14px 18px;
    box-shadow: 0 2px 10px var(--card-shadow);
}
.rule-card.disabled { opacity: 0.55; }
.rule-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; gap: 12px; }
.rule-head-l { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.rule-name { margin: 0; font-size: 14px; font-weight: 600; color: var(--item-title); }
.tag {
    font-size: 11px; padding: 2px 8px; border-radius: 999px;
    border: 1px solid var(--divider-border);
    background: rgba(0,0,0,0.03);
    color: var(--muted);
}
.tag.tag-user { color: var(--accent); border-color: color-mix(in oklab, var(--accent) 24%, transparent); }
.tag.weight { font-family: ui-monospace, monospace; }
.rule-head-r { display: flex; align-items: center; gap: 10px; }
.scene-chip {
    font-size: 12px;
    padding: 3px 10px; border-radius: 999px;
    background: rgba(0,0,0,0.04);
    border: 1px solid var(--divider-border);
    color: var(--item-title);
}
.scene-chip.scene-game { background: oklch(0.94 0.06 25); color: oklch(0.5 0.2 25); }
.scene-chip.scene-video { background: oklch(0.94 0.06 285); color: oklch(0.5 0.2 285); }
.scene-chip.scene-music { background: oklch(0.94 0.06 145); color: oklch(0.5 0.2 145); }
.scene-chip.scene-office_ide { background: oklch(0.94 0.04 230); color: oklch(0.5 0.14 230); }
.scene-chip.scene-office_doc { background: oklch(0.94 0.04 100); color: oklch(0.5 0.12 100); }
.scene-chip.scene-office_meeting { background: oklch(0.94 0.06 320); color: oklch(0.5 0.18 320); }
.scene-chip.scene-browsing { background: oklch(0.94 0.06 200); color: oklch(0.5 0.14 200); }

/* ===== 权重方案卡片 ===== */
.tilt-scheme-section { margin-bottom: 28px; }
.tilt-scheme-section .section-header { margin-bottom: 14px; }
.tilt-scheme-section .section-header h3 { margin: 0 0 4px; font-size: 15px; font-weight: 600; color: var(--item-title); }
.tilt-scheme-section .section-header .page-sub { margin: 0; font-size: 12px; color: var(--muted); }
.section-header { display: flex; flex-direction: column; gap: 2px; }
.affinity-actions { margin-top: 8px; flex-direction: row; gap: 8px; }

.tilt-card-grid { display: flex; flex-direction: column; gap: 12px; }
.tilt-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 14px;
    padding: 16px 18px;
    box-shadow: 0 2px 10px var(--card-shadow);
    position: relative;
}
.tilt-card.disabled { opacity: 0.5; }
.tilt-card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
}
.tilt-card-title {
    display: flex;
    align-items: center;
    gap: 8px;
}
.tilt-card-title h4 { margin: 0; font-size: 15px; font-weight: 600; color: var(--item-title); }
.tilt-params {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 10px;
    margin-bottom: 12px;
}
.tilt-param {
    display: flex;
    flex-direction: column;
    gap: 2px;
    cursor: help;
}
.tilt-param-label { font-size: 11px; color: var(--muted); }
.tilt-param-val { font-size: 15px; font-weight: 600; color: var(--item-title); font-variant-numeric: tabular-nums; }
.tilt-edit-btn { align-self: flex-start; }

/* ===== 权重方案编辑对话框 ===== */
.tilt-edit-modal { max-width: 420px; }
.tilt-edit-grid { display: flex; flex-direction: column; gap: 16px; }
.tilt-edit-field label { font-size: 12px; color: var(--muted); display: block; margin-bottom: 4px; }
.tilt-edit-input-row {
    display: flex;
    align-items: center;
    gap: 10px;
}
.tilt-edit-input-row input[type="range"] { flex: 1; }
.tilt-edit-val {
    min-width: 48px;
    text-align: right;
    font-size: 14px;
    font-weight: 600;
    color: var(--accent);
    font-variant-numeric: tabular-nums;
}

.conds { display: flex; flex-wrap: wrap; gap: 8px; }
.cond {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 10px; border-radius: 8px;
    background: rgba(0,0,0,0.03);
    border: 1px solid var(--divider-border);
    font-size: 12px;
}
:global(.dark-theme) .cond { background: rgba(255,255,255,0.04); }
.cond-field { color: var(--muted); }
.cond-op { color: var(--accent); font-weight: 700; }
.cond-value { color: var(--item-title); font-family: ui-monospace, monospace; }
.cond-tag { color: var(--muted); font-family: ui-monospace, monospace; font-size: 11px; }

/* ----- Cloud AI form ----- */
.form-stack { display: flex; flex-direction: column; gap: 18px; }
.form-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 14px;
}
.form-item { display: flex; flex-direction: column; gap: 6px; grid-column: span 2; }
.form-item.col-2 { grid-column: span 2; }
.form-item.col-4 { grid-column: span 4; }
.form-item.col-6 { grid-column: span 6; }
.form-item.full textarea { min-height: 96px; resize: vertical; }
.form-item label { font-size: 12px; color: var(--muted); font-weight: 500; }
.form-item input,
.form-item select,
.form-item textarea {
    padding: 9px 12px;
    border-radius: 10px;
    border: 1px solid var(--divider-border);
    background: rgba(0,0,0,0.02);
    color: var(--item-title); font-size: 13px;
    outline: none;
    transition: border-color 0.15s;
}
:global(.dark-theme) .form-item input,
:global(.dark-theme) .form-item select,
:global(.dark-theme) .form-item textarea { background: rgba(255,255,255,0.03); }
.form-item input:focus,
.form-item select:focus,
.form-item textarea:focus { border-color: var(--accent); }
.check-label { display: inline-flex; align-items: center; gap: 8px; color: var(--item-title); font-size: 13px; }

.form-actions {
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;
    padding: 14px 16px;
    background: rgba(0,0,0,0.02);
    border: 1px dashed var(--divider-border);
    border-radius: 12px;
}
:global(.dark-theme) .form-actions { background: rgba(255,255,255,0.03); }
.form-actions .push-right { display: flex; gap: 8px; }
.validate { margin: 0; color: oklch(0.5 0.2 70); font-size: 13px; }
.test-result { margin: 0; font-size: 13px; }
.test-result.ok { color: oklch(0.5 0.2 145); }
.test-result.bad { color: oklch(0.5 0.2 25); }

/* =================== Cloud AI Page =================== */
.cloudai-stack { display: flex; flex-direction: column; gap: 14px; }

.cloudai-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 14px;
    padding: 16px 18px;
    box-shadow: 0 2px 10px var(--card-shadow);
    transition: border-color 0.15s;
}

.cloudai-card-head {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 14px;
}
.cloudai-card-head.clickable { cursor: pointer; user-select: none; }
.cloudai-card-head.clickable:hover .cloudai-card-title { color: var(--accent); }

.cloudai-card-num {
    display: flex; align-items: center; justify-content: center;
    width: 22px; height: 22px; flex-shrink: 0;
    border-radius: 7px;
    background: color-mix(in oklab, var(--accent) 14%, transparent);
    color: var(--accent);
    font-size: 12px; font-weight: 700;
}
.cloudai-card-title { font-size: 14px; font-weight: 600; color: var(--h1-color); transition: color 0.15s; }

.expand-icon {
    width: 16px; height: 16px;
    margin-left: auto;
    color: var(--muted);
    transition: transform 0.2s ease;
}
.cloudai-card.collapsible.is-expanded .expand-icon { transform: rotate(180deg); }

.cloudai-card-body {
    padding-top: 4px;
    overflow: hidden;
}
.collapse-enter-active, .collapse-leave-active { transition: max-height 0.25s ease, opacity 0.2s ease; }
.collapse-enter-from, .collapse-leave-to { max-height: 0; opacity: 0; }
.collapse-enter-to, .collapse-leave-from { max-height: 500px; opacity: 1; }

/* Provider grid */
.provider-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 8px;
}
.provider-chip {
    position: relative;
    display: flex; align-items: center; gap: 8px;
    padding: 10px 12px;
    border-radius: 10px;
    border: 1.5px solid var(--divider-border);
    background: var(--card-bg);
    color: var(--text-body);
    cursor: pointer;
    transition: all 0.15s;
    overflow: hidden;
}
.provider-chip:hover {
    border-color: color-mix(in oklab, var(--accent) 40%, transparent);
    background: color-mix(in oklab, var(--accent) 5%, var(--card-bg));
}
.provider-chip.is-active {
    border-color: var(--accent);
    background: color-mix(in oklab, var(--accent) 10%, var(--card-bg));
    box-shadow: 0 0 0 1px var(--accent) inset;
}
.chip-tag {
    font-size: 10px; font-weight: 700;
    padding: 2px 6px; border-radius: 5px;
    background: color-mix(in oklab, var(--accent) 15%, transparent);
    color: var(--accent);
    flex-shrink: 0;
}
.provider-chip.is-active .chip-tag { background: var(--accent); color: white; }
.chip-name { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.chip-check { margin-left: auto; color: var(--accent); font-size: 14px; font-weight: 700; flex-shrink: 0; }

/* Fields */
.cloudai-fields { display: flex; flex-direction: column; gap: 12px; }
.cloudai-card-body .cloudai-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 14px;
}
.cloudai-card-body .field-row:not(.half) { grid-column: 1 / -1; }
.field-row { display: flex; flex-direction: column; gap: 5px; }
.field-row label { font-size: 12px; color: var(--muted); font-weight: 500; display: flex; align-items: center; gap: 6px; }
.field-hint { font-size: 10px; color: var(--muted); opacity: 0.7; font-weight: 400; }
.field-row input, .field-row textarea {
    padding: 8px 10px;
    border: 1px solid var(--divider-border);
    border-radius: 8px;
    background: var(--card-bg);
    color: var(--text-body);
    font-size: 13px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
}
.field-row input:focus, .field-row textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px color-mix(in oklab, var(--accent) 16%, transparent);
}
.field-row textarea { resize: vertical; min-height: 60px; font-family: 'Cascadia Code', 'Consolas', monospace; font-size: 12px; }
.check-row { justify-content: center; }
.check-label { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-body); cursor: pointer; }
.check-label input[type="checkbox"] { accent-color: var(--accent); width: 16px; height: 16px; cursor: pointer; }

/* Model section */
.model-section { display: flex; flex-direction: column; gap: 10px; }
.model-input-row { display: flex; gap: 8px; align-items: stretch; }
.model-input {
    flex: 1; min-width: 0;
    padding: 8px 12px;
    border: 1px solid var(--divider-border);
    border-radius: 8px;
    background: var(--card-bg);
    color: var(--text-body);
    font-size: 13px;
    outline: none;
    transition: border-color 0.15s;
}
.model-input:focus { border-color: var(--accent); }
.cloudai-action-btn {
    flex-shrink: 0;
    padding: 8px 14px;
    border: 1px solid var(--divider-border);
    border-radius: 8px;
    background: var(--card-bg);
    color: var(--text-body);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
}
.cloudai-action-btn:hover:not(:disabled) {
    border-color: var(--accent);
    color: var(--accent);
    background: color-mix(in oklab, var(--accent) 5%, var(--card-bg));
}
.cloudai-action-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.model-status-row { display: flex; gap: 16px; flex-wrap: wrap; min-height: 18px; }
.status-ok { font-size: 12px; color: oklch(0.5 0.18 145); font-weight: 500; }
.status-ok.latency-slow { color: oklch(0.6 0.2 70); }
.status-bad { font-size: 12px; color: oklch(0.55 0.22 25); font-weight: 500; }

.fetched-models-list { display: flex; flex-wrap: wrap; gap: 6px; padding-top: 4px; }
.model-pill {
    padding: 5px 10px;
    border: 1px solid var(--divider-border);
    border-radius: 6px;
    background: var(--card-bg);
    color: var(--text-body);
    font-size: 11px;
    cursor: pointer;
    transition: all 0.12s;
    font-family: 'Cascadia Code', 'Consolas', monospace;
}
.model-pill:hover { border-color: var(--accent); color: var(--accent); }
.model-pill.is-selected {
    border-color: var(--accent);
    background: color-mix(in oklab, var(--accent) 12%, var(--card-bg));
    color: var(--accent);
    font-weight: 600;
}

/* Footer */
.cloudai-footer {
    display: flex; flex-direction: column; gap: 10px;
    padding-top: 8px;
}
.footer-actions { display: flex; gap: 8px; justify-content: flex-end; }

/* ----- About ----- */
.about-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 18px;
    padding: 26px;
    box-shadow: 0 4px 18px var(--card-shadow);
    display: flex; flex-direction: column; gap: 20px;
}
.about-logo { display: flex; align-items: center; gap: 18px; }
.logo-lg { width: 72px; height: 72px; border-radius: 18px; box-shadow: 0 8px 24px rgba(0,0,0,0.25); }
.about-logo h3 { margin: 0 0 4px; font-size: 18px; color: var(--h1-color); }
.muted { color: var(--muted); font-size: 13px; }
.about-links { display: flex; flex-wrap: wrap; gap: 10px; }
.link-pill {
    display: inline-flex; align-items: center; gap: 8px;
    height: 36px; padding: 0 14px;
    border-radius: 999px;
    background: rgba(0,0,0,0.04);
    border: 1px solid var(--divider-border);
    color: var(--item-title); font-size: 13px; font-weight: 500;
    cursor: pointer;
}
:global(.dark-theme) .link-pill { background: rgba(255,255,255,0.04); }
.link-pill:hover { color: var(--accent); border-color: color-mix(in oklab, var(--accent) 30%, transparent); }
.update-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #e5484d;
    box-shadow: 0 0 0 2px rgba(229,72,77,0.2);
}

/* =================== Footer =================== */
.app-footer {
    grid-column: 1 / -1;
    height: 92px;
    background: var(--footer-bg);
    backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
    border-top: 1px solid var(--divider-border);
    display: flex;
    align-items: center;
    padding: 0 18px;
}
.app-footer > template:empty { display: none; }

/* 总览页 footer 三列布局 */
.app-footer:has(.ft-cover) {
    display: grid;
    grid-template-columns: 1fr 1.2fr 1fr;
}
.ft-cover { display: flex; align-items: center; gap: 12px; min-width: 0; }
.cover-art {
    width: 58px; height: 58px; border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.22);
    object-fit: cover;
}
.cover-art.placeholder {
    background: color-mix(in oklab, var(--accent) 15%, transparent);
    display: flex; align-items: center; justify-content: center;
    color: var(--accent);
}
.cover-art.placeholder svg { width: 26px; height: 26px; }
.track-info { min-width: 0; }
.track-title {
    font-size: 13px; font-weight: 600; color: var(--item-title);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    max-width: 260px;
}
.track-artist { font-size: 11px; }

.ft-ctl { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; }
.ctl-row.top { display: flex; align-items: center; gap: 10px; }
.ctl-btn {
    width: 30px; height: 30px;
    border: none; border-radius: 50%;
    background: transparent; color: var(--item-title);
    display: inline-flex; align-items: center; justify-content: center;
    cursor: pointer;
}
.ctl-btn:hover { background: rgba(0,0,0,0.05); color: var(--accent); }
:global(.dark-theme) .ctl-btn:hover { background: rgba(255,255,255,0.06); }
.ctl-btn svg { width: 14px; height: 14px; }

.ft-right { display: flex; justify-content: flex-end; align-items: center; gap: 6px; }

/* ===== 非总览页 Footer 概要状态栏 ===== */
.ft-summary {
    display: flex; align-items: center; gap: 20px;
    width: 100%; height: 100%;
    padding: 0 4px;
}
.ft-summary-item {
    display: flex; align-items: center; gap: 8px;
    padding: 6px 12px;
    border-radius: 10px;
    background: rgba(0,0,0,0.025);
    border: 1px solid var(--divider-border);
    height: 38px;
}
.ft-summary-item.icon-only { padding: 6px 8px; }
:global(.dark-theme) .ft-summary-item { background: rgba(255,255,255,0.03); }
.ft-label { font-size: 12px; color: var(--muted); font-weight: 500; white-space: nowrap; }

.ft-summary-item.scene-chip {
    background: color-mix(in oklab, var(--accent) 8%, transparent);
    border-color: color-mix(in oklab, var(--accent) 25%, transparent);
}
.ft-scene-emoji { font-size: 18px; }
.ft-scene-name { font-size: 13px; font-weight: 600; color: var(--item-title); }

/* footer 中的 mini-switch 尺寸适配 */
.ft-summary .mini-switch { transform: scale(0.85); }
.ft-summary .ai-status-btn { width: 30px; height: 30px; border-radius: 8px; }
.ft-summary .ai-status-btn svg { width: 14px; height: 14px; }

/* ===== Cloud AI 状态按钮 (Header) ===== */
.ai-status-btn {
    position: relative;
    width: 34px; height: 34px;
    border-radius: 10px;
    border: 1px solid var(--divider-border);
    background: rgba(0,0,0,0.03);
    color: var(--muted);
    display: inline-flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
}
:global(.dark-theme) .ai-status-btn { background: rgba(255,255,255,0.04); }
.ai-status-btn svg { width: 16px; height: 16px; }
.ai-status-btn:hover { transform: scale(1.05); }

.ai-status-btn.ai-unconfigured {
    color: var(--muted);
    background: rgba(0,0,0,0.04);
    opacity: 0.6;
}
.ai-status-btn.ai-inactive {
    color: var(--item-desc);
    background: rgba(0,0,0,0.06);
    border-color: var(--divider-border);
}
.ai-status-btn.ai-active {
    color: #fff;
    background: #22c55e;
    border-color: #16a34a;
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
    animation: ai-breathe 2s ease-in-out infinite;
}
@keyframes ai-breathe {
    0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
    50% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
}
.ai-dot {
    position: absolute;
    bottom: 6px; right: 6px;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: currentColor;
}

/* ===== Overview AI 模式区域 ===== */
.overview-section {
    display: inline-flex; align-items: center; gap: 16px;
    padding: 10px 16px;
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 14px;
    box-shadow: 0 2px 10px var(--card-shadow);
}
.section-label {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; font-weight: 600; color: var(--item-title);
    padding-right: 16px;
    border-right: 1px solid var(--divider-border);
}
.section-label svg { width: 16px; height: 16px; color: var(--accent); }
.section-hint { font-size: 12px; color: var(--muted); margin-left: auto; }

/* ===== Overview Row (section + accent picker) ===== */
.overview-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}
.overview-row .overview-section {
    margin-bottom: 0;
}

/* ===== Accent Color Picker (comic-panel style) ===== */
.accent-picker-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 14px;
    box-shadow: 0 2px 10px var(--card-shadow);
}
.accent-picker-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--item-desc);
    white-space: nowrap;
    padding-right: 8px;
    border-right: 1px solid var(--divider-border);
}
.accent-picker {
    display: flex;
    align-items: center;
    padding: 2px 0;
}
.accent-swatch {
    position: relative;
    flex-shrink: 0;
    width: 28px;
    height: 36px;
    border: none;
    outline: none;
    padding: 0;
    margin: 0 -3px;
    background-color: transparent;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.accent-swatch::after {
    position: absolute;
    content: '';
    inset: 0;
    width: 28px;
    height: 28px;
    top: 4px;
    background-color: var(--swatch-color);
    border-radius: 6px;
    border: 2px solid transparent;
    box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.18);
    pointer-events: none;
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                box-shadow 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                border-color 0.2s ease;
}
.accent-swatch:hover {
    transform: scale(1.3) translateY(-6px);
    z-index: 999;
}
.accent-swatch:hover::after {
    box-shadow: 5px 5px 0 0 rgba(0, 0, 0, 0.25);
}
.accent-swatch.is-selected::after {
    border-color: #000;
    box-shadow: 3px 3px 0 0 #000;
    transform: translateY(-2px);
}
:global(.dark-theme) .accent-swatch.is-selected::after {
    border-color: #fff;
    box-shadow: 3px 3px 0 0 #fff;
}
.accent-swatch::before {
    position: absolute;
    content: attr(aria-label);
    left: 50%;
    bottom: 44px;
    transform: translateX(-50%) scale(0.6) translateY(6px);
    transform-origin: bottom center;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
    line-height: 1;
    padding: 5px 8px;
    background-color: var(--card-bg);
    color: var(--item-title);
    border: 2px solid #000;
    border-radius: 6px;
    pointer-events: none;
    white-space: nowrap;
    box-shadow: 2px 2px 0 0 #000;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition:
        opacity 0.15s ease,
        visibility 0.15s ease,
        transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.accent-swatch:hover::before {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) scale(1) translateY(0);
}
:global(.dark-theme) .accent-swatch::before {
    border-color: #fff;
    box-shadow: 2px 2px 0 0 #fff;
}

/* ===== Music 控制卡片 ===== */
.media-ctrl-card { padding: 18px; }
.media-ctrl-body { display: flex; flex-direction: column; gap: 12px; }
.music-detected-display {
    display: flex; align-items: center; flex-wrap: wrap; gap: 10px;
    padding: 12px 14px;
    border-radius: 12px;
    background: color-mix(in oklab, var(--accent) 6%, transparent);
    border: 1px solid color-mix(in oklab, var(--accent) 18%, transparent);
    position: relative;
}
.music-detected-display.no-music {
    background: rgba(0,0,0,0.02);
    border-color: var(--divider-border);
}
:global(.dark-theme) .music-detected-display.no-music { background: rgba(255,255,255,0.03); }
.detected-label { font-size: 12px; color: var(--item-desc); font-weight: 500; }
.detected-platform-tag {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 13px; font-weight: 600;
    background: color-mix(in oklab, var(--accent) 12%, transparent);
    color: var(--accent);
    border: 1px solid color-mix(in oklab, var(--accent) 25%, transparent);
}
.detected-platform-tag.unknown {
    background: rgba(0,0,0,0.05);
    color: var(--muted);
    border-color: var(--divider-border);
}
:global(.dark-theme) .detected-platform-tag.unknown { background: rgba(255,255,255,0.06); }
.correct-btn {
    padding: 4px 12px; border-radius: 8px; border: 1px solid var(--accent);
    background: transparent; color: var(--accent);
    font-size: 12px; font-weight: 500; cursor: pointer;
    transition: all 0.15s;
}
.correct-btn:hover { background: var(--accent); color: #fff; }
.correction-menu {
    position: absolute; top: calc(100% + 4px); left: 0; right: 0;
    z-index: 20; max-height: 240px; overflow-y: auto;
}

/* =================== Modal =================== */
.modal-overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: var(--overlay-bg);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
}
.modal-card {
    width: 100%; max-width: 420px;
    background: var(--modal-bg);
    border: 1px solid var(--divider-border);
    border-radius: 14px;
    padding: 20px 22px;
    box-shadow: 0 18px 40px rgba(15,23,42,0.2);
}
.modal-card.rule-modal { max-width: 560px; }
.modal-header h4 { margin: 0 0 8px; font-size: 16px; color: var(--item-title); }
.modal-body p { margin: 0; color: var(--item-desc); font-size: 14px; line-height: 1.55; }
.modal-footer {
    margin-top: 18px; display: flex; justify-content: flex-end; gap: 10px;
}

/* ----- 规则 Dialog 内表单样式 ----- */
.rule-modal .form-stack { gap: 14px; }
.rule-modal .form-grid { grid-template-columns: repeat(3, 1fr); gap: 12px; }
.rule-modal .form-item { grid-column: span 1; }
.rule-modal .form-item.col-6 { grid-column: span 3; }
.rule-modal .form-item label { font-size: 12px; color: var(--muted); margin-bottom: 4px; }
.rule-modal .form-item input,
.rule-modal .form-item select {
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid var(--divider-border);
    background: rgba(0,0,0,0.02);
    color: var(--item-title); font-size: 13px;
    outline: none;
}
:global(.dark-theme) .rule-modal .form-item input,
:global(.dark-theme) .rule-modal .form-item select {
    background: rgba(255,255,255,0.03);
}
.rule-modal .form-item input:focus,
.rule-modal .form-item select:focus { border-color: var(--accent); }
.rule-modal .check-label { font-size: 13px; }

.conds-block {
    padding: 14px;
    border-radius: 12px;
    background: rgba(0,0,0,0.02);
    border: 1px dashed var(--divider-border);
}
:global(.dark-theme) .conds-block { background: rgba(255,255,255,0.03); }
.conds-head {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 12px;
}
.conds-head > label { margin: 0; font-size: 12px; color: var(--muted); font-weight: 600; }
.btn.mini { height: 28px; padding: 0 10px; font-size: 12px; }

.cond-rows { display: flex; flex-direction: column; gap: 8px; }
.cond-row {
    display: flex; align-items: center; gap: 8px;
    padding: 8px;
    border-radius: 8px;
    background: var(--card-bg);
    border: 1px solid var(--card-border);
}
.cond-f {
    flex: 0 0 140px;
    padding: 7px 10px;
    border-radius: 8px;
    border: 1px solid var(--divider-border);
    background: rgba(0,0,0,0.02);
    color: var(--item-title); font-size: 12px;
    outline: none;
}
:global(.dark-theme) .cond-f { background: rgba(255,255,255,0.03); }
.cond-v {
    flex: 1;
    min-width: 0;
    padding: 7px 10px;
    border-radius: 8px;
    border: 1px solid var(--divider-border);
    background: rgba(0,0,0,0.02);
    color: var(--item-title); font-size: 12px;
    outline: none;
}
:global(.dark-theme) .cond-v { background: rgba(255,255,255,0.03); }
.cond-f:focus, .cond-v:focus { border-color: var(--accent); }
.cond-ic {
    flex: 0 0 auto;
    gap: 4px;
    font-size: 11px;
    color: var(--muted);
}
.cond-ic input { margin: 0; }
.cond-del { flex: 0 0 auto; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.18s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* footer 呼入呼出过渡动画 */
.footer-slide-enter-active, .footer-slide-leave-active {
    transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.28s ease;
}
.footer-slide-enter-from, .footer-slide-leave-to {
    transform: translateY(100%);
    opacity: 0;
}

/* 非总览页 ft-summary: 新增 spacer + 设置按钮 icon-only */
.ft-spacer { flex: 1 1 auto; }
.ft-summary-item.icon-only {
    width: 38px; justify-content: center; padding: 0; cursor: pointer;
}
.ft-summary-item.icon-only:hover {
    background: color-mix(in oklab, var(--accent) 10%, transparent);
    border-color: color-mix(in oklab, var(--accent) 30%, transparent);
    color: var(--accent);
}

/* about-card 版权行 */
.about-copyright {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px dashed var(--divider-border);
    text-align: center;
}

/* =================== 响应式 =================== */
@media (max-width: 860px) {
    .app-shell { grid-template-rows: 60px 1fr 92px; }
    .app-body { grid-template-columns: 64px 1fr; }
    .app-sidebar .nav-group-title, .app-sidebar .nav-item span { display: none; }
    .app-sidebar .nav-item { justify-content: center; }
    .overview-grid { grid-template-columns: 1fr; }
    .settings-grid { grid-template-columns: 1fr; }
    .card-setting.wide { grid-column: span 1; }
    .form-grid { grid-template-columns: 1fr 1fr; }
    .form-item, .form-item.col-2, .form-item.col-4, .form-item.col-6 { grid-column: span 2; }
}

/* ===================== Pixel Toggle Switch ===================== */
.pixel-toggle-label {
    display: inline-block;
    cursor: pointer;
    user-select: none;
    vertical-align: middle;
}

.pixel-checkbox { display: none; }

.pixel-toggle-track {
    width: 3.2em;
    height: 1.7em;
    border-radius: 1em;
    background: #0e0f12;
    border: 2px solid #16171d;
    box-shadow:
        inset 0 2px 4px rgba(0, 0, 0, 0.65),
        0 5px 12px rgba(0, 0, 0, 0.35);
    position: relative;
    transition: background 0.4s ease, border-color 0.4s ease;
}

.indicator-wrapper {
    position: absolute;
    top: 50%;
    width: 0.6em;
    height: 0.6em;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.indicator-on-wrap {
    left: 0.45em;
    color: #00ffaa;
    opacity: 0.12;
    transform: translateY(-50%) scale(0.8);
}

.indicator-off-wrap {
    right: 0.45em;
    color: #ff007f;
    opacity: 0.7;
    transform: translateY(-50%) scale(1.1);
    filter: drop-shadow(0 0 3px rgba(255, 0, 127, 0.4));
}

.pixel-coin-thumb {
    width: 1.45em;
    height: 1.45em;
    border-radius: 50%;
    background: #ff007f;
    border: 2px solid #16171d;
    position: absolute;
    top: 0.08em;
    left: 0.08em;
    box-shadow:
        inset 0 2px 0 rgba(255, 255, 255, 0.28),
        inset 0 -2px 0 rgba(0, 0, 0, 0.28),
        0 2px 4px rgba(0, 0, 0, 0.45),
        0 0 10px rgba(255, 0, 127, 0.35);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    transform: translate3d(0, 0, 0) rotate(0deg);
    transition:
        transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
        background 0.4s ease,
        box-shadow 0.4s ease;
}

.pixel-coin-thumb::after {
    content: '';
    position: absolute;
    top: 0;
    left: -130%;
    width: 60%;
    height: 100%;
    background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.32) 50%,
        rgba(255, 255, 255, 0) 100%
    );
    transform: skewX(-25deg);
    transition: left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.face-svg {
    position: absolute;
    width: 0.85em;
    height: 0.85em;
    color: #16171d;
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    pointer-events: none;
    z-index: 2;
}

.face-sad { opacity: 1; transform: rotate(0deg) scale(1); }
.face-happy { opacity: 0; transform: rotate(180deg) scale(0.7); }

.pixel-checkbox:checked ~ .pixel-toggle-track {
    background: #0b120f;
    border-color: #131715;
}

.pixel-checkbox:checked ~ .pixel-toggle-track .indicator-on-wrap {
    opacity: 0.85;
    transform: translateY(-50%) scale(1.15) rotate(5deg);
    filter: drop-shadow(0 0 4px rgba(0, 255, 170, 0.5));
}

.pixel-checkbox:checked ~ .pixel-toggle-track .indicator-off-wrap {
    opacity: 0.1;
    transform: translateY(-50%) scale(0.8) rotate(-5deg);
    filter: none;
}

.pixel-checkbox:checked ~ .pixel-toggle-track .pixel-coin-thumb {
    transform: translate3d(1.55em, 0, 0) rotate(360deg);
    background: #00ffaa;
    box-shadow:
        inset 0 2px 0 rgba(255, 255, 255, 0.32),
        inset 0 -2px 0 rgba(0, 0, 0, 0.22),
        0 2px 4px rgba(0, 0, 0, 0.45),
        0 0 12px rgba(0, 255, 170, 0.5);
}

.pixel-checkbox:checked ~ .pixel-toggle-track .pixel-coin-thumb::after {
    left: 130%;
}

.pixel-checkbox:checked ~ .pixel-toggle-track .face-sad {
    opacity: 0;
    transform: rotate(-180deg) scale(0.7);
}

.pixel-checkbox:checked ~ .pixel-toggle-track .face-happy {
    opacity: 1;
    transform: rotate(0deg) scale(1);
}

.pixel-toggle-label:hover .pixel-coin-thumb {
    transform: translate3d(0, 0, 0) rotate(0deg) scale(1.06);
}

.pixel-checkbox:checked ~ .pixel-toggle-track:hover .pixel-coin-thumb {
    transform: translate3d(1.55em, 0, 0) rotate(360deg) scale(1.06);
}

.pixel-toggle-label:active .pixel-coin-thumb {
    transform: translate3d(0, 0, 0) rotate(0deg) scale(0.92);
}

.pixel-checkbox:checked ~ .pixel-toggle-track:active .pixel-coin-thumb {
    transform: translate3d(1.55em, 0, 0) rotate(360deg) scale(0.92);
}
</style>
