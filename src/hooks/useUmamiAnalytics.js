export function useUmamiAnalytics() {
  // Track section changes
  const trackSectionView = (sectionName) => {
    if (window.umami?.track) {
      window.umami.track('section_view', { section: sectionName });
    }
  };

  // Track custom events
  const trackEvent = (eventName, eventData = {}) => {
    if (window.umami?.track) {
      window.umami.track(eventName, eventData);
    }
  };

  // Track page view (useful for initial load)
  const trackPageView = (url = window.location.pathname) => {
    if (window.umami?.trackView) {
      window.umami.trackView(url);
    }
  };

  return {
    trackSectionView,
    trackEvent,
    trackPageView
  };
}
