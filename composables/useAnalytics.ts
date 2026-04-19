type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>

interface UmamiClient {
  track: (eventName: string, eventData?: AnalyticsPayload) => void
}

type AnalyticsWindow = Window & {
  umami?: UmamiClient
}

export const useAnalytics = () => {
  const isClient = import.meta.client

  const trackEvent = (eventName: string, eventData?: AnalyticsPayload) => {
    if (!isClient) {
      return false
    }

    const track = (window as AnalyticsWindow).umami?.track

    if (!track) {
      return false
    }

    track(eventName, eventData)
    return true
  }

  const trackLinkClick = (label: string, href: string) => {
    return trackEvent('link_click', {
      label,
      href,
    })
  }

  const trackSectionView = (section: string) => {
    return trackEvent('section_view', {
      section,
    })
  }

  return {
    trackEvent,
    trackLinkClick,
    trackSectionView,
  }
}
