import '@testing-library/jest-dom'

// Canvas mock for game tests — includes all methods used by rendering code
HTMLCanvasElement.prototype.getContext = () =>
  ({
    // Drawing methods
    fillRect: () => {},
    strokeRect: () => {},
    clearRect: () => {},
    drawImage: () => {},
    putImageData: () => {},
    getImageData: (_x: number, _y: number, w: number, h: number) => ({
      data: new Uint8ClampedArray(w * h * 4),
    }),
    createImageData: () => ({ data: new Uint8ClampedArray(4) }),
    // Path methods
    beginPath: () => {},
    closePath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    arc: () => {},
    ellipse: () => {},
    rect: () => {},
    fill: () => {},
    stroke: () => {},
    clip: () => {},
    // Text
    fillText: () => {},
    strokeText: () => {},
    measureText: () => ({ width: 0 }),
    // Transform
    save: () => {},
    restore: () => {},
    setTransform: () => {},
    translate: () => {},
    rotate: () => {},
    scale: () => {},
    // Gradients
    createLinearGradient: () => ({ addColorStop: () => {} }),
    createRadialGradient: () => ({ addColorStop: () => {} }),
    // Properties (writable via Proxy-like behavior)
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    font: '10px sans-serif',
    textAlign: 'start',
    textBaseline: 'alphabetic',
    globalAlpha: 1,
    shadowColor: 'transparent',
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    globalCompositeOperation: 'source-over',
    imageSmoothingEnabled: true,
  }) as unknown as CanvasRenderingContext2D

// localStorage mock with full Map-backed implementation
const localStorageMock = (() => {
  const store = new Map<string, string>()
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
    key: (index: number) => [...store.keys()][index] ?? null,
    get length() {
      return store.size
    },
  }
})()

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Audio mock
globalThis.Audio = class {
  src = ''
  volume = 1
  currentTime = 0
  loop = false
  play() {
    return Promise.resolve()
  }
  pause() {}
  load() {}
} as unknown as typeof Audio
