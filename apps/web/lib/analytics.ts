/**
 * Analytics event tracking for the landing page
 */

export type AnalyticsEvent = 
  | 'cta_run_verify_clicked'
  | 'cta_start_building_clicked' 
  | 'cta_accept_run_clicked'
  | 'hash_copied'
  | 'model_card_clicked'
  | 'repo_card_clicked'
  | 'proof_runway_step_hovered'

interface AnalyticsProperties {
  [key: string]: string | number | boolean
}

export function trackEvent(event: AnalyticsEvent, properties?: AnalyticsProperties) {
  // This would integrate with your analytics provider (Mixpanel, Amplitude, etc.)
  if (typeof window !== 'undefined') {
    // Example integration:
    console.log('Analytics Event:', event, properties)
    
    // Mixpanel example:
    // window.mixpanel?.track(event, properties)
    
    // Amplitude example:
    // window.amplitude?.track(event, properties)
    
    // Google Analytics example:
    // window.gtag?.('event', event, properties)
  }
}

export function trackPageView(page: string) {
  if (typeof window !== 'undefined') {
    console.log('Page View:', page)
    // Track page views with your analytics provider
  }
}
