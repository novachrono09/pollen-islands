import React, { useState, useRef } from 'react';

const PromptIsland = ({
  prompt, setPrompt,
  expanded, setExpanded,
  isGenerating, onGenerate,
  mode, setMode,
  selectedModel, setSelectedModel,
  selectedTextModel, setSelectedTextModel,
  selectedSize, setSelectedSize,
  variations, setVariations,
  seed, setSeed,
  enhance, setEnhance,
  negativePrompt, setNegativePrompt,
  transparent, setTransparent,
  onClear, onHistoryClick
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const promptAreaRef = useRef(null);

  const imageModels = [
    { id: 'flux', name: 'FLUX', desc: 'Fast', c1: '#FF7A00', c2: '#FF3B30' },
    { id: 'zimage', name: 'Z-IMAGE', desc: 'Turbo', c1: '#7B61FF', c2: '#9B6DFF' },
    { id: 'wan-image', name: 'WAN', desc: 'New', c1: '#007AFF', c2: '#0051FF' },
    { id: 'gptimage', name: 'GPT', desc: 'Pro', c1: '#00C9A7', c2: '#009e84' },
    { id: 'nanobanana', name: 'NANO', desc: 'Gemini', c1: '#FF5CA8', c2: '#FF3B8B' },
    { id: 'seedream5', name: 'SEEDREAM', desc: 'Byte', c1: '#FFD600', c2: '#FF9900' },
    { id: 'kontext', name: 'KONTEXT', desc: 'Edit', c1: '#5856D6', c2: '#AF52DE' }
  ];

  const textModels = [
    { id: 'openai', name: 'GPT-5.4', desc: 'Smart', c1: '#00C9A7', c2: '#009e84' },
    { id: 'gemini', name: 'GEMINI 3', desc: 'Logic', c1: '#4285F4', c2: '#34A853' },
    { id: 'deepseek', name: 'DEEPSEEK', desc: 'Code', c1: '#60A5FA', c2: '#3B82F6' },
    { id: 'claude', name: 'CLAUDE', desc: 'Creative', c1: '#D97706', c2: '#B45309' },
    { id: 'mistral', name: 'MISTRAL', desc: 'Fast', c1: '#F59E0B', c2: '#D97706' },
    { id: 'grok', name: 'GROK', desc: 'Realtime', c1: '#000000', c2: '#333333' }
  ];

  return (
    <div 
      className={`island ${expanded ? 'expanded' : ''} ${isTyping ? 'focus-mode' : ''}`} 
      id="island"
      onClick={() => { if (!expanded) setExpanded(true); }}
    >
      <div className="island-compact">
        {!expanded && (
          <div className="compact-trigger">
            {prompt || "Imagine anything... (/ to focus)"}
          </div>
        )}
        {expanded && (
          <div className="mode-switcher">
            <button className={mode === 'image' ? 'active' : ''} onClick={(e) => { e.stopPropagation(); setMode('image'); }}>Image</button>
            <button className={mode === 'text' ? 'active' : ''} onClick={(e) => { e.stopPropagation(); setMode('text'); }}>Text</button>
          </div>
        )}
        <div style={{ flex: 1 }}></div>
        <button 
          id="genBtn" 
          className={`gen-btn ${isGenerating ? 'generating pulse' : ''}`} 
          aria-label="Generate"
          onClick={(e) => {
            e.stopPropagation();
            onGenerate();
          }}
        >
          <svg className="progress" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="25" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="3" />
            <circle 
              id="progressRing" cx="28" cy="28" r="25" fill="none" stroke="white" strokeWidth="3" 
              strokeDasharray="157" strokeDashoffset="157" strokeLinecap="round" 
            />
          </svg>
          <span>✦</span>
        </button>
      </div>
      <div className="island-expanded">
        <textarea 
          id="promptArea" 
          ref={promptAreaRef}
          placeholder={mode === 'image' ? "Describe your island in detail..." : "Ask anything..."}
          value={prompt}
          onFocus={() => setIsTyping(true)}
          onBlur={() => setIsTyping(false)}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              e.preventDefault();
              onGenerate();
            } else if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onGenerate();
            }
          }}
        />
        
        <div className="model-wheel" id="modelWheel">
          {(mode === 'image' ? imageModels : textModels).map(m => (
            <div 
              key={m.id}
              className={`model-card ${(mode === 'image' ? selectedModel : selectedTextModel) === m.id ? 'active' : ''}`} 
              onClick={(e) => { e.stopPropagation(); mode === 'image' ? setSelectedModel(m.id) : setSelectedTextModel(m.id); }} 
              style={{'--c1': m.c1, '--c2': m.c2}}
            >
              <b>{m.name}</b>
              <span>{m.desc}</span>
            </div>
          ))}
        </div>
        
        <div className="controls-row">
          {mode === 'image' && (
            <>
              <div className="control-group">
                <label>Size</label>
                <div className="size-pills" id="sizePills">
                  <button className={selectedSize === '1024x1024' ? 'active' : ''} onClick={(e) => { e.stopPropagation(); setSelectedSize('1024x1024'); }}>1:1</button>
                  <button className={selectedSize === '1344x768' ? 'active' : ''} onClick={(e) => { e.stopPropagation(); setSelectedSize('1344x768'); }}>16:9</button>
                  <button className={selectedSize === '768x1344' ? 'active' : ''} onClick={(e) => { e.stopPropagation(); setSelectedSize('768x1344'); }}>9:16</button>
                </div>
              </div>
              <div className="control-group">
                <label>Variations</label>
                <div className="stepper">
                  <button onClick={(e) => { e.stopPropagation(); setVariations(Math.max(1, variations - 1)); }}>−</button>
                  <span>{variations}</span>
                  <button onClick={(e) => { e.stopPropagation(); setVariations(Math.min(4, variations + 1)); }}>+</button>
                </div>
              </div>
            </>
          )}
          <div className="control-group">
            <label>Seed</label>
            <input 
              className="seed-input" type="number" inputMode="numeric" placeholder="random" 
              value={seed} onChange={(e) => setSeed(e.target.value)}
            />
          </div>
          {mode === 'image' && (
            <>
              <div className="control-group">
                <label>Transparent</label>
                <label className="switch">
                  <input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} />
                  <span></span>
                </label>
              </div>
              <div className="control-group">
                <label>Enhance</label>
                <label className="switch">
                  <input type="checkbox" checked={enhance} onChange={(e) => setEnhance(e.target.checked)} />
                  <span></span>
                </label>
              </div>
            </>
          )}
        </div>

        {mode === 'image' && (
          <div className="controls-row">
            <div className="control-group full-width">
              <label>Negative Prompt</label>
              <input 
                type="text" 
                placeholder="Elements to exclude..." 
                value={negativePrompt} 
                onChange={(e) => setNegativePrompt(e.target.value)}
                className="neg-input"
              />
            </div>
          </div>
        )}
        
        <div className="mobile-tabs">
          <button id="mobileHistory" onClick={(e) => { e.stopPropagation(); onHistoryClick(); }}>History</button>
          <button id="mobileClear" onClick={(e) => { e.stopPropagation(); onClear(); }}>Clear canvas</button>
        </div>
      </div>
    </div>
  );
};

export default PromptIsland;