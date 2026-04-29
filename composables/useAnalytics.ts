export type AnalyticsEventName =
  | 'navigation_click'
  | 'section_view'
  | 'contact_form_submit'
  | 'contact_form_success'
  | 'contact_form_error'
  | 'follow_up_click'
  | 'language_auto_resolved'
  | 'language_switched'

export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>

interface UmamiClient {
  track: (eventName: string, eventData?: AnalyticsPayload) => void
}

type AnalyticsWindow = Window & {
  umami?: UmamiClient
}

export const useAnalytics = () => {
  const isClient = typeof window !== 'undefined'

  const sanitizePayload = (eventData?: AnalyticsPayload) => {
    if (!eventData) {
      return undefined
    }

    return Object.fromEntries(
      Object.entries(eventData).filter(([key, value]) => {
        return key !== 'message' && key !== 'email' && value !== undefined
      }),
    )
  }

  const trackEvent = (eventName: AnalyticsEventName, eventData?: AnalyticsPayload) => {
    if (!isClient) {
      return false
    }

    const track = (window as AnalyticsWindow).umami?.track

    if (!track) {
      return false
    }

    track(eventName, sanitizePayload(eventData))
    return true
  }

  const trackFollowUpClick = (label: string, href: string) => {
    return trackEvent('follow_up_click', {
      label,
      destination: href.startsWith('mailto:') ? 'email' : href,
    })
  }

  const trackSectionView = (section: string) => {
    return trackEvent('section_view', {
      section,
    })
  }

  return {
    trackEvent,
    trackFollowUpClick,
    trackSectionView,
  }
}
