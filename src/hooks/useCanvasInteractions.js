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
  onBringToFront,
  onMove // New optional callback for real-time coords
}) {
  const isDragging = useRef(false);
  const isPanning = useRef(false);
  const isResizing = useRef(false);
  const activeItemId = useRef(null);
  
  // High-frequency refs
  const currentView = useRef({ x: offset.x, y: offset.y, scale: scale });
  const pointers = useRef(new Map()); // Track all active pointers (fingers/mouse)
  const lastPinchDist = useRef(0);
  const lastPinchMid = useRef({ x: 0, y: 0 });

  // Start state refs
  const startCoords = useRef({ x: 0, y: 0 });
  const initialItemState = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const initialView = useRef({ x: 0, y: 0, scale: 1 });

  const updateDOM = useCallback(() => {
    if (worldRef.current) {
      worldRef.current.style.transform = `translate3d(${currentView.current.x}px, ${currentView.current.y}px, 0) scale(${currentView.current.scale})`;
    }
    if (onMove) {
      onMove({ x: currentView.current.x, y: currentView.current.y });
    }
  }, [worldRef, onMove]);

  // Keep Ref in sync with external state changes (like buttons)
  useEffect(() => {
    if (pointers.current.size === 0 && !isDragging.current && !isResizing.current) {
      currentView.current = { x: offset.x, y: offset.y, scale: scale };
      updateDOM();
    }
  }, [offset.x, offset.y, scale, updateDOM]);

  const getPointerCenter = (pts) => {
    const values = Array.from(pts.values());
    return {
      x: values.reduce((sum, p) => sum + p.clientX, 0) / values.length,
      y: values.reduce((sum, p) => sum + p.clientY, 0) / values.length
    };
  };

  const getPointerDist = (pts) => {
    const values = Array.from(pts.values());
    if (values.length < 2) return 0;
    return Math.hypot(values[0].clientX - values[1].clientX, values[0].clientY - values[1].clientY);
  };

  const onPointerDown = useCallback((e) => {
    pointers.current.set(e.pointerId, e);
    const container = containerRef.current;
    if (container) container.setPointerCapture(e.pointerId);

    const isBackground = e.target.classList.contains('canvas-container') || e.target.classList.contains('canvas-grid') || e.target.classList.contains('canvas-world');
    const resizer = e.target.closest('.node-resizer');
    const node = e.target.closest('.island-node');

    if (pointers.current.size === 1) {
      if (resizer && node) {
        const id = node.dataset.id;
        const item = items.find(it => it.id === id);
        if (item) {
          isResizing.current = true;
          activeItemId.current = id;
          startCoords.current = { x: e.clientX, y: e.clientY };
          initialItemState.current = { x: item.x, y: item.y, w: item.w, h: item.h || item.w };
          onBringToFront(id);
        }
      } else if (node && !e.target.closest('.card-toolbar')) {
        const id = node.dataset.id;
        const item = items.find(it => it.id === id);
        if (item) {
          isDragging.current = true;
          activeItemId.current = id;
          startCoords.current = { x: e.clientX, y: e.clientY };
          initialItemState.current = { x: item.x, y: item.y, w: item.w, h: item.h || item.w };
          onBringToFront(id);
        }
      } else if (isBackground || e.button === 1 || (e.button === 0 && e.shiftKey)) {
        isPanning.current = true;
        startCoords.current = { x: e.clientX, y: e.clientY };
        initialView.current = { ...currentView.current };
      }
    } else if (pointers.current.size === 2) {
      // Switch to pinch mode
      isPanning.current = true; // Still "panning" the camera
      isDragging.current = false;
      isResizing.current = false;
      lastPinchDist.current = getPointerDist(pointers.current);
      lastPinchMid.current = getPointerCenter(pointers.current);
      initialView.current = { ...currentView.current };
    }
  }, [items, onBringToFront, containerRef]);

  const onPointerMove = useCallback((e) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, e);

    if (pointers.current.size === 1) {
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
    } else if (pointers.current.size === 2) {
      // Multi-touch Zoom
      const newDist = getPointerDist(pointers.current);
      const newMid = getPointerCenter(pointers.current);
      
      const zoomFactor = newDist / lastPinchDist.current;
      const newScale = Math.min(Math.max(initialView.current.scale * zoomFactor, 0.1), 3);
      
      const actualFactor = newScale / currentView.current.scale;
      
      // Rectify center point relative to container
      const rect = containerRef.current.getBoundingClientRect();
      const midX = newMid.x - rect.left;
      const midY = newMid.y - rect.top;

      const nextX = midX - (midX - currentView.current.x) * actualFactor;
      const nextY = midY - (midY - currentView.current.y) * actualFactor;

      currentView.current = { x: nextX, y: nextY, scale: newScale };
      updateDOM();
      
      // Update store for percentage UI
      onScaleChange(newScale);
    }
  }, [updateDOM, itemNodesRef, containerRef, onScaleChange]);

  const onPointerUp = useCallback((e) => {
    if (pointers.current.size === 1 && isPanning.current) {
      onOffsetChange({ x: currentView.current.x, y: currentView.current.y });
    } else if (pointers.current.size === 1 && isDragging.current && activeItemId.current) {
      const deltaX = e.clientX - startCoords.current.x;
      const deltaY = e.clientY - startCoords.current.y;
      const s = currentView.current.scale;
      onUpdateItem(activeItemId.current, { 
        x: initialItemState.current.x + (deltaX / s), 
        y: initialItemState.current.y + (deltaY / s) 
      });
    } else if (pointers.current.size === 1 && isResizing.current && activeItemId.current) {
      const deltaX = e.clientX - startCoords.current.x;
      const finalW = Math.max(150, initialItemState.current.w + (deltaX / currentView.current.scale));
      const ratio = initialItemState.current.h / initialItemState.current.w;
      onUpdateItem(activeItemId.current, { w: finalW, h: finalW * ratio });
    } else if (pointers.current.size === 2) {
      onOffsetChange({ x: currentView.current.x, y: currentView.current.y });
      onScaleChange(currentView.current.scale);
    }

    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) {
      isDragging.current = false;
      isPanning.current = false;
      isResizing.current = false;
      activeItemId.current = null;
    }
  }, [onOffsetChange, onScaleChange, onUpdateItem]);

  const onWheel = useCallback((e) => {
    e.preventDefault();
    const zoomSpeed = 0.0015;
    const delta = -e.deltaY;
    const newScale = Math.min(Math.max(currentView.current.scale + delta * zoomSpeed, 0.1), 3);
    
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = newScale / currentView.current.scale;
    const nextX = mouseX - (mouseX - currentView.current.x) * zoomFactor;
    const nextY = mouseY - (mouseY - currentView.current.y) * zoomFactor;

    currentView.current = { x: nextX, y: nextY, scale: newScale };
    updateDOM();

    onScaleChange(newScale);
    onOffsetChange({ x: nextX, y: nextY });
  }, [onScaleChange, onOffsetChange, containerRef, updateDOM]);

  return { onPointerDown, onPointerMove, onPointerUp, onWheel, isPanning };
}
