import { vi } from 'vitest'

export const setReducedMotion = (matches: boolean) => {
  vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
    matches: query === '(prefers-reduced-motion: reduce)' ? matches : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

export const createUmamiMock = () => {
  const track = vi.fn()

  Object.defineProperty(window, 'umami', {
    configurable: true,
    value: { track },
  })

  return track
}
