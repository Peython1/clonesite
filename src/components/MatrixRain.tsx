import React, { useRef, useEffect, useState } from 'react';
import { useEffectOnce } from '@/hooks/use-effect-once';
import { MatrixConfig } from '@/utils/interfaces';

interface MatrixRainProps {
  config: MatrixConfig;
}

const MatrixRain: React.FC<MatrixRainProps> = ({ config }) => {
  const { opacity, speed, color, density, enabled, fps = 30 } = config;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(enabled);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const dropsRef = useRef<{
    x: number;
    y: number;
    speed: number;
    length: number;
    chars: string[];
  }[]>([]);

  // Create a collection of matrix characters
  const matrixChars = Array.from(
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:,./<>?░▒▓█'
  );

  const initialize = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Initialize drops
    const columns = Math.floor(canvas.width / 20); // Character width approx 20px
    dropsRef.current = [];
    
    // Create initial drops based on density
    for (let i = 0; i < columns; i++) {
      if (Math.random() < density) {
        dropsRef.current.push({
          x: i * 20,
          y: Math.random() * canvas.height * -1, // Start above the screen at random heights
          speed: Math.random() * 2 + speed, // Randomize speed a bit
          length: Math.floor(Math.random() * 15) + 5, // Random length of each drop
          chars: Array(Math.floor(Math.random() * 15) + 5)
            .fill('')
            .map(() => matrixChars[Math.floor(Math.random() * matrixChars.length)])
        });
      }
    }
  };

  const draw = (time: number) => {
    if (!canvasRef.current || !isActive) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Calculate delta time for framerate independence
    if (previousTimeRef.current === undefined) {
      previousTimeRef.current = time;
    }
    const deltaTime = time - previousTimeRef.current;
    
    // Limit to desired FPS
    if (deltaTime < 1000 / fps) {
      requestRef.current = requestAnimationFrame(draw);
      return;
    }
    
    // Clear screen with semi-transparent black for trailing effect
    ctx.fillStyle = `rgba(0, 0, 0, 0.05)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set text properties
    ctx.fillStyle = color;
    ctx.font = '15px monospace';
    
    // Draw existing drops
    dropsRef.current.forEach((drop, i) => {
      // Draw the character string for this drop
      drop.chars.forEach((char, index) => {
        // Fade out characters as they go down the string
        const alpha = 1 - index / drop.chars.length;
        ctx.fillStyle = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${alpha})`;
        
        // Draw character
        const yPos = drop.y - index * 20; // 20px is char height
        if (yPos > 0 && yPos < canvas.height) {
          ctx.fillText(char, drop.x, yPos);
        }
      });
      
      // Update drop position
      drop.y += drop.speed;
      
      // Randomly change the front character
      if (Math.random() > 0.9) {
        drop.chars[0] = matrixChars[Math.floor(Math.random() * matrixChars.length)];
      }
      
      // If drop is fully off screen, reset it or remove based on density
      if (drop.y - (drop.chars.length * 20) > canvas.height) {
        if (Math.random() < density * 2) { // Higher chance to keep it than initial creation
          drop.y = -20;
          drop.speed = Math.random() * 2 + speed;
          drop.chars = Array(Math.floor(Math.random() * 15) + 5)
            .fill('')
            .map(() => matrixChars[Math.floor(Math.random() * matrixChars.length)]);
        } else {
          // Remove this drop
          dropsRef.current.splice(i, 1);
        }
      }
    });
    
    // Occasionally add new drops
    if (Math.random() < 0.03 * density && dropsRef.current.length < canvas.width / 20) {
      const x = Math.floor(Math.random() * (canvas.width / 20)) * 20;
      dropsRef.current.push({
        x,
        y: -20,
        speed: Math.random() * 2 + speed,
        length: Math.floor(Math.random() * 15) + 5,
        chars: Array(Math.floor(Math.random() * 15) + 5)
          .fill('')
          .map(() => matrixChars[Math.floor(Math.random() * matrixChars.length)])
      });
    }
    
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(draw);
  };

  const handleResize = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Reinitialize with new dimensions
    initialize();
  };

  const start = () => setIsActive(true);
  const stop = () => setIsActive(false);
  const setFpsRate = (newFps: number) => setFps(Math.max(1, Math.min(60, newFps)));

  useEffect(() => {
    if (isActive) {
      requestRef.current = requestAnimationFrame(draw);
      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    }
  }, [isActive, fps, color, speed, density]);

  useEffect(() => {
    setIsActive(enabled);
  }, [enabled]);

  useEffectOnce(() => {
    initialize();
    window.addEventListener('resize', handleResize);
    
    // Define the API on the window object for external access
    if (window) {
      (window as any).matrixRain = {
        start,
        stop,
        setFps: setFpsRate,
      };
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  });

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // Don't capture mouse events
        zIndex: -1, // Behind all UI elements
        opacity: opacity, // Adjustable opacity
      }}
    />
  );
};

export default MatrixRain;
