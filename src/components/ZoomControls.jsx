import React from 'react';

const ZoomControls = ({ scale, onScaleChange, onRecenter }) => {
  const zoomIn = () => {
    onScaleChange(Math.min(scale + 0.1, 3));
  };

  const zoomOut = () => {
    onScaleChange(Math.max(scale - 0.1, 0.2));
  };

  const setZoom = (value) => {
    onScaleChange(value);
  };

  return (
    <div className="zoom-controls pill">
      <button onClick={zoomOut} title="Zoom Out" aria-label="Zoom Out">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      
      <div className="zoom-value" onClick={() => setZoom(1)} title="Reset Zoom">
        {Math.round(scale * 100)}%
      </div>

      <button onClick={zoomIn} title="Zoom In" aria-label="Zoom In">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      <div className="zoom-divider"></div>

      <button onClick={onRecenter} title="Recenter View" aria-label="Recenter View">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
    </div>
  );
};

export default ZoomControls;
