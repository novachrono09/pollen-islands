import React, { useRef, useCallback, memo, useLayoutEffect } from 'react';
import Card from './Card';
import { useCanvasInteractions } from '../hooks/useCanvasInteractions';

const IslandCanvas = ({ items, onAction, onUpdateItem, onRemoveItem, onBringToFront, offset, scale, onOffsetChange, onScaleChange, showEmpty, onItemLoad }) => {
  const containerRef = useRef(null);
  const worldRef = useRef(null);
  const itemNodesRef = useRef({});

  const registerItemNode = useCallback((id, node) => {
    if (node) {
      itemNodesRef.current[id] = node;
    } else {
      delete itemNodesRef.current[id];
    }
  }, []);

  const { onPointerDown, onPointerMove, onPointerUp, onWheel, isPanning } = useCanvasInteractions({
    containerRef,
    worldRef,
    itemNodesRef,
    items,
    offset,
    scale,
    onOffsetChange,
    onScaleChange,
    onUpdateItem,
    onBringToFront
  });

  // Sync World Transform (Recenter/Initial)
  useLayoutEffect(() => {
    if (worldRef.current && !isPanning.current) {
      worldRef.current.style.transform = `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`;
    }
  }, [offset, scale, isPanning]);

  // Sync Item Transforms (Tidy Up/Initial)
  useLayoutEffect(() => {
    items.forEach(item => {
      const node = itemNodesRef.current[item.id];
      if (node) {
        node.style.transform = `translate3d(${item.x}px, ${item.y}px, 0)`;
      }
    });
  }, [items]);

  return (
    <div 
      className="canvas-container" 
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onWheel={onWheel}
      style={{ 
        cursor: isPanning.current ? 'grabbing' : 'grab', 
        touchAction: 'none'
      }}
    >
      <div 
        ref={worldRef}
        className="canvas-world"
        style={{ 
          transformOrigin: '0 0',
          position: 'absolute',
          inset: 0
        }}
      >
        <div 
          className="canvas-grid" 
          style={{ 
            backgroundImage: `radial-gradient(var(--orange) 0.8px, transparent 0.8px)`,
            backgroundSize: `${30}px ${30}px`,
            opacity: 0.1
          }}
        />

        {showEmpty && (
          <div className="empty-state hero-mode" style={{ pointerEvents: 'none' }}>
            <img src="/waguri_kaoruko.png" alt="Welcome" className="empty-img" />
            <div className="empty-content">
              <h2>Floating Island Studio</h2>
              <p>Drag to move, use the handle to resize. Your journey begins here.</p>
            </div>
          </div>
        )}

        {items.map((item) => (
          <div 
            key={item.id}
            data-id={item.id}
            ref={(node) => registerItemNode(item.id, node)}
            className="island-node"
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: item.w,
              zIndex: 2
            }}
          >
            <Card 
              item={item} 
              onAction={onAction} 
              onRemove={onRemoveItem}
              onItemLoad={onItemLoad}
            />
            <div className="node-resizer" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(IslandCanvas);