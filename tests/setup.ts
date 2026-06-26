import '@testing-library/jest-dom'

// Canvas mock for game tests
HTMLCanvasElement.prototype.getContext = () =>
  ({
    fillRect: () => {},
    clearRect: () => {},
    getImageData: (_x: number, _y: number, w: number, h: number) => ({
      data: new Uint8ClampedArray(w * h * 4),
    }),
    putImageData: () => {},
    createImageData: () => ({ data: new Uint8ClampedArray(4) }),
    setTransform: () => {},
    drawImage: () => {},
    save: () => {},
    fillText: () => {},
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => {},
    translate: () => {},
    rotate: () => {},
    scale: () => {},
    arc: () => {},
    fill: () => {},
    measureText: () => ({ width: 0 }),
    createLinearGradient: () => ({ addColorStop: () => {} }),
    createRadialGradient: () => ({ addColorStop: () => {} }),
    rect: () => {},
    clip: () => {},
    setFillStyle: () => {},
    setStrokeStyle: () => {},
    setFont: () => {},
    setLineWidth: () => {},
    setGlobalAlpha: () => {},
    setTextAlign: () => {},
    setTextBaseline: () => {},
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
  play() {}
  pause() {}
} as unknown as typeof Audio
