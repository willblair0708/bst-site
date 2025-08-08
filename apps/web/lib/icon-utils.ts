/**
 * Icon color utilities following the design system
 */

export function getLangColor(language: string): string {
  switch (language.toLowerCase()) {
    case 'python':
      return 'bg-viz-blue-500'
    case 'r':
      return 'bg-viz-purple-500'
    case 'julia':
      return 'bg-viz-orange-500'
    case 'javascript':
    case 'typescript':
      return 'bg-viz-green-400'
    default:
      return 'bg-viz-orange-500'
  }
}

export function getPillarColor(pillar: string): { bg: string; text: string; border: string } {
  switch (pillar) {
    case 'VERSIONED_KNOWLEDGE':
      return {
        bg: 'bg-primary/10 hover:bg-primary/20',
        text: 'text-primary',
        border: 'border-primary/20'
      }
    case 'COMPOSABLE_MODELS':
      return {
        bg: 'bg-accent/10 hover:bg-accent/20',
        text: 'text-accent',
        border: 'border-accent/20'
      }
    case 'HUMAN_AI_COLLAB':
      return {
        bg: 'bg-accent/10 hover:bg-accent/20',
        text: 'text-accent',
        border: 'border-accent/20'
      }
    default:
      return {
        bg: 'bg-primary/10 hover:bg-primary/20',
        text: 'text-primary',
        border: 'border-primary/20'
      }
  }
}
