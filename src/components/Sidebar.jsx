import React, { useState, useEffect, useRef } from 'react';

const Sidebar = ({ 
  onSurpriseMe, onClearCanvas, onDownloadAll, 
  onSaveSession, onTidyUp, onRecenter, 
  sessions, onLoadSession, onDeleteSession
}) => {
  const [showProjects, setShowProjects] = useState(false);
  const panelRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showProjects && panelRef.current && !panelRef.current.contains(e.target) && btnRef.current && !btnRef.current.contains(e.target)) {
        setShowProjects(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProjects]);

  const icons = {
    surprise: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    trash: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
    download: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    projects: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    magic: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 4V2m0 16v-2M8 11h2m10 0h-2M5.4 5.4l1.4 1.4m10.4 10.4l1.4 1.4M20.6 5.4l-1.4 1.4M5.4 20.6l1.4-1.4"/>
      </svg>
    ),
    center: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v8m-4-4h8"/>
      </svg>
    )
  };

  return (
    <>
      <nav className="left-rail" aria-label="Main Actions">
        <button className="rail-btn" title="Surprise Me" onClick={onSurpriseMe}>
          <span className="icon">{icons.surprise}</span>
          <span className="label">Surprise Me</span>
        </button>
        <button ref={btnRef} className="rail-btn" title="Projects" onClick={() => setShowProjects(!showProjects)}>
          <span className="icon">{icons.projects}</span>
          <span className="label">Projects</span>
        </button>
        <button className="rail-btn" title="Export All" onClick={onDownloadAll}>
          <span className="icon">{icons.download}</span>
          <span className="label">Export All</span>
        </button>
        
        <div className="rail-divider"></div>
        
        <button className="rail-btn" title="Tidy Up Canvas" onClick={onTidyUp}>
          <span className="icon">{icons.magic}</span>
          <span className="label">Tidy Up</span>
        </button>
        <button className="rail-btn" title="Recenter View" onClick={onRecenter}>
          <span className="icon">{icons.center}</span>
          <span className="label">Recenter</span>
        </button>

        <div style={{ flex: 1 }}></div>

        <button className="rail-btn" title="Clear Canvas" onClick={onClearCanvas} style={{ color: 'var(--vermillion)' }}>
          <span className="icon">{icons.trash}</span>
          <span className="label">Clear All</span>
        </button>
      </nav>

      {showProjects && (
        <div ref={panelRef} className="projects-panel pill">
          <div className="panel-header">
            <h3>My Projects</h3>
            <button className="save-btn" onClick={onSaveSession}>+ New Project</button>
          </div>
          <div className="sessions-list">
            {sessions.length === 0 && <p className="empty-msg">No saved projects yet.</p>}
            {sessions.map(s => (
              <div key={s.id} className="session-card">
                <div className="session-info" onClick={() => { onLoadSession(s); setShowProjects(false); }}>
                  <b>{s.name}</b>
                  <span>{s.items.length} islands • {new Date(s.ts).toLocaleDateString()}</span>
                </div>
                <button className="del-session" onClick={() => onDeleteSession(s.id)}>×</button>
              </div>
            ))}
          </div>

          <button className="close-panel" onClick={() => setShowProjects(false)}>Close</button>
        </div>
      )}
    </>
  );
};

export default Sidebar;