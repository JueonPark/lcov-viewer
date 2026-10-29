import fs from 'fs';
import path from 'path';
import less from 'less';
import postcss from 'postcss';
import { THEMES } from './themes';

const luminance = hex => {
  const full = hex.length === 4 ? '#' + [...hex.slice(1)].map(c => c + c).join('') : hex;
  const channels = full.slice(1).match(/../g).map(channel => {
    const value = parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
};

const contrast = (a, b) => {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
};

let palettes;
beforeAll(async () => {
  const source = fs.readFileSync(path.resolve(__dirname, '../../core/styles/themes.less'), 'utf8');
  const { css } = await less.render(source);
  palettes = postcss.parse(css).nodes;
});

// Original preserves upstream colors exactly; contrast adjustments apply to new presets.
it.each(THEMES.filter(theme => theme.id !== 'original').map(theme => theme.id))('%s keeps normal-sized text at WCAG AA contrast', id => {
  const rule = palettes.find(node => node.selector && node.selector.includes(`[data-theme='${id}']`));
  expect(rule).toBeDefined();
  const tokens = Object.fromEntries(rule.nodes.map(node => [node.prop, node.value]));
  const pairs = [
    ['text', 'page'], ['text', 'surface'], ['text-muted', 'page'], ['text-muted', 'surface'],
    ['accent', 'page'], ['accent', 'surface'], ['accent', 'row-hover'],
    ['table-heading-text', 'table-heading'],
    ...['good', 'normal', 'bad'].flatMap(status => [
      [`coverage-${status}`, 'page'],
      [`coverage-${status}`, 'row-hover'],
      [`coverage-${status}`, `coverage-${status}-bg`],
    ]),
  ];
  for (const [foreground, background] of pairs) {
    const ratio = contrast(tokens[`--${foreground}`], tokens[`--${background}`]);
    expect({ foreground, background, passes: ratio >= 4.5 }).toEqual({ foreground, background, passes: true });
  }
});

it('preserves the upstream Original colors and translucent coverage backgrounds', () => {
  const rule = palettes.find(node => node.selector && node.selector.includes("[data-theme='original']"));
  expect(rule).toBeDefined();
  const tokens = Object.fromEntries(rule.nodes.map(node => [node.prop, node.value]));
  expect(tokens).toMatchObject({
    '--page': '#ffffff',
    '--text': '#4a4a4a',
    '--accent': '#c9369b',
    '--coverage-bad': '#d3343c',
    '--coverage-normal': '#d3b334',
    '--coverage-good': '#248f29',
    '--table-heading': 'rgba(201, 54, 155, 0.79)',
    '--row-hover': 'rgba(201, 54, 155, 0.19)',
    '--coverage-good-bg': 'rgba(36, 143, 41, 0.19)',
    '--coverage-bad-bg': 'rgba(211, 52, 60, 0.19)',
    '--table-border': 'rgba(74, 74, 74, 0.09)',
    '--table-side-border': 'rgba(201, 54, 155, 0.29)',
  });
});

it.each([
  ['midnight', ['transparent', 'rgba(0, 0, 0, 0)']],
  ['original', ['rgb(245, 242, 240)']],
])('uses the correct compiled source background for %s', async (theme, expected) => {
  const root = path.resolve(__dirname, '../../..');
  const compile = async relativePath => {
    const filename = path.join(root, relativePath);
    return (await less.render(fs.readFileSync(filename, 'utf8'), {
      filename,
      paths: [path.join(root, 'node_modules')],
    })).css;
  };
  const baseline = await compile('packages/core/styles/baseline.less');
  const details = await compile('packages/report/src/components/Details.module.less');
  const prism = fs.readFileSync(path.join(root, 'node_modules/prismjs/themes/prism.css'), 'utf8');
  const style = document.createElement('style');
  // Emulate the production stylesheet order and CSS Modules' global selectors.
  style.textContent = (baseline + prism + details)
    .replace(/@import[^;]+;/g, '')
    .replace(/:global\(([^)]+)\)/g, '$1');
  const container = document.createElement('div');
  const previousTheme = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', theme);
  container.className = 'code';
  const pre = document.createElement('pre');
  pre.className = 'language-javascript code pre';
  container.append(pre);
  document.head.append(style);
  document.body.append(container);
  try {
    expect(expected).toContain(getComputedStyle(pre).backgroundColor);
  } finally {
    if (previousTheme === null) document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', previousTheme);
    style.remove();
    container.remove();
  }
});
