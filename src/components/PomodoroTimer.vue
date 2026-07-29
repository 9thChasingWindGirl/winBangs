<template>
    <div class="pomodoro-card card">
        <div class="card-header-row">
            <h3>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="title-icon">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                </svg>
                {{ t('pomodoroTitle') }}
            </h3>
            <div class="mode-switch">
                <button class="mode-btn" :class="{ active: mode === 'pomodoro' }" @click="mode = 'pomodoro'">
                    {{ t('pomodoroMode') }}
                </button>
                <button class="mode-btn" :class="{ active: mode === 'countdown' }" @click="switchCountdown">
                    {{ t('countdownMode') }}
                </button>
            </div>
        </div>

        <div class="timer-display" :class="{ 'is-warning': remaining <= 60 && running }">
            <span class="timer-value">{{ formattedTime }}</span>
        </div>

        <div class="pomodoro-controls">
            <button class="pomo-btn primary" @click="toggleTimer">
                <svg v-if="!running" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
                {{ running ? t('pause') : t('start') }}
            </button>
            <button class="pomo-btn secondary" @click="resetTimer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                </svg>
            </button>
            <button v-if="mode === 'pomodoro'" class="pomo-btn skip-btn" :disabled="!running || sessions === 0"
                @click="skipSession">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 4h4v16H5zM15 4h4v16h-4z" />
                    <path d="M19 12l-10 7V5z" />
                </svg>
            </button>
        </div>

        <div v-if="mode === 'pomodoro'" class="session-info">
            <span class="session-label">{{ t('completedSessions') }}</span>
            <span class="session-count">{{ sessions }} / {{ dailyGoal }}</span>
            <div class="session-progress">
                <div class="progress-bar" :style="{ width: (sessions / dailyGoal * 100) + '%' }"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import { emit } from '@tauri-apps/api/event';
import { t } from '../i18n';

const POMODERO_DURATION = 25 * 60; // 25 分钟（秒）
const SHORT_BREAK = 5 * 60;        // 5 分钟
const DAILY_GOAL = 8;

const mode = ref<'pomodoro' | 'countdown'>('pomodoro');
const remaining = ref(POMODERO_DURATION);
const running = ref(false);
const sessions = ref(Number(localStorage.getItem('wbs_pomo_sessions') || '0'));
const dailyGoal = ref(DAILY_GOAL);

// 自定义倒计时时长（秒）
const customDuration = ref(Number(localStorage.getItem('wbs_custom_countdown') || '300'));

let timerInterval: number | null = null;

const formattedTime = computed(() => {
    const m = Math.floor(remaining.value / 60);
    const s = remaining.value % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
});

const switchCountdown = () => {
    mode.value = 'countdown';
    stopTimer();
    remaining.value = customDuration.value;
};

const toggleTimer = () => {
    if (running.value) {
        stopTimer();
    } else {
        startTimer();
    }
};

const startTimer = () => {
    if (remaining.value <= 0) {
        if (mode.value === 'pomodoro') {
            remaining.value = sessions.value % 4 === 3 ? SHORT_BREAK : POMODERO_DURATION;
        } else {
            remaining.value = customDuration.value;
        }
    }
    running.value = true;
    timerInterval = window.setInterval(() => {
        remaining.value -= 1;
        if (remaining.value <= 0) {
            stopTimer();
            remaining.value = 0;
            handleCompletion();
        }
    }, 1000);
};

const stopTimer = () => {
    running.value = false;
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
};

const resetTimer = () => {
    stopTimer();
    if (mode.value === 'pomodoro') {
        remaining.value = POMODERO_DURATION;
    } else {
        remaining.value = customDuration.value;
    }
};

const skipSession = () => {
    if (!running.value) return;
    stopTimer();
    remaining.value = 0;
    handleCompletion();
};

const handleCompletion = () => {
    if (mode.value === 'pomodoro') {
        sessions.value += 1;
        localStorage.setItem('wbs_pomo_sessions', String(sessions.value));

        // 自动切换到休息/下一个番茄
        if (sessions.value % 4 === 0) {
            remaining.value = SHORT_BREAK;
        } else {
            remaining.value = POMODERO_DURATION;
        }

        // 发送通知
        if (typeof window !== 'undefined') {
            try {
                emit('pomodoro-complete', { sessions: sessions.value });
            } catch { /* ignore */ }
        }
    } else {
        remaining.value = customDuration.value;
    }
};

// 持久化自定义倒计时
watch(customDuration, (val) => {
    localStorage.setItem('wbs_custom_countdown', String(val));
});

// 持久化 session 计数器
watch(sessions, (val) => {
    localStorage.setItem('wbs_pomo_sessions', String(val));
});

onUnmounted(() => {
    stopTimer();
});
</script>

<style scoped>
.pomodoro-card {
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.card-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-header-row h3 {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    margin: 0;
    color: var(--card-h3-color);
}

.title-icon {
    width: 16px;
    height: 16px;
    opacity: 0.7;
}

.mode-switch {
    display: flex;
    gap: 2px;
    background: var(--control-bg);
    padding: 2px;
    border-radius: 8px;
    border: 1px solid var(--control-border);
}

.mode-btn {
    padding: 3px 10px;
    font-size: 11px;
    font-weight: 600;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: var(--btn-sec-color);
    cursor: pointer;
    transition: all 0.2s;
}

.mode-btn.active {
    background: var(--btn-pri-bg);
    color: var(--btn-pri-color);
}

.timer-display {
    text-align: center;
    padding: 8px 0;
}

.timer-value {
    font-size: 42px;
    font-weight: 800;
    font-family: 'Geist Mono', 'JetBrains Mono', monospace;
    color: var(--speed-value);
    letter-spacing: 4px;
    font-variant-numeric: tabular-nums;
    transition: color 0.3s ease;
}

.timer-display.is-warning .timer-value {
    color: #ff3b30;
}

.pomodoro-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
}

.pomo-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    font-size: 13px;
    font-weight: 600;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.pomo-btn svg {
    width: 16px;
    height: 16px;
}

.pomo-btn.primary {
    background: var(--btn-pri-bg);
    color: var(--btn-pri-color);
    padding: 8px 28px;
}

.pomo-btn.primary:hover {
    background: var(--btn-pri-hover-bg);
    box-shadow: 0 4px 12px var(--btn-pri-shadow-hover);
}

.pomo-btn.secondary {
    background: transparent;
    color: var(--text-body);
    padding: 8px;
    border: 1px solid var(--control-border);
}

.pomo-btn.secondary:hover {
    background: var(--btn-sec-bg);
}

.pomo-btn.skip-btn {
    background: transparent;
    color: var(--text-body);
    opacity: 0.5;
    padding: 8px;
}

.pomo-btn.skip-btn:hover:not(:disabled) {
    opacity: 1;
}

.pomo-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.session-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--item-desc-color);
}

.session-label {
    flex-shrink: 0;
}

.session-count {
    font-weight: 700;
    color: var(--item-title-color);
    flex-shrink: 0;
}

.session-progress {
    flex: 1;
    height: 4px;
    background: var(--slider-bg);
    border-radius: 2px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background: oklch(0.55 0.2 250);
    border-radius: 2px;
    transition: width 0.5s ease;
}
</style>
