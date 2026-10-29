import '@testing-library/jest-dom';
import { cleanup, fireEvent, render } from '@testing-library/preact';
import React from 'react';
import ThemeSelector from './ThemeSelector';
import { initializeTheme, THEME_STORAGE_KEY } from './themes';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

it('restores the saved theme before rendering', () => {
  localStorage.setItem(THEME_STORAGE_KEY, 'forest');
  initializeTheme();
  expect(document.documentElement).toHaveAttribute('data-theme', 'forest');
  const { getByRole } = render(<ThemeSelector/>);
  expect(getByRole('combobox', { name: 'Theme' })).toHaveValue('forest');
});

it.each(['original', 'blue', 'lavender', 'midnight', 'slate', 'forest'])('persists %s across remounts', theme => {
  const { getByRole, unmount } = render(<ThemeSelector/>);
  fireEvent.change(getByRole('combobox', { name: 'Theme' }), { target: { value: theme } });
  expect(document.documentElement).toHaveAttribute('data-theme', theme);
  expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(theme);
  unmount();
  const restored = render(<ThemeSelector/>);
  expect(restored.getByRole('combobox', { name: 'Theme' })).toHaveValue(theme);
});

it.each([null, 'removed-theme', '__proto__'])('uses Blue for missing or unknown preference %s', value => {
  if (value !== null) localStorage.setItem(THEME_STORAGE_KEY, value);
  initializeTheme();
  const { getByRole } = render(<ThemeSelector/>);
  expect(getByRole('combobox', { name: 'Theme' })).toHaveValue('blue');
  expect(document.documentElement).toHaveAttribute('data-theme', 'blue');
});

it('supports switching when the browser denies storage access', () => {
  jest.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
    throw new DOMException('Storage is disabled', 'SecurityError');
  });
  expect(() => initializeTheme()).not.toThrow();
  const { getByRole } = render(<ThemeSelector/>);
  fireEvent.change(getByRole('combobox', { name: 'Theme' }), { target: { value: 'slate' } });
  expect(document.documentElement).toHaveAttribute('data-theme', 'slate');
  expect(getByRole('combobox', { name: 'Theme' })).toHaveValue('slate');
});

it('keeps switching when storage quota is exhausted', () => {
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('Storage is full', 'QuotaExceededError');
  });
  const { getByRole } = render(<ThemeSelector/>);
  fireEvent.change(getByRole('combobox', { name: 'Theme' }), { target: { value: 'lavender' } });
  expect(document.documentElement).toHaveAttribute('data-theme', 'lavender');
});
