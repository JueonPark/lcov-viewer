import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '@testing-library/preact';
import React from 'react';
import { webcrypto } from 'crypto';
import App from './App';

// jsdom 19 does not expose the Web Crypto API used by nanoid's browser build.
Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true });

it('keeps the report theme while navigating to source details and back', async () => {
  localStorage.clear();
  window.location.hash = '#/';
  const metrics = {
    lines: { covered: 1, total: 2 },
    functions: { covered: 1, total: 1 },
    branches: { covered: 0, total: 0 },
  };
  const coverage = {
    'example.cpp': {
      metrics,
      path: 'example.cpp',
      filename: 'example.cpp',
      details: {
        lines: [
          { line: 1, hits: 1, text: 'int main() {' },
          { line: 2, hits: 0, text: '  return 0;' },
          { line: 3, hits: 0, text: '}' },
        ],
        branchCoverage: {},
        branchMap: {},
      },
    },
  };
  const { getByRole, container } = render(<App coverage={coverage} date="2026-10-29"/>);
  fireEvent.change(getByRole('combobox', { name: 'Theme' }), { target: { value: 'forest' } });
  fireEvent.click(getByRole('link', { name: 'example.cpp' }));

  await waitFor(() => expect(container.querySelector('pre')).toHaveTextContent('return 0;'));
  expect(getByRole('combobox', { name: 'Theme' })).toHaveValue('forest');
  expect(document.documentElement).toHaveAttribute('data-theme', 'forest');
  fireEvent.click(getByRole('link', { name: 'All Files' }));
  await waitFor(() => expect(getByRole('link', { name: 'example.cpp' })).toBeInTheDocument());
  expect(getByRole('combobox', { name: 'Theme' })).toHaveValue('forest');
});
