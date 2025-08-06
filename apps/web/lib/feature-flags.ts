/**
 * Feature Flag System for Precision-Glass Soft-UI Theme Rollout
 * Simple URL-based feature flags for gradual deployment
 */

export type FeatureFlags = {
  precisionGlassTheme: boolean;
  softUIControls: boolean;
  pastelAccents: boolean;
}

export function getFeatureFlags(): FeatureFlags {
  if (typeof window === 'undefined') {
    return {
      precisionGlassTheme: false,
      softUIControls: false,
      pastelAccents: false,
    };
  }

  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    // Enable with ?theme=precision-glass
    precisionGlassTheme: urlParams.get('theme') === 'precision-glass' || urlParams.get('theme') === 'new',
    
    // Enable with ?controls=soft
    softUIControls: urlParams.get('controls') === 'soft' || urlParams.get('theme') === 'new',
    
    // Enable with ?accents=pastel
    pastelAccents: urlParams.get('accents') === 'pastel' || urlParams.get('theme') === 'new',
  };
}

export function useFeatureFlags() {
  const flags = getFeatureFlags();
  
  return {
    ...flags,
    // Helper to generate theme classes conditionally
    getThemeClasses: (defaultClasses: string, themeClasses: string) => {
      return flags.precisionGlassTheme ? themeClasses : defaultClasses;
    },
    
    // Helper for soft-UI controls
    getSoftUIClasses: (defaultClasses: string) => {
      return flags.softUIControls ? `${defaultClasses} soft-ui` : defaultClasses;
    },
    
    // Helper for pastel accents
    getPastelClasses: (defaultClasses: string, pastelClasses: string) => {
      return flags.pastelAccents ? pastelClasses : defaultClasses;
    }
  };
}

// Development helper - logs active feature flags
export function logActiveFlags() {
  if (process.env.NODE_ENV === 'development') {
    const flags = getFeatureFlags();
    const activeFlags = Object.entries(flags).filter(([_, active]) => active);
    
    if (activeFlags.length > 0) {
      console.log('🎨 Active theme flags:', activeFlags.map(([flag]) => flag).join(', '));
    }
  }
}
