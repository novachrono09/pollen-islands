import React from 'react';
import Card from './Card';

const MasonryGrid = ({ items, onAction, showEmpty }) => {
  return (
    <main className="canvas">
      {showEmpty && (
        <div id="empty" className="empty-state">
          <img src="/waguri_kaoruko.png" alt="Waguri Kaoruko" className="empty-img" />
          <div className="empty-content">
            <h2>Floating Island Studio</h2>
            <p>Your images drift here like islands. Type below — not in a sidebar.</p>
          </div>
        </div>
      )}
      <div id="masonry" className="masonry">
        {items.map((item, idx) => (
          <Card key={`${item.url}-${idx}`} item={item} onAction={onAction} />
        ))}
      </div>
    </main>
  );
};

export default MasonryGrid;