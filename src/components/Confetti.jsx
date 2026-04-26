import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

const Confetti = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const particles = useRef([]);

  useImperativeHandle(ref, () => ({
    burst: (x, y) => {
      confettiBurst(x, y);
    }
  }));

  const confettiBurst = (x, y) => {
    const colors = ['#FF3B30', '#FF7A00', '#00C9A7', '#7B61FF', '#FFB800'];
    const count = 40;
    
    for (let i = 0; i < count; i++) {
      particles.current.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 1) * 12 - 2,
        size: Math.random() * 6 + 4,
        c: colors[Math.floor(Math.random() * colors.length)],
        r: Math.random() * 360,
        rv: (Math.random() - 0.5) * 10
      });
    }
    if (particles.current.length <= count) {
      requestAnimationFrame(loopConfetti);
    }
  };

  const loopConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (particles.current.length === 0) return;
    
    for (let i = particles.current.length - 1; i >= 0; i--) {
      let p = particles.current[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4; // gravity
      p.r += p.rv;
      
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r * Math.PI / 180);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
      
      if (p.y > canvas.height) {
        particles.current.splice(i, 1);
      }
    }
    requestAnimationFrame(loopConfetti);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();
    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas id="confetti" ref={canvasRef}></canvas>;
});

export default Confetti;