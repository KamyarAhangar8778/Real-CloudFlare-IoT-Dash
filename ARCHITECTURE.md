# ARCHITECTURE.md — Project Architecture & Directory Structure

This document describes the design patterns, architecture, and module structure of the Achaemenid IoT Dashboard.

## Architecture Overview

The project follows a **Feature-Based Modular Architecture** built on top of **Next.js 15 (App Router)**. Instead of organizing files strictly by their technical role (e.g., placing all hooks in a single folder, all components in another), codebase items are grouped by their business feature inside the `features/` directory.

### Core Architectural Decisions

1. **Feature Encapsulation**: Components, custom hooks, and specific services belonging to a domain (such as IoT controls or Settings) reside inside their respective feature folders.
2. **Global Shareables**: Only generic layouts or cross-feature configurations are placed in the root `components/` and `lib/` directories.
3. **Data Synchronisation**: Integrated with MQTT for real-time telemetry from ESP32 microcontrollers, managed through centralized service modules.
4. **Tailwind CSS v4 Integration**: Styling is modern and declaration-based, utilizing CSS custom properties for traditional Persian symbolic aesthetics.

---

## Directory Structure

```
Real-CloudFlare-IoT-Dash/
├── app/                  # Next.js App Router (Layout, Page, Global CSS)
├── components/           # Generic / global shared React components
│   ├── MasterHeader/     # Main page layout headers (horizontal & vertical)
│   ├── MasterHeader.tsx  # Dynamic header position dispatcher
│   └── QueryProvider.tsx # TanStack Query provider configuration
├── features/             # Feature-specific modules
│   ├── dashboard/        # Dashboard layout, container, and workspace components
│   ├── iot/              # Real-time IoT workspace, MQTT hooks, and ESP32 services
│   │   ├── components/   # IoT-specific UI (CuneiformBackground, WelcomePortal, etc.)
│   │   ├── hooks/        # Custom react hooks for IoT devices and MQTT
│   │   └── services/     # Services for esp32 configurations & mqttService.ts
│   └── settings/         # Settings page components and logic
├── lib/                  # Shared utility libraries and presets
├── public/               # Static assets (images, icons, fonts)
├── biome.json            # Biome linter, formatter, and organizer configuration
├── metadata.json         # Next.js/AI Studio applet configuration metadata
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
