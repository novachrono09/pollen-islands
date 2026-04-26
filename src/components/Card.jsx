import React, { useState } from 'react';

const Card = ({ item, onAction, onRemove, onItemLoad }) => {
  const [imgLoading, setImgLoading] = useState(item.type === 'image');
  const loading = item.isPending || imgLoading;
  const error = item.error || false;

  return (
    <div className={`card ${loading && !error ? 'loading' : ''} type-${item.type || 'image'} ${error ? 'has-error' : ''}`}>
      <div className="card-inner">
        {loading && !error && <div className="shimmer"></div>}
        
        {item.type === 'image' ? (
          error ? (
            <div className="card-error-state">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>Failed to load</span>
              <small>{item.error || 'Check API key permissions'}</small>
            </div>
          ) : item.url ? (
            <img 
              alt={item.prompt?.replace(/"/g, '')} 
              src={item.url} 
              loading="lazy" 
              onLoad={() => {
                setImgLoading(false);
                if (onItemLoad) onItemLoad(item);
              }}
              onError={() => {
                setImgLoading(false);
                if (onItemLoad) onItemLoad(item, 'Failed to load image');
              }}
            />
          ) : null
        ) : (
          error ? (
            <div className="card-error-state">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>Failed to generate</span>
              <small>{item.error || 'Check API key permissions'}</small>
            </div>
          ) : (
            <div className="card-text-content">
              <div className="text-header">
                <span className="model-badge">{item.model}</span>
              </div>
              <div className="text-body">
                {item.content}
              </div>
            </div>
          )
        )}
        
        {!error && !loading && (
          <div className="card-toolbar">
            {item.type === 'image' && (
              <button title="Download" aria-label="Download" onClick={(e) => { e.stopPropagation(); onAction('Download', item); }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </button>
            )}
            <button title="Copy" aria-label="Copy" onClick={(e) => { e.stopPropagation(); onAction('Copy', item); }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
            <button title="Regen" aria-label="Regenerate" onClick={(e) => { e.stopPropagation(); onAction('Regen', item); }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            </button>
            <button title="Remove" aria-label="Remove" onClick={(e) => { e.stopPropagation(); onRemove(); }} className="remove-btn">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        )}
        <div className="card-caption">
          {item.prompt}
        </div>
      </div>
    </div>
  );
};

export default Card;