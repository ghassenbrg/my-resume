# Umami Analytics Integration

This project has been integrated with Umami analytics to track user interactions and page views.

## Setup

The Umami script has been added to `public/index.html`:

```html
<script defer src="https://umami.ghassen.io/analytics.js" 
        data-website-id="50b3cd1c-0757-4aac-bc88-ccbf97d38a19" 
        data-domains="ghassen.io,www.ghassen.io" 
        data-auto-track="true">
</script>
```

## Features

### Automatic Tracking
- **Page Views**: Automatically tracked on initial load
- **Section Views**: Automatically tracked when users scroll to different sections
- **Data Attributes**: Support for automatic event tracking using `data-umami-event` attributes

### Manual Event Tracking
Use the `useUmamiAnalytics` hook to track custom events:

```jsx
import { useUmamiAnalytics } from './hooks/useUmamiAnalytics';

const MyComponent = () => {
  const { trackEvent, trackSectionView } = useUmamiAnalytics();

  const handleClick = () => {
    trackEvent('button_click', {
      component: 'MyComponent',
      timestamp: new Date().toISOString()
    });
  };

  return <button onClick={handleClick}>Click me</button>;
};
```

## Available Tracking Functions

### `trackEvent(eventName, eventData)`
Track custom events with optional data:
```jsx
trackEvent('form_submit', { 
  formType: 'contact',
  source: 'hero_section'
});
```

### `trackSectionView(sectionName)`
Track when users view specific sections:
```jsx
trackSectionView('about');
```

### `trackPageView(url)`
Track page views (useful for SPA navigation):
```jsx
trackPageView('/about');
```

## Data Attributes for Automatic Tracking

Add these attributes to any element for automatic event tracking:

```html
<button data-umami-event="signup_click" data-umami-event-source="hero">
  Sign Up
</button>
```

## Currently Tracked Events

### Navigation
- `navigation_click` - When users click navigation items
- `logo_click` - When users click the logo/name
- `section_view` - When users scroll to different sections

### User Interactions
- `dark_mode_toggle` - When users toggle dark/light mode
- `contact_form_submit` - When users submit contact form
- `contact_form_success` - When contact form is successfully sent
- `contact_form_error` - When contact form fails
- `social_link_click` - When users click social media links
- `cv_download` - When users download the CV

### Custom Events
- `custom_button_click` - Example custom event
- `automatic_tracking` - Example of automatic tracking

## Analytics Dashboard

View your analytics data at: https://umami.ghassen.io

## Privacy

This implementation respects user privacy by:
- Not collecting personal information
- Only tracking anonymous user interactions
- Using Umami's privacy-focused analytics platform
- Complying with GDPR and other privacy regulations

## Troubleshooting

### Check if Umami is loaded
```jsx
if (window.umami?.track) {
  // Umami is available
  window.umami.track('event_name');
}
```

### Debug tracking
Open browser console and check for any errors related to the analytics script.

### Verify script loading
Check the Network tab in DevTools to ensure the analytics script loads successfully.
