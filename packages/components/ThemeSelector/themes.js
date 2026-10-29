export const THEME_STORAGE_KEY = 'lcov-viewer.theme';
export const DEFAULT_THEME = 'blue';

// Original preserves the upstream theme; new palettes use Color Hunt (see README).
export const THEMES = [
  { id: 'original', name: 'Original', mode: 'Light' },
  { id: 'blue', name: 'Blue', mode: 'Light' },
  { id: 'lavender', name: 'Lavender', mode: 'Light' },
  { id: 'midnight', name: 'Midnight', mode: 'Dark' },
  { id: 'slate', name: 'Slate', mode: 'Dark' },
  { id: 'forest', name: 'Forest', mode: 'Dark' },
];

export function getSavedTheme() {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (THEMES.some(theme => theme.id === saved)) return saved;
  } catch {
    // Storage can be unavailable in private browsing or local HTML reports.
  }
  return DEFAULT_THEME;
}

export function initializeTheme() {
  document.documentElement.setAttribute('data-theme', getSavedTheme());
}
