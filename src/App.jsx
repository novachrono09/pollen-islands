import React, { useState, useEffect, useRef, useCallback } from 'react';
import OpenAI from 'openai';
import { useStore } from './store/useStore';
import useLocalStorage from './hooks/useLocalStorage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HistoryRibbon from './components/HistoryRibbon';
import IslandCanvas from './components/IslandCanvas';
import HotPrompts from './components/HotPrompts';
import PromptIsland from './components/PromptIsland';
import Confetti from './components/Confetti';
import Toast from './components/Toast';
import SettingsModal from './components/SettingsModal';
import ZoomControls from './components/ZoomControls';

function App() {
  const [history, setHistory] = useLocalStorage('pi_history', []);
  
  // Settings
  const [mode, setMode] = useLocalStorage('pi_mode_type', 'image'); // 'image' or 'text'
  const [selectedModel, setSelectedModel] = useLocalStorage('pi_model', 'flux');
  const [selectedTextModel, setSelectedTextModel] = useLocalStorage('pi_text_model', 'openai');
  const [selectedSize, setSelectedSize] = useLocalStorage('pi_size', '1024x1024');
  const [variations, setVariations] = useLocalStorage('pi_var', 1);
  const [negativePrompt, setNegativePrompt] = useState('');
  const [transparent, setTransparent] = useState(false);
  
  // UI State
  const [prompt, setPrompt] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isHistoryHovered, setIsHistoryHovered] = useState(false);
  const [seed, setSeed] = useState('');
  const [enhance, setEnhance] = useState(true);

  // Zustand State
  const canvasView = useStore(state => state.canvasView);
  const setCanvasView = useStore(state => state.setCanvasView);
  const items = useStore(state => state.items);
  const setItems = useStore(state => state.setItems);
  const apiKey = useStore(state => state.apiKey);
  const setApiKey = useStore(state => state.setApiKey);
  
  // Session/Project Management
  const [sessions, setSessions] = useLocalStorage('pi_sessions', []);

  const lastGenTs = useRef(0);
  const toastRef = useRef(null);
  const confettiRef = useRef(null);
  const pendingCount = useRef(0);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('api_key=')) {
      const params = new URLSearchParams(hash.slice(1));
      const key = params.get('api_key');
      if (key) {
        console.log('Detected api_key in hash, setting store value.');
        setApiKey(key);
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        setTimeout(() => toastRef.current?.show('API Key successfully connected ✦'), 500);
      }
    } else if (hash.includes('error=')) {
      const params = new URLSearchParams(hash.slice(1));
      const error = params.get('error');
      setTimeout(() => toastRef.current?.show(`Auth failed: ${error} ❌`), 500);
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [setApiKey]);

  const vibrate = useCallback(() => { if (navigator.vibrate) navigator.vibrate(10); }, []);
  const toast = useCallback((msg) => toastRef.current?.show(msg), []);

  const onClearCanvas = useCallback(() => {
    if (items.length === 0) return;
    if (window.confirm('Clear all islands from this canvas?')) {
      setItems([]);
      toast('Canvas cleared 🗑️');
      vibrate();
    }
  }, [items.length, vibrate, toast, setItems]);

  const onSaveSession = useCallback(() => {
    const name = window.prompt('Enter project name:', `Project ${sessions.length + 1}`);
    if (!name) return;
    
    const newSession = {
      id: Date.now(),
      name,
      items,
      offset: canvasView,
      ts: Date.now()
    };
    
    setSessions(prev => [newSession, ...prev]);
    toast('Project saved ✓');
  }, [items, canvasView, sessions.length, setSessions, toast]);

  const onLoadSession = useCallback((session) => {
    setItems(session.items);
    if (session.offset) setCanvasView(session.offset);
    toast(`Loaded: ${session.name}`);
    vibrate();
  }, [setItems, setCanvasView, toast, vibrate]);

  const onTidyUp = useCallback(() => {
    if (items.length === 0) return;
    vibrate();
    const cols = Math.ceil(Math.sqrt(items.length));
    const gap = 40;
    const cardW = 320;
    
    const centerX = (window.innerWidth / 2 - canvasView.x) / canvasView.scale;
    const centerY = (window.innerHeight / 2 - canvasView.y) / canvasView.scale;

    const gridW = cols * cardW + (cols - 1) * gap;
    const rows = Math.ceil(items.length / cols);
    const estimatedGridH = rows * cardW + (rows - 1) * gap;

    const startX = centerX - gridW / 2;
    const startY = centerY - estimatedGridH / 2;
    
    const colY = new Array(cols).fill(startY);
    const updatedItems = items.map((it, i) => {
        const c = i % cols;
        const x = startX + c * (cardW + gap);
        const y = colY[c];
        colY[c] += (it.h || cardW) + gap;
        return { ...it, x, y };
    });

    setItems(updatedItems);
    toast('Islands organized ✨');
  }, [items, canvasView, setItems, vibrate, toast]);

  const onRecenter = useCallback(() => {
    setCanvasView({ x: 0, y: 0, scale: 1 });
    vibrate();
  }, [setCanvasView, vibrate]);

  const onSurpriseMe = useCallback(() => {
    const pool = [
      'floating island with waterfalls, high fantasy, ethereal light',
      'cyberpunk cityscape at dusk, neon rain, cinematic fog',
      'isometric miniature of a cozy library with a dragon',
      'studio ghibli style summer field with a rustic cottage',
      'abstract 3d sculpture of crystal flowers, iridescent',
      'underwater city with bioluminescent jellyfish, deep blue',
      'ancient ruins in a desert, oasis, golden hour lighting',
      'surreal portrait of a person made of galaxies and nebula'
    ];
    const p = pool[Math.floor(Math.random() * pool.length)];
    setPrompt(p);
    setExpanded(true);
    toast('Idea generated ✨');
    vibrate();
  }, [vibrate, toast, setPrompt, setExpanded]);

  const onDownloadAll = useCallback(async () => {
    if (items.length === 0) {
      toast('Nothing to download');
      return;
    }
    
    toast('Downloading all items...');
    for (const item of items) {
      try {
        if (item.type === 'text') {
          const blob = new Blob([item.content], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `island-${item.id}.txt`;
          a.click();
          URL.revokeObjectURL(url);
        } else if (item.url) {
          const res = await fetch(item.url);
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `island-${item.id}.jpg`;
          a.click();
          URL.revokeObjectURL(url);
        }
      } catch (e) {
        console.error('Failed to download item', item.id, e);
      }
      await new Promise(r => setTimeout(r, 500));
    }
    toast('Download complete ✓');
  }, [items, toast]);

  const onItemLoad = useCallback((item, errorMsg = null) => {
    if (!item.isNew) return;
    if (item.ts !== lastGenTs.current) return;

    pendingCount.current--;
    if (errorMsg) {
      setItems(prev => prev.map(it => it.id === item.id ? { ...it, isNew: false, error: errorMsg } : it));
    } else {
      setHistory(prev => [item, ...prev].slice(0, 100));
      setItems(prev => prev.map(it => it.id === item.id ? { ...it, isNew: false } : it));
    }

    if (pendingCount.current <= 0) {
      setIsGenerating(false);
      if (!errorMsg) {
        toast('Island ready ✦');
        confettiRef.current?.burst();
      } else {
        toast(`Generation failed ❌`);
      }
    } else if (errorMsg) {
      toast(`Generation failed ❌`);
    }
  }, [setHistory, toast, setItems]);

  const onGenerate = useCallback(async () => {
    const p = prompt.trim();
    if (!p) {
      toast('Please enter a prompt');
      return;
    }
    if (isGenerating) return;
    
    vibrate();
    setIsGenerating(true);
    const now = Date.now();
    lastGenTs.current = now;
    
    const varsCount = parseInt(variations);
    pendingCount.current = varsCount;
    
    const targetW = 320;
    
    const newItems = Array.from({ length: varsCount }).map((_, i) => {
      const offsetX = (i % 2 === 0 ? i * 20 : -i * 20);
      const offsetY = i * 20;
      
      const posX = (window.innerWidth / 2) - (targetW / 2) - (canvasView.x / canvasView.scale) + offsetX;
      const posY = (window.innerHeight / 2) - (targetW / 2) - (canvasView.y / canvasView.scale) + offsetY;
      
      const isImg = mode === 'image';
      let h = 200;
      if (isImg) {
         const [wStr, hStr] = selectedSize.split('x');
         const aspect = parseInt(hStr) / parseInt(wStr) || 1;
         h = targetW * aspect;
      }

      return {
        id: `${now}-${i}`,
        type: mode,
        prompt: p,
        model: isImg ? selectedModel : selectedTextModel,
        w: targetW,
        h,
        x: posX,
        y: posY,
        ts: now,
        isNew: true,
        isPending: true
      };
    });

    setItems(prev => [...newItems, ...prev]);

    if (!apiKey) {
      toast('API Key required. Click Pollinations logo to connect.');
      newItems.forEach(item => {
        const errorMsg = 'Missing API Key';
        setItems(prev => prev.map(it => it.id === item.id ? { ...item, isPending: false, error: errorMsg } : it));
      });
      setIsGenerating(false);
      return;
    }

    const trimmedKey = apiKey.trim().replace(/^["'](.+)["']$/, '$1');

    newItems.forEach(async (item, idx) => {
      try {
        const parsedSeed = parseInt(seed);
        const actualSeed = (!isNaN(parsedSeed)) ? (parsedSeed + idx) : Math.floor(Math.random() * 2147483647);

        if (item.type === 'text') {
          const openai = new OpenAI({
            baseURL: window.location.origin + '/api/proxy',
            apiKey: trimmedKey,
            dangerouslyAllowBrowser: true,
            fetch: async (url, options) => {
              const u = new URL(url);
              u.searchParams.set('key', trimmedKey);
              return fetch(u.toString(), options);
            }
          });
          
          const response = await openai.chat.completions.create({
            model: selectedTextModel,
            messages: [{ role: 'user', content: p }],
            seed: actualSeed
          });
          
          const content = response.choices?.[0]?.message?.content || 'Empty response';
          
          const updatedItem = { ...item, content, isPending: false };
          setItems(prev => prev.map(it => it.id === item.id ? updatedItem : it));
          onItemLoad(updatedItem);

        } else {
          const body = {
            prompt: p,
            model: selectedModel,
            size: selectedSize,
            seed: actualSeed % 2147483647,
            response_format: 'b64_json',
            nologo: true
          };
          if (enhance) body.enhance = true;
          if (negativePrompt) body.negative_prompt = negativePrompt;
          if (transparent) body.transparent = true;

          const res = await fetch(`/api/proxy/images/generations?key=${encodeURIComponent(trimmedKey)}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error?.message || `Proxy error: ${res.status}`);
          }
          
          const response = await res.json();
          const b64Data = response.data?.[0]?.b64_json;
          if (!b64Data) throw new Error('Failed to get image data');
          
          // Fix mime-type to JPEG to match Pollinations flux response
          const imageUrl = `data:image/jpeg;base64,${b64Data}`;
          
          const updatedItem = { ...item, url: imageUrl, isPending: false };
          setItems(prev => prev.map(it => it.id === item.id ? updatedItem : it));
          // Note: Card image onLoad will trigger onItemLoad
        }
      } catch (err) {
        let errorMsg = err.message || 'Generation failed';
        if (err.status === 401) errorMsg = 'Invalid API Key / Unauthorized';
        const failedItem = { ...item, isPending: false, error: errorMsg };
        setItems(prev => prev.map(it => it.id === item.id ? failedItem : it));
        onItemLoad(failedItem, errorMsg);
      }
    });

  }, [prompt, isGenerating, vibrate, variations, mode, canvasView, selectedTextModel, selectedModel, selectedSize, seed, enhance, negativePrompt, transparent, apiKey, setItems, onItemLoad, toast]);

  const updateItem = useCallback((id, updates) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, ...updates } : it));
  }, [setItems]);

  const onRemoveItem = useCallback((id) => {
    setItems(prev => prev.filter(it => it.id !== id));
    vibrate();
    toast('Island removed');
  }, [vibrate, toast, setItems]);

  const bringToFront = useCallback((id) => {
    setItems(prev => {
        const item = prev.find(it => it.id === id);
        if (!item) return prev;
        return [...prev.filter(it => it.id !== id), item];
    });
  }, [setItems]);

  const onCardAction = useCallback(async (action, item) => {
    vibrate();
    if (action === 'Download') {
      if (item.type === 'text') {
        const blob = new Blob([item.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `island-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        toast('Downloaded text ✓');
        return;
      }
      if (item.url) {
        try {
          const response = await fetch(item.url);
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `island-${Date.now()}.jpg`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          toast('Downloaded image ✓');
        } catch {
          toast('Failed to download image');
        }
      }
    }
    if (action === 'Copy') {
      try {
        if (item.type === 'text') {
          await navigator.clipboard.writeText(item.content);
          toast('Text copied ✓');
        } else if (item.url) {
          try {
             const res = await fetch(item.url);
             const blob = await res.blob();
             await navigator.clipboard.write([new ClipboardItem({[blob.type]: blob})]);
             toast('Image copied to clipboard ✓');
          } catch {
             await navigator.clipboard.writeText(item.url);
             toast('Image URL copied ✓');
          }
        }
      } catch { 
        toast('Copy failed');
      }
    }
    if (action === 'Regen') {
      setPrompt(item.prompt);
      setExpanded(true);
      if (item.type === 'text') setMode('text');
      else setMode('image');
    }
  }, [vibrate, toast, setPrompt, setExpanded, setMode]);

  const onHistoryItemClick = useCallback((item) => {
    vibrate();
    const now = Date.now();
    const targetW = 320;
    const ratio = (item.h || 512) / (item.w || 512);
    const targetH = targetW * ratio;
    
    const posX = (window.innerWidth / 2) - (targetW / 2) - (canvasView.x / canvasView.scale);
    const posY = (window.innerHeight / 2) - (targetH / 2) - (canvasView.y / canvasView.scale);

    const newItem = { 
      ...item,
      id: `hist-${now}`,
      x: posX,
      y: posY,
      w: targetW,
      h: targetH,
      ts: now,
      isNew: true 
    };
    
    setItems(prev => [newItem, ...prev]);
    toast('Island restored ✦');
  }, [canvasView, setItems, vibrate, toast]);

  const onRemoveHistory = useCallback((item) => {
    vibrate();
    setHistory(prev => prev.filter(h => h.ts !== item.ts));
    toast('Removed from history');
  }, [vibrate, toast, setHistory]);

  const onHotSelect = useCallback((p) => { 
    setPrompt(p); 
    setExpanded(true); 
    toast('Prompt inserted'); 
  }, [toast]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        setExpanded(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (expanded) {
        if (!e.target.isConnected) return;

        const isUiClick = e.target.closest('.island') || 
                          e.target.closest('.rail-btn') || 
                          e.target.closest('.history-ribbon') || 
                          e.target.closest('.zoom-controls') ||
                          e.target.closest('.modal-overlay');
                          
        if (!isUiClick) {
          setExpanded(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [expanded]);

  return (
    <>
      <div className="bg-mesh"></div>
      <Header 
        onSettings={() => setShowSettings(true)} 
        isHidden={isHistoryHovered}
      />
      <Sidebar 
        onSurpriseMe={onSurpriseMe}
        onClearCanvas={onClearCanvas}
        onDownloadAll={onDownloadAll}
        onSaveSession={onSaveSession}
        onTidyUp={onTidyUp}
        onRecenter={onRecenter}
        sessions={sessions}
        onLoadSession={onLoadSession}
        onDeleteSession={(id) => setSessions(prev => prev.filter(s => s.id !== id))}
      />
      <HistoryRibbon 
        history={history} 
        onItemClick={onHistoryItemClick} 
        onRemove={onRemoveHistory}
        onAction={onCardAction}
        onHover={(h) => setIsHistoryHovered(h)}
      />
      
      <IslandCanvas 
        items={items} 
        onAction={onCardAction} 
        onUpdateItem={updateItem}
        onRemoveItem={onRemoveItem}
        onBringToFront={bringToFront}
        offset={{ x: canvasView.x, y: canvasView.y }}
        onOffsetChange={(off) => setCanvasView({ ...canvasView, ...off })}
        scale={canvasView.scale}
        onScaleChange={(s) => setCanvasView({ ...canvasView, scale: s })}
        showEmpty={items.length === 0} 
        onItemLoad={onItemLoad}
      />

      <HotPrompts onSelect={onHotSelect} />

      <PromptIsland 
        prompt={prompt} setPrompt={setPrompt}
        expanded={expanded} setExpanded={setExpanded}
        isGenerating={isGenerating} onGenerate={onGenerate}
        mode={mode} setMode={setMode}
        selectedModel={selectedModel} setSelectedModel={setSelectedModel}
        selectedTextModel={selectedTextModel} setSelectedTextModel={setSelectedTextModel}
        selectedSize={selectedSize} setSelectedSize={setSelectedSize}
        variations={variations} setVariations={setVariations}
        seed={seed} setSeed={setSeed}
        enhance={enhance} setEnhance={setEnhance}
        negativePrompt={negativePrompt} setNegativePrompt={setNegativePrompt}
        transparent={transparent} setTransparent={setTransparent}
        onClear={onClearCanvas}
        onHistoryClick={() => { setExpanded(true); toast('History on right (desktop)'); }}
      />

      <ZoomControls 
        scale={canvasView.scale}
        onScaleChange={(s) => setCanvasView({ ...canvasView, scale: s })}
        onRecenter={onRecenter}
      />

      <Confetti ref={confettiRef} />
      <Toast ref={toastRef} />

      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
}

export default App;
