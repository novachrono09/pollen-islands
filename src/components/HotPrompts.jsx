import React, { memo } from 'react';

const HotPrompts = ({ onSelect }) => {
  const prompts = [
    { label: 'cyberpunk city', p: 'cyberpunk city at night, neon rain, Chinese lanterns' },
    { label: 'studio ghibli', p: 'studio ghibli floating island, jade mountains' },
    { label: 'isometric room', p: 'isometric room, cozy, paper lantern light' },
    { label: 'film still', p: 'film still, vermillion temple, mist' }
  ];

  return (
    <div className="hot-prompts" id="hotPrompts">
      {prompts.map((h, i) => (
        <button key={i} className="hot" onClick={() => onSelect(h.p)}>{h.label}</button>
      ))}
    </div>
  );
};

export default memo(HotPrompts);