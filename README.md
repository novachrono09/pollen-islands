# 🏝️ Floating Island Studio

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Zustand](https://img.shields.io/badge/State-Zustand-443E38)](https://github.com/pmndrs/zustand)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Floating Island Studio** is a visually immersive, multi-modal AI workbench. It transforms the solitary act of "prompting" into a spatial creative process, where generations live as interactive "islands" on an infinite, high-performance canvas.

Built with **React 19** and powered by the **Pollinations API**, it offers a "Bring Your Own Pollen" (BYOP) experience for both text and image generation.

---

## ✨ Key Features

- **🎨 Spatial Canvas**: A draggable, zoomable, and high-performance workspace where your creations live as interactive islands.
- **🌌 Multi-modal Magic**: 
  - **Image Generation**: Flux, Turbo, and more with support for custom seeds, negative prompts, and transparency.
  - **Text Generation**: LLM-powered completions integrated directly into the spatial workflow.
- **📂 Session Management**: Save and load different "worlds" (projects). Your canvas state, scale, and items are persistent.
- **✨ Polish & UX**:
  - **Glassmorphism UI**: A modern, translucent interface that feels alive.
  - **Hot Prompts**: Quick-start templates to spark inspiration.
  - **Tidy Up**: One-click grid organization for your messy island archipelago.
  - **Bulk Actions**: Download all generated assets in one go.
- **🔒 Privacy First**: "Bring Your Own Pollen" architecture. Your API key is stored locally in your browser and used securely via an authenticated proxy.

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/novachrono09/pollen-islands.git
cd pollen-islands
npm install
```

### 2. Launch Development Server
```bash
npm run dev
```

### 3. Connect your API Key
Open the app and click the **Pollinations Logo** to enter your API key. Alternatively, pass it via URL hash: `http://localhost:5173/#api_key=your_key_here`.

---

## 🛠️ Architecture & Tech Stack

### Core Technologies
- **Frontend**: [React 19](https://react.dev/) (Hooks, Memo, LayoutEffects).
- **Build Tool**: [Vite 8](https://vitejs.dev/).
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with `persist` middleware for seamless local storage synchronization.
- **API Client**: [OpenAI SDK](https://github.com/openai/openai-node) (configured for Pollinations).
- **Styling**: Vanilla CSS with modern Mesh Gradients and CSS Variables for theme consistency.

### Proxy Strategy
To ensure security and bypass CORS limitations in the browser, Floating Island Studio utilizes a proxy pattern:
- **Development**: Vite's `server.proxy` reroutes `/api/proxy` to `gen.pollinations.ai`.
- **Production**: `vercel.json` handles rewrites, injecting necessary headers while keeping the client code clean.

### State Persistence
The entire studio state is managed via `src/store/useStore.js`. This includes:
- Canvas coordinates and zoom level.
- History of all generations.
- Active "islands" and their spatial positions.
- User preferences (models, sizes, variations).

---

## 🎮 Canvas Controls

| Action | Control |
| :--- | :--- |
| **Pan Canvas** | Right-Click + Drag / Middle-Click + Drag |
| **Zoom** | Mouse Wheel / Zoom Controls (Bottom Right) |
| **Move Island** | Left-Click + Drag Header |
| **Resize Island** | Drag Handle (Bottom Right of Card) |
| **Focus Island** | Left-Click to bring to front |
| **Quick Prompt** | Press `/` to focus the Prompt Island |

---

## 🔐 Security

Floating Island Studio is a client-side application. 
- **No Backend**: Your API key never touches our servers. 
- **Encryption**: Key handling is limited to local memory and `localStorage`.
- **Sanitization**: API keys are sanitized before being passed to the OpenAI constructor to prevent injection or malformed requests.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ✨ by <a href="https://github.com/novachrono09">novachrono09</a>
</p>
