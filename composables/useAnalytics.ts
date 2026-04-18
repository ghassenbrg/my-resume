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
      return
    }

    ;(window as AnalyticsWindow).umami?.track(eventName, eventData)
  }

  const trackLinkClick = (label: string, href: string) => {
    trackEvent('link_click', {
      label,
      href,
    })
  }

  return {
    trackEvent,
    trackLinkClick,
  }
}
