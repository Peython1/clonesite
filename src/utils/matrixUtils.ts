
/**
 * Matrix Rain effect utilities
 * Contains helper functions for the Matrix Rain effect
 */

// Create a collection of matrix characters
export const matrixChars = Array.from(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:,./<>?░▒▓█'
);

export interface MatrixDrop {
  x: number;
  y: number;
  speed: number;
  length: number;
  chars: string[];
}

/**
 * Initialize matrix drops based on canvas dimensions and configuration
 */
export const initializeDrops = (
  canvas: HTMLCanvasElement,
  density: number,
  speed: number
): MatrixDrop[] => {
  // Calculate how many columns we need based on width
  const columns = Math.floor(canvas.width / 20); // Character width approx 20px
  const drops: MatrixDrop[] = [];
  
  // Create initial drops based on density
  for (let i = 0; i < columns; i++) {
    if (Math.random() < density) {
      drops.push({
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
  
  return drops;
};

/**
 * Draw a single frame of the matrix rain
 */
export const drawMatrixFrame = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  drops: MatrixDrop[],
  color: string,
  density: number,
  speed: number
): MatrixDrop[] => {
  // Clear screen with semi-transparent black for trailing effect
  ctx.fillStyle = `rgba(0, 0, 0, 0.05)`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Set text properties
  ctx.font = '15px monospace';
  
  // Draw existing drops
  const updatedDrops = [...drops];
  
  updatedDrops.forEach((drop, i) => {
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
        updatedDrops.splice(i, 1);
      }
    }
  });
  
  // Occasionally add new drops
  if (Math.random() < 0.03 * density && updatedDrops.length < canvas.width / 20) {
    const x = Math.floor(Math.random() * (canvas.width / 20)) * 20;
    updatedDrops.push({
      x,
      y: -20,
      speed: Math.random() * 2 + speed,
      length: Math.floor(Math.random() * 15) + 5,
      chars: Array(Math.floor(Math.random() * 15) + 5)
        .fill('')
        .map(() => matrixChars[Math.floor(Math.random() * matrixChars.length)])
    });
  }
  
  return updatedDrops;
};
