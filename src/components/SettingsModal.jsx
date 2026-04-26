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
      console.log('Manual key entry detected, setting apiKey...');
      setApiKey(val);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="settings-modal pill" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Studio Settings</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="settings-section">
          <label>Pollinations API Key</label>
          <p className="settings-desc">Connect your Pollinations account to generate images and text.</p>
          
          {apiKey ? (
            <div className="api-key-status" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
              <div className="status-indicator connected" style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--jade)' }}></div>
              <span style={{ fontWeight: '500' }}>Connected ({apiKey.slice(0, 5)}...{apiKey.slice(-4)})</span>
              <button 
                onClick={handleDisconnect}
                style={{ marginLeft: 'auto', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--foreground)', cursor: 'pointer' }}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className="api-key-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <button 
                onClick={handleConnectBYOP}
                style={{ padding: '10px', borderRadius: '8px', border: 'none', background: 'var(--vermillion)', color: '#fff', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <span style={{marginRight: '8px', fontSize: '1.2em'}}>🌼</span> Connect with Pollinations
              </button>
              <div style={{ textAlign: 'center', opacity: 0.5, fontSize: '0.9em' }}>or enter manually</div>
              <input 
                type="password" 
                placeholder="sk_..." 
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--foreground)', width: '100%', boxSizing: 'border-box' }}
                onChange={handleManualKeyChange}
              />
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            className="done-btn" 
            onClick={onClose}
            style={{ padding: '8px 24px', borderRadius: '20px', border: 'none', background: 'var(--foreground)', color: 'var(--background)', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;