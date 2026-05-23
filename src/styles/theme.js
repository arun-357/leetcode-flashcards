export const t = {
  colors: {
    bg0: '#0a0d12',
    bg1: '#0f131a',
    bg2: '#161b24',
    bg3: '#1d232e',
    bgInset: '#07090d',

    line1: '#1f2632',
    line2: '#2a3242',
    lineFocus: '#3d4a5f',

    fg1: '#e6edf3',
    fg2: '#b3becc',
    fg3: '#7d8a9c',
    fg4: '#4e5969',
    fgOnAccent: '#0a0d12',

    synGreen: '#7ee787',
    synGreenDim: '#3fb950',
    synGreenSoft: 'rgba(126, 231, 135, 0.12)',
    synAmber: '#ffa657',
    synAmberDim: '#d98c3a',
    synAmberSoft: 'rgba(255, 166, 87, 0.13)',
    synRed: '#ff7b72',
    synRedDim: '#da3633',
    synRedSoft: 'rgba(255, 123, 114, 0.13)',
    synCyan: '#79c0ff',
    synCyanDim: '#388bfd',
    synCyanSoft: 'rgba(121, 192, 255, 0.12)',
    synPurple: '#d2a8ff',
    synPurpleSoft: 'rgba(210, 168, 255, 0.12)',
    synPink: '#ff9bd2',
    synYellow: '#f2cc60',

    // resolved from var(--syn-*) aliases
    diffEasy: '#7ee787',
    diffEasyBg: 'rgba(126, 231, 135, 0.12)',
    diffEasyLine: 'rgba(126, 231, 135, 0.35)',
    diffMedium: '#ffa657',
    diffMediumBg: 'rgba(255, 166, 87, 0.13)',
    diffMediumLine: 'rgba(255, 166, 87, 0.35)',
    diffHard: '#ff7b72',
    diffHardBg: 'rgba(255, 123, 114, 0.13)',
    diffHardLine: 'rgba(255, 123, 114, 0.35)',

    brand: '#7ee787',
    brandInk: '#0a0d12',
  },

  fonts: {
    mono: '"JetBrains Mono", "Fira Code", "SF Mono", ui-monospace, Menlo, Consolas, monospace',
    sans: '"Inter Tight", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },

  text: {
    xs: '11px',
    sm: '13px',
    base: '14px',
    md: '16px',
    lg: '18px',
    xl: '22px',
    '2xl': '28px',
    '3xl': '36px',
    '4xl': '48px',
  },

  leading: { tight: 1.15, snug: 1.3, body: 1.55 },
  tracking: { tight: '-0.01em', mono: '0.02em', caps: '0.12em' },

  space: {
    1: '4px',  2: '8px',  3: '12px', 4: '16px',
    5: '20px', 6: '24px', 8: '32px', 10: '40px',
    12: '48px', 16: '64px',
  },

  radius: { 1: '4px', 2: '6px', 3: '10px', 4: '14px', pill: '999px' },

  shadow: {
    1: '0 1px 0 rgba(0,0,0,0.4)',
    2: '0 4px 14px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.02) inset',
    3: '0 18px 40px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.03) inset',
    ring: '0 0 0 2px rgba(126,231,135,0.35)',
  },

  ease: {
    out: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
    inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  },

  dur: { 1: '120ms', 2: '200ms', 3: '380ms', 4: '600ms' },
};
