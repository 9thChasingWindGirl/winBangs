<template>
    <div class="weather-card card">
        <div class="card-header-row">
            <h3>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="title-icon">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
                {{ t('weatherTitle') }}
            </h3>
            <button v-if="!loading" class="refresh-btn" @click="fetchWeather" :title="t('refresh')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                </svg>
            </button>
        </div>

        <div v-if="loading" class="weather-loading">
            <div class="loading-spinner"></div>
            <span>{{ t('weatherLoading') }}</span>
        </div>

        <div v-else-if="error" class="weather-error">
            <span class="error-msg">{{ error }}</span>
            <button class="retry-btn" @click="fetchWeather">{{ t('retry') }}</button>
        </div>

        <div v-else-if="weather" class="weather-body">
            <div class="weather-main">
                <span class="weather-temp">{{ weather.temp }}°</span>
                <span class="weather-desc">{{ weather.description }}</span>
            </div>
            <div class="weather-meta">
                <div class="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                    <span>{{ weather.humidity }}%</span>
                </div>
                <div class="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;">
                        <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
                    </svg>
                    <span>{{ weather.wind }}km/h</span>
                </div>
                <div class="meta-item">
                    <span class="city-name">{{ weather.city }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { t } from '../i18n';

interface WeatherData {
    temp: number;
    description: string;
    humidity: number;
    wind: number;
    city: string;
}

const weather = ref<WeatherData | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
let fetchTimer: number | null = null;

// 使用免费 wttr.in API（无需 API Key）
const fetchWeather = async () => {
    loading.value = true;
    error.value = null;
    try {
        const resp = await fetch('https://wttr.in/?format=j1', {
            signal: AbortSignal.timeout(5000),
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const json = await resp.json();
        const current = json.current_condition?.[0];
        if (!current) throw new Error('No data');
        weather.value = {
            temp: Math.round(Number(current.temp_C) || 0),
            description: current.weatherDesc?.[0]?.value || '--',
            humidity: Number(current.humidity) || 0,
            wind: Math.round(Number(current.windspeedKmph) || 0),
            city: json.nearest_area?.[0]?.areaName?.[0]?.value || '--',
        };
        // 缓存
        localStorage.setItem('wbs_weather_cache', JSON.stringify({
            data: weather.value,
            ts: Date.now(),
        }));
    } catch (e: any) {
        if (e.name === 'TimeoutError') {
            error.value = t('weatherTimeout');
        } else {
            error.value = t('weatherError');
        }
    } finally {
        loading.value = false;
    }
};

// 尝试从缓存恢复
const loadCache = () => {
    try {
        const cached = localStorage.getItem('wbs_weather_cache');
        if (cached) {
            const { data, ts } = JSON.parse(cached);
            if (Date.now() - ts < 30 * 60 * 1000) { // 30 分钟内有效
                weather.value = data;
            }
        }
    } catch { /* ignore */ }
};

onMounted(() => {
    loadCache();
    fetchWeather();
    // 每 30 分钟自动刷新
    fetchTimer = window.setInterval(fetchWeather, 30 * 60 * 1000);
});

onUnmounted(() => {
    if (fetchTimer) clearInterval(fetchTimer);
});
</script>

<style scoped>
.weather-card {
    padding: 16px 18px;
}

.card-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
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

.refresh-btn {
    background: transparent;
    border: none;
    color: var(--item-desc-color);
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    transition: all 0.2s;
}

.refresh-btn:hover {
    background: var(--btn-sec-bg);
    color: var(--item-title-color);
}

.weather-loading,
.weather-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 20px 0;
    font-size: 13px;
    color: var(--item-desc-color);
}

.loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid var(--control-border);
    border-top-color: var(--accent, oklch(0.55 0.2 250));
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.error-msg {
    font-size: 12px;
}

.retry-btn {
    padding: 4px 14px;
    font-size: 12px;
    font-weight: 600;
    border: 1px solid var(--control-border);
    border-radius: 8px;
    background: transparent;
    color: var(--text-body);
    cursor: pointer;
}

.retry-btn:hover {
    background: var(--btn-sec-bg);
}

.weather-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.weather-main {
    display: flex;
    align-items: baseline;
    gap: 12px;
}

.weather-temp {
    font-size: 36px;
    font-weight: 800;
    color: var(--speed-value);
    font-variant-numeric: tabular-nums;
    line-height: 1;
}

.weather-desc {
    font-size: 14px;
    color: var(--item-desc-color);
    text-transform: capitalize;
}

.weather-meta {
    display: flex;
    gap: 16px;
    font-size: 12px;
    color: var(--item-desc-color);
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
    opacity: 0.8;
}

.meta-item svg {
    opacity: 0.6;
}

.city-name {
    font-weight: 600;
    color: var(--item-title-color);
}
</style>
