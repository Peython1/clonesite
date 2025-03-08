
import React, { useRef, useEffect, useState } from 'react';
import { useEffectOnce } from '@/hooks/use-effect-once';
import { MatrixConfig } from '@/utils/interfaces';
import { MatrixDrop, initializeDrops, drawMatrixFrame } from '@/utils/matrixUtils';

interface MatrixRainProps {
  config: MatrixConfig;
}

const MatrixRain: React.FC<MatrixRainProps> = ({ config }) => {
  const { opacity, speed, color, density, enabled, fps = 30 } = config;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(enabled);
  const [fpsRate, setFpsRate] = useState(fps);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const dropsRef = useRef<MatrixDrop[]>([]);

  const initialize = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    dropsRef.current = initializeDrops(canvas, density, speed);
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
    if (deltaTime < 1000 / fpsRate) {
      requestRef.current = requestAnimationFrame(draw);
      return;
    }
    
    // Draw the matrix frame and get updated drops
    dropsRef.current = drawMatrixFrame(ctx, canvas, dropsRef.current, color, density, speed);
    
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(draw);
  };

  const handleResize = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    initialize();
  };

  // API methods
  const start = () => setIsActive(true);
  const stop = () => setIsActive(false);
  const setFps = (newFps: number) => setFpsRate(Math.max(1, Math.min(60, newFps)));

  // Effect for animation frame
  useEffect(() => {
    if (isActive) {
      requestRef.current = requestAnimationFrame(draw);
      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    }
  }, [isActive, fpsRate, color, speed, density]);

  // Effects for config changes
  useEffect(() => {
    setIsActive(enabled);
  }, [enabled]);

  useEffect(() => {
    setFpsRate(fps || 30);
  }, [fps]);

  // Setup and cleanup
  useEffectOnce(() => {
    initialize();
    window.addEventListener('resize', handleResize);
    
    // Define the API on the window object for external access
    if (window) {
      (window as any).matrixRain = {
        start,
        stop,
        setFps,
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
