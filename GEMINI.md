# Floating Island Studio - GEMINI Context

This document provides essential context and instructions for AI agents interacting with the Floating Island Studio project.

## Project Overview

**Floating Island Studio** is a high-performance, visually rich AI image generation workbench built with **React 19** and **Vite**. It leverages the [pollinations.ai](https://pollinations.ai) API to generate images across multiple models and configurations.

### Key Technologies
- **Frontend Framework:** React 19 (Functional components, Hooks)
- **Build Tool:** Vite
- **Styling:** Vanilla CSS with modern features (Glassmorphism, Mesh Gradients, Responsive Design)
- **Persistence:** Browser `localStorage` via custom hooks
- **API Integration:** Direct `fetch` calls to `image.pollinations.ai` and `enter.pollinations.ai`

### Core Architecture
- **State Management:** Centralized in `src/App.jsx` using `useState` and a custom `useLocalStorage` hook.
- **Component Structure:**
    - `Header`: User status (balance, streak, API key).
    - `Sidebar`: Quick access to tools (Size, Seed, Variations, Enhance).
    - `PromptIsland`: The primary interaction point for inputting prompts and selecting models/settings.
    - `MasonryGrid`: A responsive layout for displaying generated results.
    - `HistoryRibbon`: Quick access to previously generated images.
- **Visual Effects:** Custom `Confetti`, `Toast` notifications, and CSS-based animations.

## Building and Running

The project uses standard `npm` scripts defined in `package.json`:

| Task | Command | Description |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Starts the Vite dev server with HMR. |
| **Build** | `npm run build` | Compiles the project for production. |
| **Linting** | `npm run lint` | Runs ESLint for code quality checks. |
| **Preview** | `npm run preview` | Previews the production build locally. |

## Development Conventions

- **State Persistence:** Always use the `useLocalStorage` hook for state that should survive page refreshes (e.g., API keys, history, selected models).
- **Styling:** Prefer **Vanilla CSS** in `src/index.css`. Use CSS variables defined in `:root` for consistency (e.g., `--vermillion`, `--jade`, `--glass`).
- **Responsiveness:** The layout is mobile-first but includes specific "Left Rail" and "History Ribbon" features that appear only on larger viewports (`min-width: 1024px`).
- **Interaction:** UI feedback is critical. Use the `toast` function and `navigator.vibrate` (where available) for user actions.
- **API Safety:** Ensure the `token` (API key) is handled securely and only appended to requests when present.

## Key Files
- `src/App.jsx`: Main logic, state orchestration, and API handling.
- `src/components/PromptIsland.jsx`: Complex UI for prompt input and settings.
- `src/hooks/useLocalStorage.js`: Shared utility for state persistence.
- `src/index.css`: Comprehensive design system and global styles.
