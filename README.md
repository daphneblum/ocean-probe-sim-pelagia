# Autonomous Ocean Probe Simulation

A polished multi-page React + TypeScript + Tailwind web app that presents a deep-sea research console for supervising an autonomous ocean probe. The experience is fully client-side and uses deterministic, rule-based simulation logic only.

## Features

- Multi-page interface with route-level views for mission briefing, simulation console, and system overview
- Deterministic ocean-zone simulation with reef, open water, deep sea, and debris field conditions
- Manual vehicle controls plus autonomous operating rules for navigation, scanning, and recovery behavior
- Chronological mission log styled as a live vehicle event stream
- Battery recovery cycle with low-power return guidance, automatic ascent in autonomy, surface recharge, and restricted actions while recharging
- Atmospheric deep-sea interface styling with subtle bathymetric contour motifs and restrained sonar visuals

## Run locally

1. Install dependencies with `npm install`
2. Start the development server with `npm run dev`
3. Build for production with `npm run build`

## Project structure

- `src/app/router.tsx`: Application routing and page registration
- `src/pages/`: Route-level views for the landing page, simulation console, and system overview
- `src/components/`: Reusable UI panels and console-specific display components
- `src/hooks/useSimulation.ts`: React hook that wires the UI to the simulation engine
- `src/simulation/engine.ts`: Deterministic simulation rules, state transitions, recovery logic, and mission log event generation
- `src/constants/`: Initial state plus centralized zone and environment definitions
- `src/types/simulation.ts`: Typed data models for zones, probe state, recovery state, actions, and mission logs
- `src/data/overviewContent.ts`: Explanatory content used by the system overview page
- `src/styles/index.css`: Tailwind import, global styling, and shared oceanographic background motifs

## Architecture notes

- Routing is centralized so the app scales cleanly as more views are added.
- Simulation logic is isolated from UI code, making the behavior easier to test and explain.
- Zone definitions and initial probe values are centralized in constants to avoid duplicated logic.
- The console is composed from reusable panels to keep the UI modular and readable.
- Battery usage is modeled with slow baseline drain, action-based energy costs, and a deterministic recovery loop instead of a simple countdown-to-zero.
