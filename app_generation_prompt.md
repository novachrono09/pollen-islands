# Prompt to Build "Floating Island Studio"

You are an expert frontend developer and UX/UI designer. Your task is to build a complete, production-ready frontend application called "Floating Island Studio" from scratch. 

You have full creative freedom to choose the best frontend frameworks, libraries, and styling tools to achieve this. Do not ask for technology choices; use your expert judgment to select a modern, robust stack.

## Application Overview
"Floating Island Studio" is a high-performance, visually rich AI image generation workbench. It allows users to input prompts, configure settings, and generate stunning images using various AI models.

## Core UI Components and Layout
1. **Header:** 
   - Displays user status indicators such as current balance, generation streak, and the status of their API key connection.
2. **Sidebar / Tools Panel:** 
   - A dedicated area providing quick access to generation controls: Image Size (width/height or aspect ratio presets), Seed input, number of Variations, and an "Enhance Prompt" toggle.
3. **Prompt Island:** 
   - The primary interaction hub. A visually prominent central input area where users type their image generation prompts. 
   - It should also include a dropdown or selector for choosing the specific AI image model to use.
4. **Masonry Grid (Results Area):** 
   - A responsive, Pinterest-style masonry grid layout that beautifully displays the newly generated images.
5. **History Ribbon:** 
   - A quick-access gallery (like a filmstrip or a secondary sidebar) showing thumbnail previews of previously generated images.

## Design System & Aesthetics
- **Visual Style:** The app must be visually stunning and feel "alive." Implement modern UI trends like **Glassmorphism** (frosted glass effects on panels/cards) and vibrant, animated **Mesh Gradients** in the background.
- **Responsiveness:** Adopt a mobile-first approach. On smaller screens, tools and history might be hidden behind menus or drawers. On larger viewports (desktops/tablets), expand the layout to include a persistent Left Rail (Sidebar) and the History Ribbon.
- **Micro-interactions:** Provide rich interactive feedback. Use custom **Toast notifications** for success/error messages, smooth CSS transitions for state changes, and celebratory visual effects like **Confetti** when an image is successfully generated.

## State & Data Management
- **Persistence:** The application must remember the user's state across page reloads. Save the API key, generated image history, selected models, and configuration settings locally in the browser (e.g., using localStorage or IndexedDB).

## API Integration (Pollinations API)
The application will use the **Pollinations API** to generate images.
- **Reference Document:** I have attached the `@APIDOCS.md` file. Please read it thoroughly to understand how to interact with the Pollinations API.
- **Authentication:** Build a mechanism in the UI (e.g., a settings modal or in the header) for the user to securely input and save their Pollinations API key. Ensure this key is attached to API requests as described in the docs.
- **Endpoints & Parameters:** Utilize the image generation endpoints described in the docs, mapping the UI controls (model selection, prompt, size, seed, enhance) to the corresponding API parameters.

## Your Task
Generate the complete codebase for this frontend application. Structure the project logically, write clean and maintainable code, and ensure the final product is a polished, fully functional prototype that meets all the aesthetic and functional requirements above.