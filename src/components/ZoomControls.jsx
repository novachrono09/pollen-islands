import React, { useRef, useState } from 'react';
import { useStore } from '../store/useStore';

const ZoomControls = ({ scale, onScaleChange, onRecenter }) => {
  const zoomPos = useStore(state => state.zoomPos);
  const setZoomPos = useStore(state => state.setZoomPos);
  
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });

  const zoomIn = (e) => {
    e.stopPropagation();
    onScaleChange(Math.min(scale + 0.1, 3));
  };

  const zoomOut = (e) => {
    e.stopPropagation();
    onScaleChange(Math.max(scale - 0.1, 0.2));
  };

  const setZoom = (e, value) => {
    e.stopPropagation();
    onScaleChange(value);
  };

  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('.zoom-value')) return;
    
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    initialPos.current = { ...zoomPos };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    
    setZoomPos({
      x: initialPos.current.x + dx,
      y: initialPos.current.y + dy
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className={`zoom-controls pill ${isDragging ? 'dragging' : ''}`}
      style={{ 
        left: `${zoomPos.x}px`, 
        top: `${zoomPos.y}px`,
        position: 'fixed',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <button onClick={zoomOut} title="Zoom Out" aria-label="Zoom Out">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      
      <div className="zoom-value" onClick={(e) => setZoom(e, 1)} title="Reset Zoom">
        {Math.round(scale * 100)}%
      </div>

      <button onClick={zoomIn} title="Zoom In" aria-label="Zoom In">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      <div className="zoom-divider"></div>

      <button onClick={(e) => { e.stopPropagation(); onRecenter(); }} title="Recenter View" aria-label="Recenter View">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
    </div>
  );
};

export default ZoomControls;
