# DESIGN SYSTEM SPECIFICATION — Premium Ultra-Dark High-Contrast

> **Version:** 2.1.0  
> **Status:** Active & Unified  
> **Theme Direction:** Single Definitive Theme — **Ultra-Deep Obsidian High-Contrast**

---

## 1. Core Philosophy & Design Identity

The dashboard is built upon a single, cohesive, high-contrast design language: **Ultra-Deep Obsidian High-Contrast**. Unnecessary color noise, low-contrast washed-out grays, and multi-color clutter have been eliminated in favor of an ultra-dark background with crisp contrast and a strictly disciplined palette.

### Foundational Principles
- **Ultra-Deep Obsidian Canvas:** Pure deep carbon and obsidian base surfaces (`#020306`, `#06080D`, `#0A0D14`) that maximize visual depth and battery/OLED efficiency.
- **Maximized Contrast Readability:** High-contrast text hierarchy (`#FFFFFF` primary, `#F1F5F9` secondary) providing razor-sharp legibility without eye fatigue.
- **Restrained Semantic Accents:** Controlled color usage limited strictly to functional states (Electric Cyan for primary actions/active relays, Emerald for healthy sync, Rose for alerts/disconnects).
- **Refined Glass & Specular Edge:** High-opacity dark glass surfaces with backdrop blur (`backdrop-blur-md`), paired with subtle specular highlights (`border-white/8` to `border-white/18`).
- **Precision IoT Telemetry:** Technical data (MAC, IP, MQTT metrics, GPIO pins) formatted with monospaced typography and distinct state indicators.
- **Purposeful Micro-Interactions:** Smooth spring physics and tactile micro-animations using `motion/react`, complemented by low-latency audio feedback.

---

## 2. Color Palette & Semantic Design Tokens

### 2.1 Surface & Elevation Hierarchy (Ultra-Deep Dark Spectrum)

| Token Name | Hex / RGBA Value | Usage / Layer |
| :--- | :--- | :--- |
| `canvas-base` | `#020306` | Root workspace background, ultra-deep obsidian base |
| `surface-panel` | `#06080D` | Master header, drawers, and secondary containers |
| `surface-card` | `#0A0D14` | Active widget cards, module blocks, modals |
| `surface-glass` | `rgba(10, 13, 20, 0.92)` | High-opacity translucent overlays and dockable headers |
| `surface-elevated`| `#121620` | Hover states, active dropdown items, tooltips |
| `border-subtle` | `rgba(255, 255, 255, 0.08)` | Standard card borders and dividers |
| `border-highlight`| `rgba(255, 255, 255, 0.18)` | Card hover outline, active control borders |

### 2.2 Typography & Maximum Contrast Tokens

| Token Name | Hex Value | Contrast Ratio | Usage |
| :--- | :--- | :--- | :--- |
| `text-primary` | `#FFFFFF` (Pure White) | 19.5:1 (Ultra) | Main headings, primary values, active toggles |
| `text-secondary` | `#F1F5F9` (Slate 100) | 16.8:1 (High) | Body copy, labels, primary metadata |
| `text-tertiary` | `#94A3B8` (Slate 400) | 8.2:1 (Clear) | Secondary hints, descriptive subtext |
| `text-muted` | `#64748B` (Slate 500) | 4.8:1 (WCAG AA) | Timestamp stamps, inactive labels |
| `text-disabled` | `#334155` (Slate 700) | — | Disabled controls and placeholder text |

### 2.3 Disciplined Semantic Accents (Restrained Palette)

| Token Name | Hex / Pulse Value | Purpose |
| :--- | :--- | :--- |
| `accent-cyan` | `#00F0FF` / `#38E1FF` | Primary active state, Relay ON, Primary actions, Focus ring |
| `accent-emerald` | `#10B981` / `#34D399` | Connected status, WebSocket sync, Optimal telemetry |
| `accent-rose` | `#EF4444` / `#F87171` | Disconnect, Relay trip, Critical errors, Danger zone |
| `accent-carbon` | `#020306` | Deep neutral base |

