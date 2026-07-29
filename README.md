# winBangs

<div align="center">

<h1>winBangs</h1>
<p>专为 Windows 而生的灵动岛 —— 悬浮胶囊浮窗，聚合系统状态、媒体控制、通知提醒与快捷工具。</p>

[![Tauri](https://img.shields.io/badge/Tauri-2.x-blue?logo=tauri)](https://tauri.app)
[![Rust](https://img.shields.io/badge/Rust-1.70+-orange?logo=rust)](https://rust-lang.org)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-green?logo=vue.js)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.x-yellow?logo=vite)](https://vite.dev)
[![MIT License](https://img.shields.io/badge/license-MIT-brightgreen)](LICENSE)

[简体中文](./README.md) · [English](./README.en.md) · [下载](https://github.com/9thChasingWindGirl/winBangs/releases)

</div>

---

winBangs 是一款 Windows 桌面悬浮工具，将 iPhone Dynamic Island 的交互体验移植到 Windows 桌面。它以屏幕顶部中央的胶囊状浮窗为核心载体，通过**弹簧物理动效**实现流畅的展开/折叠交互，聚合网速监控、音乐控制、系统通知、番茄钟、天气等实用功能。

本项目是一个面向个人定制的社区 Fork，欢迎按需自由修改。

---

## 功能特性

### 🎵 媒体播放控制
- 通过 Windows SMTC API 控制播放/暂停、上一首/下一首。
- 实时显示歌曲名、歌手和专辑封面，支持封面旋转动画。
- 兼容网易云音乐、Spotify、Apple Music、QQ 音乐、酷狗音乐等多平台。
- LRC 歌词解析与同步滚动，支持歌词延迟微调。

### 📶 网速监控
- 实时上传/下载速度显示，自动切换单位。
- 流量统计：日累计、月累计数据。
- 控制台内置迷你趋势图（折线图/柱状图）。
- 网络状态指示灯：正常 · 高延迟 · 断网。

### 🔔 通知接管
- 拦截 Windows Toast 通知，在灵动岛内优雅展示。
- 消息队列排队与优先级处理，自动消失。
- 静默模式：仅在包含有效内容时显示。

### 🎨 个性化中心
- **弹簧动效**：可选择快速（Stiff）或 Q 弹（Bouncy）风格。
- **主题模式**：深色、浅色、沉浸封面玻璃三种主题。
- **尺寸调节**：基础宽/高、音乐展开宽度、消息宽度、全局缩放均可独立调整。
- **透明度**：独立控制灵动岛背景不透明度。
- **边缘形态**：经典胶囊或圆角矩形。
- **任务栏组件**：可选的任务栏伴生挂件。

### 🧩 场景感知（v0.1+）
- 轻量特征采集：前台窗口、进程名、显示模式。
- 规则引擎场景分类：游戏、视频、音乐、办公、浏览、空闲。
- 场景驱动行为：全屏自动隐藏、透明度调节、内容自动切换。
- 手工覆盖：用户可手动锁定某一场景。

### ⏱️ 番茄钟 / 定时器
- 番茄钟与倒计时双模式。
- Session 计数与每日目标进度条。
- 完成时视觉（及预告音频）通知。

### 🌤️ 天气卡片
- 基于 wttr.in 免费 API 获取实时天气。
- 每 30 分钟自动刷新，本地缓存兜底。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 桌面框架 | Tauri 2 (Rust) |
| 前端框架 | Vue 3 + TypeScript |
| 构建工具 | Vite 6 |
| 路由 | Vue Router 5 |
| 图表 | ECharts 6 |
| 图标 | Lucide Vue Next |
| 网络请求 | sysinfo (Rust)、reqwest |
| 媒体控制 | Windows SMTC API |
| 音频处理 | cpal + rustfft |
| 系统事件 | Windows COM / WinAPI |

---

## 项目结构

```text
winBangs/
├── src/                          # 前端源码
│   ├── main.ts                   # 应用入口
│   ├── router/index.ts           # 路由配置
│   ├── i18n.ts                   # 中文/英文国际化
│   ├── services/
│   │   └── scene-context.ts      # 场景感知系统
│   ├── views/
│   │   ├── MainPanel.vue         # 主控制台
│   │   └── WidgetIsland.vue      # 灵动岛悬浮窗
│   ├── components/
│   │   ├── DynamicSet.vue        # 个性化中心
│   │   ├── PomodoroTimer.vue     # 番茄钟/定时器
│   │   └── WeatherCard.vue       # 天气卡片
│   └── assets/                   # 静态资源
├── src-tauri/                    # Tauri Rust 后端
│   ├── src/
│   │   ├── lib.rs                # 核心逻辑、窗口与动画
│   │   ├── music_controller.rs   # 媒体控制与封面/歌词
│   │   ├── notification.rs       # 系统通知捕获
│   │   ├── system_events.rs      # 音量、电源、锁屏等事件
│   │   └── audio_spectrum.rs     # 音频频谱分析
│   ├── Cargo.toml                # Rust 依赖
│   └── tauri.conf.json           # Tauri 配置
├── package.json                  # 前端依赖与脚本
├── README.md                     # 中文说明
└── README.en.md                  # English documentation
```

---

## 开发环境

### 依赖要求

- Windows 10 / 11
- Node.js 18+
- Rust 1.70+
- Tauri 2 CLI（`cargo install tauri-cli --version "^2"`）

### 安装与运行

```bash
git clone https://github.com/9thChasingWindGirl/winBangs.git
cd winBangs
npm install
npm run tauri dev
```

### 构建发布

```bash
npm run tauri build
```

构建产物会输出到 `src-tauri/target/release/bundle/`。

---

## 使用方式

1. 启动应用后，主控制台会显示实时网速与设置入口。
2. 打开 **Widget 开关**，屏幕顶部出现灵动岛悬浮窗。
3. **左键拖拽**移动，**右键菜单**进行位置锁定、重置、关闭、开关流光边框等操作。
4. 在控制台中配置音乐平台、消息通知、主题、透明度与自动启动。
5. 进入**个性化中心**，可调整物理动效、外观、尺寸与缩放。

---

## 路线图

| 版本 | 目标 |
|------|------|
| v0.1-alpha | 核心浮窗引擎、弹簧动效、透明窗口、控制台面板 |
| v0.2-alpha | 媒体控制、通知接管、系统托盘、自动更新 |
| v0.3-beta  | 快捷工具卡片、番茄钟、天气、场景感知、配置系统 |
| v1.0-rc    | 插件系统、多显示器、性能优化、CI 稳定 |

---

## 许可证

[MIT](./LICENSE)

Copyright (c) 2026 winBangs contributors

---

> 为桌面定制的乐趣而建。
