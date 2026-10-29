import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/preact';
import React from 'react';
import App from './App';

it('offers Original alongside five new themes and switches without leaving the import screen', () => {
  const { getByRole, getAllByRole, container } = render(<App/>);
  const selector = getByRole('combobox', { name: 'Theme' });

  expect(getAllByRole('option')).toHaveLength(6);
  expect(getByRole('option', { name: 'Original · Light' })).toHaveValue('original');
  fireEvent.change(selector, { target: { value: 'midnight' } });

  expect(document.documentElement).toHaveAttribute('data-theme', 'midnight');
  expect(localStorage.getItem('lcov-viewer.theme')).toBe('midnight');
  expect(container.querySelector('input[type="file"]')).toBeInTheDocument();
});