---

## 3. Lighting, Glassmorphism & Elevation

### 3.1 Depth Layering
- **Background Lighting:** Deep radial ambient gradient at the top viewport:
  ```css
  background: radial-gradient(circle at 50% 0%, rgba(0, 240, 255, 0.04), transparent 75%), #020306;
  ```
- **Top-Edge Specular Light:** All cards feature a subtle top border highlighting:
  ```css
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.08);
  ```
- **Deep Diffusion Shadows:**
  ```css
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.85), 0 0 1px 1px rgba(255, 255, 255, 0.06);
  ```

### 3.2 Border Radius System
- **Outer Containers / Drawers:** `rounded-2xl` (16px)
- **Cards & Widgets:** `rounded-xl` (12px)
- **Nested Controls & Inner Buttons:** `rounded-lg` (8px)
- **Mathematical Nesting Rule:** $R_{inner} = R_{outer} - \text{Padding}$
- **Action Pills & Badges:** `rounded-full` (9999px)

---

## 4. Typography System

### 4.1 Font Family Stacks
- **UI & Display:** `Vazirmatn`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `sans-serif`
- **Telemetry & Technical Values:** `JetBrains Mono`, `ui-monospace`, `SFMono-Regular`, `Menlo`, `monospace`

### 4.2 Scale & Hierarchy
- **Title (Header / Main):** `text-xl font-bold tracking-tight text-white`
- **Section Heading:** `text-sm font-semibold uppercase tracking-wider text-slate-300`
- **Card Title:** `text-base font-semibold text-slate-100`
- **Telemetry / Metric Value:** `font-mono text-lg font-bold text-cyan-400`
- **Body & Controls:** `text-sm font-medium text-slate-100`
- **Sub-label & Metadata:** `text-xs font-normal text-slate-400`

---

## 5. Component Specifications

### 5.1 Master Header (Cinematic Island)
- **Modes:** Dockable as a Vertical Island (Desktop Sidebar) or Horizontal Island (Top/Mobile).
- **Background:** `bg-[#06080D]/90 backdrop-blur-xl border border-white/10`
- **Elements:** Real-time clock widget, system state indicators, layout column switcher, quick access voice trigger.

### 5.2 Sortable Module & Segment Cards
- **Structure:**
  - Header: Drag grip handle, icon container with subtle glow, title, pin/action menu.
  - Body: Interactive switch toggles, sliders, or real-time metric counters.
  - Footer: State tag, pin indicator, latency / telemetry indicator.
- **Active State:** Cyan accent ring (`ring-1 ring-cyan-500/50`), glowing switch indicator (`shadow-[0_0_12px_rgba(0,240,255,0.35)]`).
- **Inactive State:** Deep matte surface (`bg-[#0A0D14]`), subtle borders (`border-white/8`), high-contrast labels.

### 5.3 Drawers & Workspaces (Modules, Settings, Automations)
- **Backdrop:** `bg-black/75 backdrop-blur-sm`
- **Drawer Body:** `bg-[#06080D] border-l border-white/10`
- **Tab Sliders:** Smooth sliding pill indicator with `motion/react` layout transitions.

---

## 6. Motion, Transitions & Audio UX

### 6.1 Motion Tokens (`motion/react`)
- **Card Enter / Layout Transitions:** `type: "spring", stiffness: 350, damping: 28`
- **Hover Micro-Feedback:** `whileHover={{ y: -2, scale: 1.01 }}`
- **Tap Compression:** `whileTap={{ scale: 0.98 }}`
- **Drawer Slide:** `transition={{ type: "spring", stiffness: 300, damping: 30 }}`

### 6.2 Sensory Audio UX
- **Action Clicks:** Short, frequency-shaped synthesized audio clicks via Web Audio API.
- **Toggle ON:** Rising frequency chime for positive confirmation.
- **Toggle OFF:** Descending tone for clear audible state change.

