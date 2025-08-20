import React from 'react';
import { useUmamiAnalytics } from '../hooks/useUmamiAnalytics';

const ExampleAnalytics = () => {
  const { trackEvent } = useUmamiAnalytics();

  const handleCustomEvent = () => {
    trackEvent('custom_button_click', {
      component: 'ExampleAnalytics',
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Analytics Examples</h3>
      
      {/* Manual event tracking */}
      <button
        onClick={handleCustomEvent}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Track Custom Event
      </button>

      {/* Automatic event tracking with data attributes */}
      <button
        data-umami-event="automatic_tracking"
        data-umami-event-source="example_component"
        className="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Automatic Tracking
      </button>
    </div>
  );
};

export default ExampleAnalytics;
