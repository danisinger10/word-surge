export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
  size: number;
}

export function createParticles(
  x: number,
  y: number,
  count: number,
  colors: string[] = ['#22d3ee', '#f472b6', '#facc15']
): Particle[] {
  const particles: Particle[] = [];
  
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const speed = 2 + Math.random() * 3;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color,
      life: 1,
      maxLife: 0.5 + Math.random() * 0.5,
      size: 3 + Math.random() * 3,
    });
  }
  
  return particles;
}

export function updateParticles(particles: Particle[], deltaTime: number): Particle[] {
  return particles
    .map(p => ({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      vy: p.vy + 0.2, // Gravity
      life: p.life - deltaTime / 1000 / p.maxLife,
    }))
    .filter(p => p.life > 0);
}

export function createConfetti(count: number = 50): HTMLElement[] {
  const confettiElements: HTMLElement[] = [];
  const colors = ['#22d3ee', '#f472b6', '#facc15', '#4ade80', '#a78bfa'];
  
  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = `${Math.random() * 0.5}s`;
    confetti.style.animationDuration = `${2 + Math.random() * 2}s`;
    
    document.body.appendChild(confetti);
    confettiElements.push(confetti);
    
    // Remove after animation
    setTimeout(() => {
      confetti.remove();
    }, 4000);
  }
  
  return confettiElements;
}

export function shakeScreen(intensity: number = 1) {
  const root = document.getElementById('root');
  if (!root) return;
  
  root.style.animation = 'none';
  // Trigger reflow
  void root.offsetWidth;
  root.style.animation = `screen-shake ${0.3 * intensity}s ease-in-out`;
  
  setTimeout(() => {
    root.style.animation = '';
  }, 300 * intensity);
}

export function flashScreen(color: string = 'rgba(255, 255, 255, 0.3)') {
  const flash = document.createElement('div');
  flash.style.position = 'fixed';
  flash.style.inset = '0';
  flash.style.backgroundColor = color;
  flash.style.pointerEvents = 'none';
  flash.style.zIndex = '9999';
  flash.style.animation = 'flash 0.3s ease-out';
  
  document.body.appendChild(flash);
  
  setTimeout(() => {
    flash.remove();
  }, 300);
}

// Add flash animation to the document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes flash {
      0% { opacity: 1; }
      100% { opacity: 0; }
    }
    @keyframes screen-shake {
      0%, 100% { transform: translate(0, 0); }
      10% { transform: translate(-2px, 2px); }
      20% { transform: translate(2px, -2px); }
      30% { transform: translate(-2px, -2px); }
      40% { transform: translate(2px, 2px); }
      50% { transform: translate(-2px, 2px); }
      60% { transform: translate(2px, -2px); }
      70% { transform: translate(-2px, -2px); }
      80% { transform: translate(2px, 2px); }
      90% { transform: translate(-2px, 2px); }
    }
  `;
  document.head.appendChild(style);
}
