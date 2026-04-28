import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAnalytics } from '~/composables/useAnalytics'

vi.stubGlobal('useState', vi.fn())

describe('useAnalytics', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns false when the analytics client is unavailable', () => {
    const { trackEvent } = useAnalytics()

    expect(trackEvent('section_view', { section: 'about' })).toBe(false)
  })

  it('emits documented events and strips sensitive payload keys', () => {
    const track = vi.fn()

    Object.defineProperty(window, 'umami', {
      configurable: true,
      value: { track },
    })

    const { trackEvent } = useAnalytics()

    expect(
      trackEvent('contact_form_error', {
        source: 'contact_terminal',
        reason: 'network',
        email: 'visitor@example.com',
        message: 'private message',
      }),
    ).toBe(true)
    expect(track).toHaveBeenCalledWith('contact_form_error', {
      source: 'contact_terminal',
      reason: 'network',
    })
  })
})
