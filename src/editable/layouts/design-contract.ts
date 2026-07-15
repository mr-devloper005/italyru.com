import type { CSSProperties } from 'react'

export const editableRootStyle = {
  // Bold-tech directory system: crisp white canvas, warm cream panels, a deep
  // maroon for dark bands + footer, and a vivid orange-red as the signature
  // action accent. Modern-serif display headings pair with a clean sans body.
  '--slot4-page-bg': '#ffffff',
  '--slot4-page-text': '#1b1310',
  '--slot4-panel-bg': '#fbf4ea',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#6e5d4e',
  '--slot4-soft-muted-text': '#9c8a78',
  '--slot4-accent': '#d53e0f',
  '--slot4-accent-fill': '#d53e0f',
  '--slot4-accent-soft': '#fbe7d8',
  '--slot4-accent-2': '#9b0f06',
  '--slot4-accent-deep': '#5e0006',
  '--slot4-on-accent': '#ffffff',
  '--slot4-dark-bg': '#5e0006',
  '--slot4-dark-text': '#f6e9d8',
  '--slot4-media-bg': '#efe6da',
  '--slot4-cream': '#eed9b9',
  '--slot4-warm': '#fbf4ea',
  '--slot4-lavender': '#fbf4ea',
  '--slot4-gray': '#f6f0e7',
  '--slot4-body-gradient': 'none',
  '--editable-page-bg': '#ffffff',
  '--editable-page-text': '#1b1310',
  '--editable-container': '1320px',
  '--editable-border': '#ecdfce',
  '--editable-nav-bg': '#ffffff',
  '--editable-nav-text': '#1b1310',
  '--editable-nav-active': '#d53e0f',
  '--editable-nav-active-text': '#ffffff',
  '--editable-cta-bg': '#d53e0f',
  '--editable-cta-text': '#ffffff',
  '--editable-search-bg': '#ffffff',
  '--editable-footer-bg': '#5e0006',
  '--editable-footer-text': '#f6e9d8',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-[0_2px_10px_rgba(94,0,6,0.06)]',
  shadowStrong: 'shadow-[0_18px_46px_rgba(94,0,6,0.16)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(31,10,4,0.02),rgba(31,10,4,0.78))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-16 sm:py-20 lg:py-24',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[260px] shrink-0 snap-start sm:w-[300px]',
  },
  type: {
    eyebrow: 'text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--slot4-accent)]',
    heroTitle: 'editable-display text-4xl font-bold leading-[1.02] tracking-[-0.02em] sm:text-5xl lg:text-6xl',
    sectionTitle: 'editable-display text-3xl font-bold tracking-[-0.02em] sm:text-4xl',
    body: 'text-base leading-relaxed',
  },
  surface: {
    card: `rounded-2xl border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-2xl border ${editablePalette.border} ${editablePalette.panelBg}`,
    dark: `rounded-2xl ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
  },
  button: {
    primary: `inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3 text-sm font-bold tracking-[0.01em] text-[var(--slot4-on-accent)] transition duration-200 hover:brightness-95 active:scale-[0.98]`,
    secondary: `inline-flex items-center justify-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-6 py-3 text-sm font-bold tracking-[0.01em] text-[var(--slot4-page-text)] transition duration-200 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] active:scale-[0.98]`,
    accent: `inline-flex items-center justify-center gap-2 rounded-full ${editablePalette.accentBg} px-6 py-3 text-sm font-bold text-[var(--slot4-on-accent)] transition duration-200 hover:brightness-95 active:scale-[0.98]`,
  },
  media: {
    frame: `relative overflow-hidden rounded-2xl ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/3]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_48px_rgba(94,0,6,0.16)]',
    fade: 'transition duration-300 hover:opacity-80',
  },
} as const

export const aiLayoutRules = [
  'Change the full site color palette in editableRootStyle first; all homepage sections consume those CSS variables.',
  'Keep page structure in src/editable/sections/HomeSections.tsx so AI can redesign the whole home experience in one file.',
  'Use wide readable grids; never create skinny columns for paragraphs or cards.',
  'Use horizontal rails for dense post browsing.',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const
