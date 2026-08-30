# DESIGN SYSTEM SPECIFICATION — Premium Dark Modern Cinematic

> **Version:** 2.0.0  
> **Status:** Active & Unified  
> **Theme Direction:** Single Definitive Theme — **Premium Dark Modern Cinematic**

---

## 1. Core Philosophy & Design Identity

The dashboard is built upon a single, cohesive design language: **Premium Dark Modern Cinematic**. All legacy multi-theme presets, light modes, and disjointed color schemes have been completely deprecated in favor of this unified aesthetic.

### Foundational Principles
- **Cinematic Atmosphere:** Deep obsidian and carbon backgrounds with subtle specular highlights, optical depth layers, and focused lighting.
- **High-Contrast Readability:** Strict adherence to WCAG AA contrast standards; crisp slate typography over dark surfaces without eye fatigue.
- **Refined Glass & Specular Edge:** Subtle translucent card surfaces with soft backdrop blurs (`backdrop-blur-md`), paired with delicate top-edge specular highlights (`border-t border-white/10`).
- **Precision IoT Telemetry:** Technical data (MAC, IP, MQTT metrics, GPIO pins) formatted with monospaced typography and distinct state indicators.
- **Purposeful Micro-Interactions:** Smooth spring physics and tactile micro-animations using `motion/react`, complemented by low-latency audio feedback.

---

## 2. Color Palette & Semantic Design Tokens

### 2.1 Surface & Elevation Hierarchy (Dark Spectrum)

| Token Name | Hex / RGBA Value | Usage / Layer |
| :--- | :--- | :--- |
| `canvas-base` | `#08090C` | Root workspace background, cinematic dark base |
| `surface-panel` | `#0F1218` | Master header, drawers, and secondary containers |
| `surface-card` | `#161B24` | Active widget cards, module blocks, modals |
| `surface-glass` | `rgba(22, 27, 36, 0.75)` | Translucent overlays, dockable headers with `backdrop-blur` |
| `surface-elevated`| `#1E2532` | Hover states, active dropdown items, tooltips |
| `border-subtle` | `rgba(255, 255, 255, 0.08)` | Standard card borders and dividers |
| `border-highlight`| `rgba(255, 255, 255, 0.16)` | Card hover outline, active control borders |

### 2.2 Typography & Contrast Tokens

| Token Name | Hex Value | Usage |
| :--- | :--- | :--- |
| `text-primary` | `#F8FAFC` (Slate 50) | Main headings, primary values, active toggles |
| `text-secondary` | `#CBD5E1` (Slate 300) | Body copy, labels, primary metadata |
| `text-muted` | `#64748B` (Slate 500) | Secondary hints, timestamp stamps, inactive labels |
| `text-disabled` | `#334155` (Slate 700) | Disabled controls and placeholder text |

### 2.3 Functional Cinematic Accents

| Token Name | Hex / Pulse Value | Purpose |
| :--- | :--- | :--- |
| `accent-cyan` | `#06B6D4` / `#22D3EE` | Active state, Relay ON, Primary actions, Neon glow |
| `accent-emerald` | `#10B981` / `#34D399` | Connected status, WebSocket sync, Optimal telemetry |
| `accent-amber` | `#F59E0B` / `#FBBF24` | Warning thresholds, Sensor alerts, Offline fallback |
| `accent-rose` | `#EF4444` / `#F87171` | Disconnect, Relay trip, Critical errors, Danger zone |
| `accent-indigo` | `#6366F1` / `#818CF8` | Focus ring, selected tab indicator, Automation trigger |

---

## 3. Lighting, Glassmorphism & Elevation

### 3.1 Depth Layering
- **Background Lighting:** Radial ambient gradient at the top viewport:
  ```css
  background: radial-gradient(circle at 50% 0%, rgba(6, 182, 212, 0.06), transparent 75%), #08090C;
  ```
- **Top-Edge Specular Light:** All cards feature a subtle top border highlighting:
  ```css
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
  ```
- **Deep Diffusion Shadows:**
  ```css
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.05);
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
- **Telemetry & Technical Values:** `ui-monospace`, `SFMono-Regular`, `Menlo`, `Monaco`, `Consolas`, `monospace`

### 4.2 Scale & Hierarchy
- **Title (Header / Main):** `text-xl font-bold tracking-tight text-slate-50`
- **Section Heading:** `text-sm font-semibold uppercase tracking-wider text-slate-400`
- **Card Title:** `text-base font-semibold text-slate-100`
- **Telemetry / Metric Value:** `font-mono text-lg font-bold text-cyan-400`
- **Body & Controls:** `text-sm font-medium text-slate-300`
- **Sub-label & Metadata:** `text-xs font-normal text-slate-500`

---

## 5. Component Specifications

### 5.1 Master Header (Cinematic Island)
- **Modes:** Dockable as a Vertical Island (Desktop Sidebar) or Horizontal Island (Top/Mobile).
- **Background:** `bg-[#0F1218]/80 backdrop-blur-xl border border-white/10`
- **Elements:** Real-time clock widget, system state indicators, layout column switcher, quick access voice trigger.

### 5.2 Sortable Module & Segment Cards
- **Structure:**
  - Header: Drag grip handle, icon container with subtle glow, title, pin/action menu.
  - Body: Interactive switch toggles, sliders, or real-time metric counters.
  - Footer: State tag, pin indicator, latency / telemetry indicator.
- **Active State:** Cyan accent ring (`ring-1 ring-cyan-500/50`), glowing switch indicator (`shadow-[0_0_12px_rgba(6,182,212,0.4)]`).
- **Inactive State:** Deep matte surface (`bg-[#161B24]`), subtle borders (`border-white/5`), muted labels.

### 5.3 Drawers & Workspaces (Modules, Settings, Automations)
- **Backdrop:** `bg-black/60 backdrop-blur-sm`
- **Drawer Body:** `bg-[#0F1218] border-l border-white/10`
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

