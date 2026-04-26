import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      // --- Persistent State ---
      history: [],
      items: [],
      canvasView: { x: 0, y: 0, scale: 1 },
      sessions: [],
      
      mode: 'image',
      selectedModel: 'flux',
      selectedTextModel: 'openai',
      selectedSize: '1024x1024',
      variations: 1,
      enhance: true,
      apiKey: '',
      zoomPos: { x: 180, y: 6 }, // Default: Right of the logo
      
      // --- Transient UI State ---
      prompt: '',
      expanded: false,
      isGenerating: false,
      showSettings: false,
      isHistoryHovered: false,
      seed: '',
      negativePrompt: '',
      transparent: false,

      // --- Actions ---
      // Enhanced setters that support both direct values and functional updaters
      setHistory: (val) => set((state) => ({ 
        history: typeof val === 'function' ? val(state.history) : val 
      })),
      setItems: (val) => set((state) => ({ 
        items: typeof val === 'function' ? val(state.items) : val 
      })),
      setCanvasView: (canvasView) => set({ canvasView }),
      setSessions: (sessions) => set({ sessions }),
      
      setMode: (mode) => set({ mode }),
      setSelectedModel: (selectedModel) => set({ selectedModel }),
      setSelectedTextModel: (selectedTextModel) => set({ selectedTextModel }),
      setSelectedSize: (selectedSize) => set({ selectedSize }),
      setVariations: (variations) => set({ variations }),
      setEnhance: (enhance) => set({ enhance }),
      setApiKey: (apiKey) => set({ apiKey }),
      setZoomPos: (zoomPos) => set({ zoomPos }),
      
      setPrompt: (prompt) => set({ prompt }),
      setExpanded: (expanded) => set({ expanded }),
      setIsGenerating: (isGenerating) => set({ isGenerating }),
      setShowSettings: (showSettings) => set({ showSettings }),
      setIsHistoryHovered: (isHistoryHovered) => set({ isHistoryHovered }),
      setSeed: (seed) => set({ seed }),
      setNegativePrompt: (negativePrompt) => set({ negativePrompt }),
      setTransparent: (transparent) => set({ transparent }),

      addNode: (newItem) => set((state) => ({ items: [newItem, ...state.items] })),
      updateNode: (id, updates) => set((state) => ({
        items: (state.items || []).map((item) => (item.id === id ? { ...item, ...updates } : item)),
      })),
      removeNode: (id) => set((state) => ({
        items: (state.items || []).filter((item) => item.id !== id),
      })),
      bringNodeToFront: (id) => set((state) => {
        const item = (state.items || []).find(it => it.id === id);
        if (!item) return state;
        return { items: [...state.items.filter(it => it.id !== id), item] };
      }),
    }),
    {
      name: 'pi_v2_storage',
      partialize: (state) => ({
        history: state.history,
        items: state.items,
        canvasView: state.canvasView,
        sessions: state.sessions,
        mode: state.mode,
        selectedModel: state.selectedModel,
        selectedTextModel: state.selectedTextModel,
        selectedSize: state.selectedSize,
        variations: state.variations,
        enhance: state.enhance,
        apiKey: state.apiKey,
        zoomPos: state.zoomPos
      }),
    }
  )
);
