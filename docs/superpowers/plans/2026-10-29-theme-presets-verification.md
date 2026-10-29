# Theme presets verification

Base: `origin/main` at `6f707a5`. Working branch: `feat/theme-presets`.

## Results

- Yarn 1.22.22 frozen-lockfile installation; no dependency or lockfile changes.
- Full production build: all five workspace build targets passed. Web app rebuilt successfully after the final narrow-header adjustment.
- Jest: 33 tests passed across 7 suites, including storage denial, persistence, generated report navigation, five palette contrast checks, and compiled Prism background regression.
- Browser: Edge tested all five presets with a C++ LCOV fixture, unchanged imported coverage, reload persistence, generated report navigation, source code background and selection colors, native keyboard selection at 390px viewport width, and direct `file://` report access. No page errors.
- `git diff --check`: passed.

## Review and repairs

Independent review found Prism's later stylesheet overriding the source background and selection colors. Reproduced the light background in Edge, fixed both overrides, and confirmed the browser regression passes. The source regression test also fails with the background override removed and passes with it restored.

The Blue accent was darkened after contrast testing exposed insufficient contrast on hovered rows. The web app root now permits shrinking so the new selector stays within a narrow viewport; this is not a general mobile redesign.

Existing test setup issues exposed during validation were resolved by instantiating PostCSS plugins and allowing nanoid's ESM code through Jest's transform. The report test supplies Web Crypto missing from this repository's jsdom version. The sandbox's temporary Jest cache required an explicit writable cache directory.

Commands used from the repository root:

```shell
yarn build
node node_modules/jest/bin/jest.js --runInBand --cacheDirectory=node_modules/.cache/jest
node packages/cli/lib/index.js lcov -o coverage/theme-report coverage/theme-preview.info
git diff --check
```

The existing Browserslist database age warning remains. Browser fixture, generated reports, and build logs are local ignored verification artifacts. Existing source-language detection, general small-screen layout, cross-tab synchronization, and system-theme following were outside this change.

## Original theme follow-up

Added Original as the first of six choices, preserving upstream colors, translucent table and coverage fills, borders, brand icons, and Prism's original source styling. Kept the five additional presets and existing saved preferences. Verified 36 tests across 7 suites, all five production build targets, and Edge checks for original page/table/source colors, persistence, and switching to the other presets. Refreshed the open in-app preview to include Original.
