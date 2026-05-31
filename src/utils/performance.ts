export class FPSCounter {
  private frames: number = 0;
  private lastTime: number = performance.now();
  public fps: number = 0;

  tick() {
    this.frames++;
    const now = performance.now();
    if (now - this.lastTime >= 1000) {
      this.fps = this.frames;
      this.frames = 0;
      this.lastTime = now;
    }
  }
}

export const fpsCounter = new FPSCounter();

export const isPageHidden = () => document.hidden;

// Simple throttle function
export function throttle<T extends (...args: unknown[]) => void>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function(this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
