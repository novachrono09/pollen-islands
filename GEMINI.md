# Floating Island Studio - GEMINI Context

This document provides foundational architectural context and development mandates for AI agents.

## Project Overview
**Floating Island Studio** is a visually rich AI workbench built with **React 19** and **Vite**, leveraging the **Pollinations API** for multi-modal generation.

### Core Architecture
- **State Management**: 
  - **Zustand (`src/store/useStore.js`)**: Centralized state for global configuration, history, and the **API Key**.
  - **Local Persistence**: Integrated with browser `localStorage` via Zustand middleware and custom `useLocalStorage` hooks for transient UI state.
- **API Strategy**:
  - **OpenAI SDK**: Used for all text and image generations via the `openai` npm package.
  - **Proxy Routing**: All requests are routed through `/api/proxy`.
    - **Local**: Handled by Vite's dev proxy in `vite.config.js`.
    - **Production**: Handled by Vercel rewrites in `vercel.json`.
  - **Authentication**: Supports "Bring Your Own Pollen" (BYOP) and manual `sk_` / `pk_` entry.
- **Image Generation**:
  - **Base64 Delivery**: Images are generated with `response_format: 'b64_json'` to bypass CORS/Auth issues during browser previews.
  - **Data URLs**: Generated images are stored as `data:image/webp;base64` strings for instant rendering and offline persistence.

## Infrastructure
- **Git**: Hosted at `https://github.com/novachrono09/pollen-islands`.
- **Deployment**: Vercel (Auto-deploy on `main` branch).
- **Styling**: Vanilla CSS in `src/index.css` using modern glassmorphism and mesh gradient patterns.

## Development Mandates
1. **State Consistency**: Always use `useStore` for `apiKey` and global generation settings to ensure multi-component synchronization.
2. **Proxy Discipline**: Never call `gen.pollinations.ai` directly from the frontend. Use `/api/proxy/...` to ensure CORS and Header injection work correctly across all environments.
3. **API Security**: The `apiKey` must be trimmed and sanitized before being passed to the `OpenAI` constructor.
4. **Performance**: Maintain the "Floating Island" canvas performance by memoizing canvas items and using `useLayoutEffect` for world transforms.

## Key Files
- `src/App.jsx`: Main orchestration and generation logic.
- `src/store/useStore.js`: Persistent global state.
- `src/components/IslandCanvas.jsx`: High-performance draggable/resizable canvas.
- `vite.config.js`: Dev proxy and build configuration.
- `vercel.json`: Production rewrite rules for API proxying.
