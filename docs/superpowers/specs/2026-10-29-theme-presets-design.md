# Theme presets

Add five Color Hunt inspired presets to both the web viewer and generated HTML reports: Blue (default, light), Lavender (light), Midnight (dark), Slate (dark), and Forest (dark). The user requested palette research and implementation; names, default, and implementation details are implementation choices.

Follow-up: preserve the upstream theme as **Original**, alongside the five new presets (six choices total). Preserve the original white/magenta palette, coverage colors and alpha values, and bundled Prism styling. The existing Blue default and stored preferences remain unchanged.

Use a labeled native select in the web header and a compact report toolbar, with a small decorative palette preview. Switching applies immediately, preserves imported data and navigation, and saves `lcov-viewer.theme` in localStorage. Unknown or inaccessible storage falls back to Blue; unavailable storage must not prevent switching. Apply saved selection before rendering.

## Approaches

- CSS custom properties shared through existing LESS styles: chosen because web and generated reports share components and can switch without a rebuild or new dependency.
- Separate stylesheets per theme: duplicates component rules and complicates the self-contained report.
- A new styling framework: unnecessary migration for this feature.

Cover page backgrounds, text, links, controls, coverage tables, status badges, line gutters, and Prism syntax tokens. Preserve the green/amber/red coverage meanings and readable contrast. Keep the existing React/Preact, LESS, and Yarn workspace structure. No coverage parsing or language detection changes.

## Palette references

Base palettes, with derived tones for contrast and semantic coverage colors:

- Blue: https://colorhunt.co/palette/f9f7f7dbe2ef3f72af112d4e
- Lavender: https://colorhunt.co/palette/f4eeffdcd6f7a6b1e1424874
- Midnight: https://colorhunt.co/palette/222831393e4600adb5eeeeee
- Slate: https://colorhunt.co/palette/27374d526d829db2bfdde6ed
- Forest: https://colorhunt.co/palette/2c36393f4e4fa27b5cdcd7c9
