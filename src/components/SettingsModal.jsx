import React from 'react';
import { useStore } from '../store/useStore';

const SettingsModal = ({ isOpen, onClose }) => {
  const apiKey = useStore(state => state.apiKey);
  const setApiKey = useStore(state => state.setApiKey);

  if (!isOpen) return null;

  const handleConnectBYOP = () => {
    const params = new URLSearchParams({
      redirect_uri: window.location.href,
    });
    window.location.href = `https://enter.pollinations.ai/authorize?${params}`;
  };

  const handleDisconnect = () => {
    if (window.confirm('Disconnect your Pollinations account?')) {
      setApiKey('');
    }
  };

  const handleManualKeyChange = (e) => {
    const val = e.target.value.trim();
    if (val.startsWith('sk_') || val.startsWith('pk_')) {
      setApiKey(val);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="settings-modal pill" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-title">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <h2>Studio Settings</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="settings-section">
            <div className="section-header">
              <label>Connectivity</label>
              <div className="badge jade">API</div>
            </div>
            <p className="settings-desc">Link your Pollinations account to unlock high-fidelity generations.</p>
            
            {apiKey ? (
              <div className="connection-card active">
                <div className="card-status">
                  <div className="status-dot pulsing"></div>
                  <div className="status-info">
                    <span className="status-label">Active Connection</span>
                    <span className="key-preview">{apiKey.slice(0, 8)}••••••••{apiKey.slice(-4)}</span>
                  </div>
                </div>
                <button className="disconnect-btn" onClick={handleDisconnect}>
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="auth-options">
                <button className="pollen-connect-btn" onClick={handleConnectBYOP}>
                  <span className="pollen-icon">🌼</span>
                  <div className="btn-text">
                    <span className="main-text">Connect Pollinations</span>
                    <span className="sub-text">One-tap authorization</span>
                  </div>
                </button>
                
                <div className="divider-text">or enter manually</div>
                
                <div className="manual-input-wrapper">
                  <input 
                    type="password" 
                    placeholder="Enter sk_... or pk_..." 
                    onChange={handleManualKeyChange}
                  />
                  <div className="input-icon">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="settings-section">
            <label>General</label>
            <div className="settings-row">
              <div className="row-info">
                <span className="row-title">Haptic Feedback</span>
                <span className="row-desc">Vibrate on actions (mobile)</span>
              </div>
              <div className="status-toggle active">ON</div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="done-btn" onClick={onClose}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
