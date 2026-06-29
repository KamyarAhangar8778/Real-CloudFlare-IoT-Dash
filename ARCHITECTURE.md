# ARCHITECTURE.md — Project Architecture & Directory Structure

This document describes the design patterns, architecture, and module structure of the Achaemenid IoT Dashboard.

## Architecture Overview

The project follows a **Feature-Based Modular Architecture** built on top of **Next.js 15 (App Router)**. Because the project uses `output: "export"` for a static build, it acts purely as a Client-Side Application (SPA) leveraging modern React capabilities. Instead of organizing files strictly by their technical role (e.g., placing all hooks in a single folder, all components in another), codebase items are grouped by their business feature inside the `features/` directory.

### Core Architectural Decisions

1. **Feature Encapsulation**: Components, custom hooks, and specific services belonging to a domain (such as IoT controls, Settings, or Dashboard layouts) reside inside their respective feature folders.
2. **Global Shareables**: Only generic layouts or cross-feature configurations are placed in the root `components/` and `lib/` directories.
3. **Data Synchronisation**: Integrated with MQTT for real-time telemetry from ESP32 microcontrollers, managed through centralized service modules.
4. **Tailwind CSS v4 Integration**: Styling is modern and declaration-based, utilizing CSS custom properties for traditional Persian symbolic aesthetics.
5. **Static Export**: The app uses Next.js Static Export (`output: "export"`), meaning there are no Server API routes (`app/api/*`). External API calls (like fetching internet archive audio) are performed directly from the client.

---

## Directory Structure

```
Real-CloudFlare-IoT-Dash/
├── app/                  # Next.js App Router (Layout, Page, Global CSS)
├── components/           # Generic / global shared React components
│   ├── MasterHeader/     # Main page layout headers (horizontal & vertical)
│   ├── AudioInitializer.tsx
│   ├── MasterHeader.tsx  # Dynamic header position dispatcher
│   └── QueryProvider.tsx # TanStack Query provider configuration
├── features/             # Feature-specific modules
│   ├── dashboard/        # Dashboard layout, container, and workspace components
│   ├── iot/              # Real-time IoT workspace, MQTT hooks, and ESP32 services
│   │   ├── components/   # IoT-specific UI (CuneiformBackground, WelcomePortal, etc.)
│   │   ├── hooks/        # Custom react hooks for IoT devices and MQTT
│   │   └── services/     # Services for esp32 configurations & mqttService.ts
│   └── settings/         # Settings page components and logic
│       ├── components/   # Sections for colors, typography, stability, and audio
├── lib/                  # Shared utility libraries and presets
│   ├── audio.ts          # Centralized audio manager (ambient music, API integration, UI sounds)
│   └── presets.ts        # Constants and theme configurations
├── public/               # Static assets (images, icons, fonts, local audio tracks)
├── biome.json            # Biome linter, formatter, and organizer configuration
├── metadata.json         # Next.js/AI Studio applet configuration metadata
├── next.config.ts        # Next.js configuration (static export enabled)
└── tsconfig.json         # TypeScript configuration
```

---

## Key Modules & Roles

### 1. The Header System (`components/MasterHeader`)
Renders the navigation layouts. Supports switching dynamically between vertical and horizontal alignment positions, responsive columns switcher, theme toggling, and fast access controls.

### 2. IoT Module (`features/iot`)
This is the core of the dashboard:
- **`mqttService.ts`**: Handles client initialization and message broker transactions with the ESP32 units.
- **`CuneiformBackground.tsx`**: Renders a dynamic traditional Persian/Achaemenid background theme.
- **`LowDataModeBanner.tsx` & `SyncOverlay.tsx`**: Handle connection latency, bandwidth optimizations, and synchronization statuses.
- **`IoTWorkspace.tsx`**: Manages the drag-and-drop sortable interface for adding different IoT control segments.

### 3. Settings Module (`features/settings`)
Contains configuration controls for the user interface and experience:
- **Audio Section**: Manages ambient background music, allowing toggling between local tracks and online traditional/instrumental music via the Internet Archive API.
- **Colors, Typography, Cuneiform, Header, Stability**: Configures everything from custom CSS variables and UI fonts to animation toggles for low-end devices.

### 4. Audio Management (`lib/audio.ts`)
A dedicated `SoundManager` singleton controls:
- **Ambient Background Music**: Automatically playing/pausing music based on user preference, with support for falling back to local files or fetching a random playlist from the Internet Archive API.
- **UI Feedback**: Providing soft clicks and interaction sounds (`playClick`, `playToggleOn`, etc.) using the Web Audio API.

