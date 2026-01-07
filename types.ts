
export type HUDView = 'links' | 'console' | 'diagnostics' | 'donation' | null;

// Exporting a runtime value ensures this file is treated as a valid module by all bundlers
export const VIEW_TYPES = {
  LINKS: 'links',
  CONSOLE: 'console',
  DIAGNOSTICS: 'diagnostics',
  DONATION: 'donation'
} as const;
