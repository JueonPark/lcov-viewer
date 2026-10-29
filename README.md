![build](https://github.com/eugenezinovyev/lcov-viewer/actions/workflows/main.yml/badge.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/eugenezinovyev/lcov-viewer/badge.svg?targetFile=package.json)](https://snyk.io/test/github/eugenezinovyev/lcov-viewer?targetFile=package.json)

# LCOV viewer

Live: **[lcov-viewer.netlify.app](https://lcov-viewer.netlify.app/)**

LCOV code coverage report viewer. Parses lcov report files and generates HTML report grouped by directory.

This repository provides two packages:

| Package                                                                                                                                   | Description                                                                        |
|-------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------|
| [![npm version](https://badge.fury.io/js/@lcov-viewer%2Fistanbul-report.svg)](https://www.npmjs.com/package/@lcov-viewer/istanbul-report) | Istanbul grouped HTML report. Generates code coverage report grouped by directory. |
| [![npm version](https://badge.fury.io/js/@lcov-viewer%2Fcli.svg)](https://www.npmjs.com/package/@lcov-viewer/cli)                         | CLI to convert coverage in LCOV format to a grouped HTML report.                   |

## Istanbul Report

Istanbul reporter for Jest and nyc. Generates code coverage report grouped by directory.

Documentation: [/packages/istanbul-report](/packages/istanbul-report)

```shell
yarn add -D @lcov-viewer/istanbul-report
npm install -D @lcov-viewer/istanbul-report
```

## CLI

CLI to convert coverage in LCOV format to a grouped HTML report.

Documentation: [/packages/cli](/packages/cli)

```shell
yarn global add @lcov-viewer/cli
npm install -g @lcov-viewer/cli
```

-- OR locally in your project --

```shell
yarn add -D @lcov-viewer/cli
npm install -D @lcov-viewer/cli
```

## Initial tree view

Reports start with **All Files** expanded so top-level files and directories are
visible. All nested directories start collapsed. Click a directory to expand it,
or use **Expand All** to show every file. **Collapse All** still collapses the
entire tree, including All Files. This applies to the web viewer and generated
HTML reports.

## Themes

Use **Theme** in the web viewer header or the generated HTML report toolbar to
switch instantly between Original and five new presets. Original preserves the
upstream white background, magenta accents, coverage colors, and Prism syntax
highlighting. The selection is saved in your browser
under `lcov-viewer.theme` and restored when you reopen the viewer. Blue is the
default. If browser storage is disabled (including some `file://` environments),
switching still works for the current page.

The five additional presets are based on [Color Hunt](https://colorhunt.co/) palettes, with
additional tones for readable text, syntax highlighting, and green/amber/red
coverage indicators. All palette assets are bundled; no palette website is
contacted when viewing reports.

| Preset | Appearance | Base palette |
| --- | --- | --- |
| Original | Original light theme, magenta accents | Upstream LCOV Viewer palette |
| Blue | Light, cool blue | [F9F7F7 · DBE2EF · 3F72AF · 112D4E](https://colorhunt.co/palette/f9f7f7dbe2ef3f72af112d4e) |
| Lavender | Light, soft purple | [F4EEFF · DCD6F7 · A6B1E1 · 424874](https://colorhunt.co/palette/f4eeffdcd6f7a6b1e1424874) |
| Midnight | Dark charcoal, teal | [222831 · 393E46 · 00ADB5 · EEEEEE](https://colorhunt.co/palette/222831393e4600adb5eeeeee) |
| Slate | Dark, muted blue | [27374D · 526D82 · 9DB2BF · DDE6ED](https://colorhunt.co/palette/27374d526d829db2bfdde6ed) |
| Forest | Dark, warm earth tones | [2C3639 · 3F4E4F · A27B5C · DCD7C9](https://colorhunt.co/palette/2c36393f4e4fa27b5cdcd7c9) |

Theme tokens are defined in `packages/core/styles/themes.less`; the shared selector
and persistence logic live in `packages/components/ThemeSelector`.

## Local Development Setup

This repository uses Yarn workspaces. Please use Yarn as a package manager.

```shell
git clone https://github.com/JueonPark/lcov-viewer.git
cd lcov-viewer
yarn
yarn start
```

Then open http://localhost:8080/ in your browser and drop `lcov.info` file into the dropzone.

Build all packages before generating a report with the local CLI:

```shell
yarn build
node packages/cli/lib/index.js lcov -o ./coverage/report ./lcov.info
```

Open `coverage/report/index.html` to view the report and choose a theme. To run
the complete test suite without generating coverage reports:

```shell
yarn test:all --runInBand --coverage=false
```

![viewer](https://user-images.githubusercontent.com/1678896/139163904-5f845791-2af5-4cdd-b044-98406b2963b7.gif)
