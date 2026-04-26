import React from 'react';
import { useStore } from '../store/useStore';

const Header = ({ onSettings, isHidden }) => {
  const apiKey = useStore(state => state.apiKey);

  return (
    <header className="topbar">
      <div className="logo-pill pill" style={{ left: '10px', transform: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ✦ Pollinations
        <div 
          className="api-status" 
          title={apiKey ? "API Connected" : "API Not Connected - Go to Settings"}
          style={{
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            background: apiKey ? 'var(--jade)' : 'var(--vermillion)',
            boxShadow: apiKey ? '0 0 8px var(--jade)' : 'none'
          }} 
        />
      </div>
      <div className={`header-actions ${isHidden ? 'hidden' : ''}`}>
        <button className="pill settings-icon-btn" onClick={onSettings} aria-label="Settings" style={{ marginLeft: '8px', width: '40px', height: '40px', display: 'grid', placeItems: 'center', border: 'none', background: 'var(--glass)' }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;