# winBangs

<div align="center">

<h1>winBangs</h1>
<p>Dynamic Island for Windows — a floating capsule UI that aggregates system status, media control, notifications, and quick tools.</p>

[![Tauri](https://img.shields.io/badge/Tauri-2.x-blue?logo=tauri)](https://tauri.app)
[![Rust](https://img.shields.io/badge/Rust-1.70+-orange?logo=rust)](https://rust-lang.org)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-green?logo=vue.js)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.x-yellow?logo=vite)](https://vite.dev)
[![MIT License](https://img.shields.io/badge/license-MIT-brightgreen)](LICENSE)

[简体中文](./README.md) · [English](./README.en.md) · [Releases](https://github.com/9thChasingWindGirl/winBangs/releases)

</div>

---

**winBangs** is a Windows desktop utility that brings the iPhone Dynamic Island experience to your PC. It sits at the top-center of the screen as a compact capsule, expanding on demand to show music playback, network speed, notifications, system events, and more — all driven by spring-physics animations.

This project is a community fork tailored for personal customization.

---

## Features

### 🎵 Media Playback Control
- Control playback (play/pause, previous, next) through the Windows SMTC API.
- Display song title, artist, and cover art in real time.
- Support for NetEase Cloud Music, Spotify, Apple Music, QQ Music, Kugou Music, and more.
- LRC lyric parsing with synchronized scrolling and smooth fade transitions.

### 📶 Network Monitor
- Real-time upload/download speed display with auto-unit switching.
- Traffic statistics with daily / monthly aggregation.
- Mini trend chart (line / bar) built into the console panel.
- Network health indicator: good · warning · error.

### 🔔 Notification Aggregation
- Intercept Windows Toast notifications and show them inside the island.
- Message queue with priority handling and auto-dismiss.
- Silent mode — only appears when there's active content.

### 🎨 Personalization Center
- **Spring physics**: choose between Stiff (fast) and Bouncy styles.
- **Themes**: dark, light, and immersive cover-glass modes.
- **Dimensions**: adjustable base width/height, music width, message width, global scale.
- **Opacity**: independent control of the island's background transparency.
- **Edge shape**: classic capsule or rounded rectangle.
- **Taskbar plugin**: optional companion widget pinned to the taskbar.

### 🧩 Scene Awareness (v0.1+)
- Lightweight feature detection: foreground window, process name, display mode.
- Rule-based scene classification: game, video, music, office, browsing, idle.
- Scene-driven behavior: auto-hide during fullscreen, opacity adjustment, content switching.
- Manual override to lock a specific scene.

### ⏱️ Pomodoro Timer
- Built-in pomodoro and countdown timer.
- Session tracking with daily goal progress bar.
- Visual and (planned) audible completion notification.

### 🌤️ Weather Card
- Current weather display via the free wttr.in API.
- Auto-refresh every 30 minutes with local cache fallback.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Desktop Framework | Tauri 2 (Rust) |
| Frontend | Vue 3 + TypeScript |
| Build Tool | Vite 6 |
| Router | Vue Router 5 |
| Charts | ECharts 6 |
| Icons | Lucide Vue Next |
| Networking | sysinfo (Rust), reqwest |
| Media Control | Windows SMTC API |
| Audio Processing | cpal + rustfft |
| System Events | Windows COM / WinAPI |

---

## Project Structure

```text
winBangs/
├── src/                          # Frontend source
│   ├── main.ts                   # Application entry
│   ├── router/index.ts           # Route configuration
│   ├── i18n.ts                   # Chinese / English i18n
│   ├── services/
│   │   └── scene-context.ts      # Scene awareness system (§6)
│   ├── views/
│   │   ├── MainPanel.vue         # Console panel
│   │   └── WidgetIsland.vue      # Dynamic Island widget
│   ├── components/
│   │   ├── DynamicSet.vue        # Personalization center
│   │   ├── PomodoroTimer.vue     # Pomodoro / countdown
│   │   └── WeatherCard.vue       # Weather display
│   └── assets/                   # Static assets
├── src-tauri/                    # Tauri Rust backend
│   ├── src/
│   │   ├── lib.rs                # Core logic, windows, animation
│   │   ├── music_controller.rs   # SMTC / cover / lyrics
│   │   ├── notification.rs       # Toast notification capture
│   │   ├── system_events.rs      # Volume, power, lock events
│   │   └── audio_spectrum.rs     # Audio spectrum analysis
│   ├── Cargo.toml                # Rust dependencies
│   └── tauri.conf.json           # Tauri configuration
├── package.json                  # Frontend dependencies
├── README.md                     # Chinese documentation
└── README.en.md                  # English documentation
```

---

## Getting Started

### Prerequisites

- Windows 10 / 11
- Node.js 18+
- Rust 1.70+
- Tauri 2 CLI (`cargo install tauri-cli --version "^2"`)

### Install & Run

```bash
git clone https://github.com/9thChasingWindGirl/winBangs.git
cd winBangs
npm install
npm run tauri dev
```

### Build for Distribution

```bash
npm run tauri build
```

The installer will be output to `src-tauri/target/release/bundle/`.

---

## Usage

1. Launch the app — the main console opens.
2. Toggle the **Widget switch** to show the floating Dynamic Island at the top of the screen.
3. **Drag** the island with the left mouse button; **right-click** for the context menu (lock position, reset, close, toggle glow border).
4. Configure music platform, notifications, theme, opacity, and startup behavior from the console.
5. Open the **Personalization Center** to adjust physics, appearance, size, and scaling.

---

## Roadmap

| Version | Focus |
|---------|-------|
| v0.1-alpha | Core island engine, spring physics, transparent overlay, console panel |
| v0.2-alpha | Media control, notification takeover, system tray, auto-update |
| v0.3-beta  | Quick tool cards, Pomodoro, weather, scene awareness, config system |
| v1.0-rc    | Plugin system, multi-monitor, performance tuning, CI stability |

---

## License

[MIT](./LICENSE)

Copyright (c) 2026 winBangs contributors

---

> Built for the love of desktop customization.
