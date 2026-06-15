# CLAUDE.md — Development Guidelines

This file contains build, test, lint, and code style guidelines for the Achaemenid IoT Dashboard project.

## Development Commands

- **Run Dev Server**: `npm run dev` (Runs Next.js with Turbopack)
- **Build Production**: `npm run build`
- **Start Production**: `npm run start`
- **Lint Code**: `npm run lint` (Runs Biome linter)
- **Format Code**: `npm run format` (Runs Biome formatter)
- **Clean Cache**: `npm run clean` (Cleans Next.js cache)

## Project Stack & Standards

- **Core Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4 (using `@theme` and CSS variables, no legacy `tailwind.config.js`)
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query v5
- **Forms/Validation**: React Hook Form, Zod
- **Animations**: Motion (Framer Motion)
- **Linter/Formatter**: Biome (replaces ESLint and Prettier)
- **IoT Integration**: MQTT (`mqtt` library)

## Coding Guidelines

### 1. Naming Conventions
- **Components**: PascalCase (e.g., `BrandBox.tsx`, `MasterHeader.tsx`)
- **Functions & Variables**: camelCase (e.g., `handleToggle`, `headerPosition`)
- **Types/Interfaces**: PascalCase (e.g., `MasterHeaderProps`)
- **Files/Folders**: Use feature-based folders in lower kebab-case/camelCase.

### 2. Code Structure
- Prefer functional components with TypeScript interfaces.
- Separate features into the `features/` directory (modular design).
- Keep shared/global UI components in the `components/` directory.
- Avoid using legacy UI libraries. Rely on Tailwind CSS v4 and modern CSS features.
