import { useRef, useCallback, useEffect } from 'react';

export function useCanvasInteractions({
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
}) {
  const isDragging = useRef(false);
  const isPanning = useRef(false);
  const isResizing = useRef(false);
  const activeItemId = useRef(null);
  const lastPinchDistance = useRef(null);
  const zoomSyncTimeout = useRef(null);
  
  // High-frequency refs - Single source of truth during interaction
  const currentView = useRef({ x: offset.x, y: offset.y, scale: scale });
  
  // Start state refs
  const startCoords = useRef({ x: 0, y: 0 });
  const initialItemState = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const initialView = useRef({ x: 0, y: 0, scale: 1 });

  // Update visual state imperatively
  const updateDOM = useCallback(() => {
    if (worldRef.current) {
      worldRef.current.style.transform = `translate3d(${currentView.current.x}px, ${currentView.current.y}px, 0) scale(${currentView.current.scale})`;
    }
  }, [worldRef]);

  // Sync refs when props change
  useEffect(() => {
    // Only block sync if we are actively dragging/panning
    if (!isPanning.current && !isDragging.current && !isResizing.current) {
      currentView.current = { x: offset.x, y: offset.y, scale: scale };
      updateDOM();
    }
  }, [offset.x, offset.y, scale, updateDOM]);

  const getDistance = (touches) => Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);

  const onPointerDown = useCallback((e) => {
    if (zoomSyncTimeout.current) {
      clearTimeout(zoomSyncTimeout.current);
      zoomSyncTimeout.current = null;
    }

    const isBackground = e.target.classList.contains('canvas-container') || e.target.classList.contains('canvas-grid') || e.target.classList.contains('canvas-world');
    const resizer = e.target.closest('.node-resizer');
    const node = e.target.closest('.island-node');

    if (resizer && node) {
      const id = node.dataset.id;
      const item = items.find(it => it.id === id);
      if (!item) return;
      isResizing.current = true;
      activeItemId.current = id;
      startCoords.current = { x: e.clientX, y: e.clientY };
      initialItemState.current = { x: item.x, y: item.y, w: item.w, h: item.h || item.w };
      onBringToFront(id);
      if (itemNodesRef.current[id]) {
        itemNodesRef.current[id].style.zIndex = 1000;
      }
      if (containerRef.current) containerRef.current.setPointerCapture(e.pointerId);
      e.stopPropagation();
    } else if (node && !e.target.closest('.card-toolbar')) {
      const id = node.dataset.id;
      const item = items.find(it => it.id === id);
      if (!item) return;
      isDragging.current = true;
      activeItemId.current = id;
      startCoords.current = { x: e.clientX, y: e.clientY };
      initialItemState.current = { x: item.x, y: item.y, w: item.w, h: item.h || item.w };
      onBringToFront(id);
      if (itemNodesRef.current[id]) {
        itemNodesRef.current[id].style.zIndex = 1000;
      }
      if (containerRef.current) containerRef.current.setPointerCapture(e.pointerId);
      e.stopPropagation();
    } else if (isBackground || e.button === 1 || (e.button === 0 && e.shiftKey)) {
      isPanning.current = true;
      startCoords.current = { x: e.clientX, y: e.clientY };
      initialView.current = { ...currentView.current };
      if (worldRef.current) worldRef.current.style.willChange = 'transform';
      if (containerRef.current) containerRef.current.setPointerCapture(e.pointerId);
    }
  }, [items, onBringToFront, containerRef, itemNodesRef, worldRef]);

  const onPointerMove = useCallback((e) => {
    if (!isDragging.current && !isPanning.current && !isResizing.current) return;

    const deltaX = e.clientX - startCoords.current.x;
    const deltaY = e.clientY - startCoords.current.y;

    if (isPanning.current) {
      currentView.current.x = initialView.current.x + deltaX;
      currentView.current.y = initialView.current.y + deltaY;
      updateDOM();
    } else if (isDragging.current && activeItemId.current) {
      const s = currentView.current.scale;
      const nextX = initialItemState.current.x + (deltaX / s);
      const nextY = initialItemState.current.y + (deltaY / s);
      const node = itemNodesRef.current[activeItemId.current];
      if (node) node.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;
    } else if (isResizing.current && activeItemId.current) {
      const nextW = Math.max(150, initialItemState.current.w + (deltaX / currentView.current.scale));
      const node = itemNodesRef.current[activeItemId.current];
      if (node) node.style.width = `${nextW}px`;
    }
  }, [updateDOM, itemNodesRef]);

  const onPointerUp = useCallback((e) => {
    if (isPanning.current) {
      if (worldRef.current) worldRef.current.style.willChange = 'auto';
      onOffsetChange({ x: currentView.current.x, y: currentView.current.y });
    } else if (isDragging.current && activeItemId.current) {
      const deltaX = e.clientX - startCoords.current.x;
      const deltaY = e.clientY - startCoords.current.y;
      const s = currentView.current.scale;
      const finalX = initialItemState.current.x + (deltaX / s);
      const finalY = initialItemState.current.y + (deltaY / s);
      onUpdateItem(activeItemId.current, { x: finalX, y: finalY });
      const node = itemNodesRef.current[activeItemId.current];
      if (node) {
        node.style.zIndex = 2;
        node.style.willChange = 'auto';
      }
    } else if (isResizing.current && activeItemId.current) {
      const deltaX = e.clientX - startCoords.current.x;
      const finalW = Math.max(150, initialItemState.current.w + (deltaX / currentView.current.scale));
      const ratio = initialItemState.current.h / initialItemState.current.w;
      onUpdateItem(activeItemId.current, { w: finalW, h: finalW * ratio });
      const node = itemNodesRef.current[activeItemId.current];
      if (node) {
        node.style.zIndex = 2;
        node.style.willChange = 'auto';
      }
    }

    isDragging.current = false;
    isPanning.current = false;
    isResizing.current = false;
    activeItemId.current = null;
    
    if (containerRef.current && e.pointerId) {
      try { containerRef.current.releasePointerCapture(e.pointerId); } catch { /* ignore */ }
    }
  }, [onOffsetChange, onUpdateItem, containerRef, itemNodesRef, worldRef]);

  const onWheel = useCallback((e) => {
    e.preventDefault();
    const zoomSpeed = 0.0015;
    const delta = -e.deltaY;
    const newScale = Math.min(Math.max(currentView.current.scale + delta * zoomSpeed, 0.1), 3);
    
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = newScale / currentView.current.scale;
    const nextX = mouseX - (mouseX - currentView.current.x) * zoomFactor;
    const nextY = mouseY - (mouseY - currentView.current.y) * zoomFactor;

    currentView.current = { x: nextX, y: nextY, scale: newScale };
    updateDOM();

    if (zoomSyncTimeout.current) clearTimeout(zoomSyncTimeout.current);
    zoomSyncTimeout.current = setTimeout(() => {
      onScaleChange(newScale);
      onOffsetChange({ x: nextX, y: nextY });
      zoomSyncTimeout.current = null;
    }, 150);
  }, [onScaleChange, onOffsetChange, containerRef, updateDOM]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    
    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dist = getDistance(e.touches);
        if (lastPinchDistance.current) {
          const delta = dist - lastPinchDistance.current;
          const newScale = Math.min(Math.max(currentView.current.scale + delta * 0.006, 0.1), 3);
          
          const zoomFactor = newScale / currentView.current.scale;
          const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
          const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
          
          const rect = el.getBoundingClientRect();
          const nextX = (midX - rect.left) - ((midX - rect.left) - currentView.current.x) * zoomFactor;
          const nextY = (midY - rect.top) - ((midY - rect.top) - currentView.current.y) * zoomFactor;

          currentView.current = { x: nextX, y: nextY, scale: newScale };
          updateDOM();
        }
        lastPinchDistance.current = dist;
      }
    };
    
    const handleTouchEnd = () => {
      if (lastPinchDistance.current) {
        onScaleChange(currentView.current.scale);
        onOffsetChange({ x: currentView.current.x, y: currentView.current.y });
      }
      lastPinchDistance.current = null;
    };

    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd);
    return () => {
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onScaleChange, onOffsetChange, containerRef, updateDOM]);

  return { onPointerDown, onPointerMove, onPointerUp, onWheel, isPanning };
}