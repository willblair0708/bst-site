/**
 * Analytics event tracking for the landing page
 * Updated for Design.mdc v0.4
 */

export type AnalyticsEvent = 
  | 'cta_run_verify_clicked'
  | 'cta_start_building_clicked' 
  | 'cta_accept_run_clicked'
  | 'hash_copied'
  | 'model_card_clicked'
  | 'repo_card_clicked'
  | 'proof_runway_step_hovered'
  | 'verify_button_demo'
  // Mission page events
  | 'mission_view'
  | 'cta_reproduce_click'
  | 'cta_propose_program_click'
  | 'cta_policy_template_click'
  | 'case_receipt_open'
  | 'pillar_card_click'

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
    // Also emit mission_view if relevant
    if (page === '/mission') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).mixpanel?.track?.('mission_view')
      console.log('Analytics Event:', 'mission_view')
    }
    // Track page views with your analytics provider
  }
}
