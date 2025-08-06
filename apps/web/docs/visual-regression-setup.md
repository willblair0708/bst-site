# Visual Regression Testing Setup for Precision-Glass Soft-UI Theme

## Overview
This document outlines the setup for visual regression testing to ensure the new theme implementation maintains visual consistency across deployments.

## Required Tools

### 1. Storybook Setup
```bash
# Install Storybook
npx storybook@latest init

# Add essential addons
npm install --save-dev @storybook/addon-controls @storybook/addon-viewport @storybook/addon-backgrounds
```

### 2. Percy Integration
```bash
# Install Percy CLI
npm install --save-dev @percy/cli @percy/storybook

# Add to package.json scripts
"percy:storybook": "percy storybook http://localhost:6006"
```

## Key Components to Test

### 1. Glass Components
- `Card` with `variant="glass"`
- `Button` with soft-UI styling
- `Badge` components
- Hero section with glass wrapper

### 2. Theme Variants
Test each component in:
- Light mode (default)
- Dark mode
- With feature flags enabled (`?theme=precision-glass`)
- Mobile viewport (ensures blur fallbacks work)

## Storybook Stories Template

```typescript
// components/ui/Button.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    backgrounds: {
      values: [
        { name: 'light', value: '#F4F4F2' },
        { name: 'dark', value: '#0F1116' }
      ]
    }
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default'
  }
};

export const SoftUI: Story = {
  args: {
    children: 'Soft UI Button',
    variant: 'default',
    className: 'soft-ui'
  }
};
```

## Percy Configuration

Create `.percy.yml`:
```yaml
version: 2
snapshot:
  widths: [375, 768, 1280]
  min-height: 1024
  percy-css: |
    /* Hide dynamic content */
    .animated-counter { animation: none !important; }
    .verify-ring::before { animation: none !important; }

storybook:
  args:
    theme: [light, dark]
```

## Visual Regression Baseline

### Acceptance Criteria
- **Diff threshold**: ≤ 0.1% for established components
- **Lighthouse a11y score**: ≥ 95
- **Performance score**: ≥ 90 (no regression from baseline)

### Manual QA Checklist
- [ ] Glass effects render properly in Chrome, Firefox, Safari
- [ ] Soft-UI shadows are consistent across components
- [ ] Focus rings are visible with 4.5:1 contrast ratio
- [ ] Reduced motion preferences disable animations
- [ ] Mobile fallbacks remove blur on low-end devices
- [ ] Feature flags work correctly (?theme=precision-glass)

## CI Integration

Add to GitHub Actions:
```yaml
- name: Run Percy visual tests
  run: |
    npm run build-storybook
    npm run percy:storybook
  env:
    PERCY_TOKEN: ${{ secrets.PERCY_TOKEN }}
```

## Rollout Checklist

1. **Token Layer** ✅
   - CSS custom properties added
   - Tailwind config extended

2. **Utility Classes** ✅
   - `.glass` and `.soft-ui` classes implemented
   - Pastel variants added

3. **Component Updates** ✅
   - Hero section with glass effect
   - Buttons and badges with soft-UI
   - Cards with flat Bento styling

4. **Feature Flag Ready** ✅
   - URL-based flags implemented
   - `?theme=precision-glass` enables all features

5. **Performance Optimized** ✅
   - Blur effects limited to static layers
   - Mobile fallbacks implemented
   - Reduced motion support added

## Next Steps

1. Install Storybook and create baseline snapshots
2. Set up Percy project and CI integration
3. Run initial visual regression tests
4. Deploy behind feature flag for team testing
5. Gradual rollout to production after QA approval

## Emergency Rollback

If issues are discovered post-deployment:
1. Remove `?theme=precision-glass` parameter
2. Components fallback to original styling
3. No breaking changes to existing functionality
