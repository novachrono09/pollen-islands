import React, { useState, memo } from 'react';

const HistoryRibbon = ({ history, onItemClick, onRemove, onAction, onHover }) => {
  const [search, setSearch] = useState('');

  const filteredHistory = history.filter(h => 
    h.prompt.toLowerCase().includes(search.toLowerCase())
  );

  const icons = {
    download: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    copy: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
      </svg>
    ),
    trash: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      </svg>
    ),
    search: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    )
  };

  return (
    <aside 
      className="history-ribbon" 
      id="historyRibbon" 
      aria-label="History"
      onMouseEnter={() => onHover && onHover(true)}
      onMouseLeave={() => onHover && onHover(false)}
    >
      <div className="ribbon-header">
        <div className="search-box">
          <span className="search-icon">{icons.search}</span>
          <input 
            type="text" 
            inputMode="search"
            placeholder="Search history..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => {
              // Ensure it only stays focused if explicitly tapped
            }}
          />
        </div>
      </div>
      
      <div className="ribbon-inner" id="historyList">
        {filteredHistory.length === 0 && (
          <div className="ribbon-empty">
            {search ? 'No matches' : 'Empty history'}
          </div>
        )}
        
        {filteredHistory.slice(0, 100).map((item, idx) => (
          <div key={`${item.ts}-${idx}`} className="history-item">
            <div className="history-thumb" onClick={() => onItemClick(item)}>
              {item.type === 'image' ? (
                <img src={item.url} alt="" loading="lazy" />
              ) : (
                <div className="history-text-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
              )}
              <div className="history-meta">
                <span className="history-prompt">{item.prompt}</span>
                <span className="history-date">{new Date(item.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
            
            <div className="history-actions">
              <button title="Download" onClick={(e) => { e.stopPropagation(); onAction('Download', item); }}>
                {icons.download}
              </button>
              <button title="Copy Link" onClick={(e) => { e.stopPropagation(); onAction('Copy', item); }}>
                {icons.copy}
              </button>
              <button title="Remove" onClick={(e) => { e.stopPropagation(); onRemove(item); }} className="remove-btn">
                {icons.trash}
              </button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default memo(HistoryRibbon);