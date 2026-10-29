import { buildCoverageTree } from '@lcov-viewer/core';
import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/preact';
import React from 'react';
import TreeView from './TreeView';

const coverage = buildCoverageTree({
  'src/index.js': {
    metrics: {
      lines: { total: 6, covered: 0 },
      functions: { total: 0, covered: 0 },
      branches: { total: 0, covered: 0 },
    },
    path: 'src/index.js',
    filename: 'index.js',
  },
  'src/components/App.js': {
    metrics: {
      lines: { total: 14, covered: 9 },
      functions: { total: 2, covered: 0 },
      branches: { total: 2, covered: 2 },
    },
    path: 'src/components/App.js',
    filename: 'App.js',
  },
});

const queryTableContent = container => [...container.querySelectorAll('tbody > tr')]
  .filter(row => !row.classList.contains('hidden'))
  .map(row => [...row.querySelectorAll('td')].map(cell => cell.textContent));
const queryRows = container => [...container.querySelectorAll('tbody > tr > td:first-child')]
  .filter(cell => !cell.parentElement.classList.contains('hidden'))
  .map(cell => cell.textContent);

const clickRow = (container, title) => fireEvent.click([...container.querySelectorAll('tbody > tr')]
  .find(row => row.querySelector('td:first-child').textContent === title));

describe('<TreeView />', () => {
  it('initially expands All Files and collapses every nested directory', () => {
    const { container } = render(<TreeView coverage={coverage}/>);
    expect(queryRows(container)).toEqual(['All Files', 'src']);
    expect(container.querySelector('tr[data-node=""]')).toHaveClass('open');
    expect(container.querySelector('tr[data-node="src"]')).not.toHaveClass('open');
    expect(container.querySelector('tr[data-node="src/components"]')).not.toHaveClass('open');

    clickRow(container, 'src');
    expect(queryRows(container)).toEqual(['All Files', 'src', 'index.js', 'components']);
    clickRow(container, 'components');
    expect(queryRows(container)).toEqual(['All Files', 'src', 'index.js', 'components', 'App.js']);
  });

  it('should render coverage for each directory and file', () => {
    const { container, getByRole } = render(<TreeView coverage={coverage}/>);
    fireEvent.click(getByRole('button', { name: 'Expand All' }));

    //@formatter:off
    expect(queryTableContent(container)).toEqual([
      ['All Files',  '9/20', '45.0%', '0/2',   '0.0%', '2/2', '100.0%'],
      ['src',        '9/20', '45.0%', '0/2',   '0.0%', '2/2', '100.0%'],
      ['index.js',    '0/6',  '0.0%', '0/0', '100.0%', '0/0', '100.0%'],
      ['components', '9/14', '64.3%', '0/2',   '0.0%', '2/2', '100.0%'],
      ['App.js',     '9/14', '64.3%', '0/2',   '0.0%', '2/2', '100.0%'],
    ]);
    //@formatter:on
  });

  it('should toggle child rows visibility on directory row click', () => {
    const { container } = render(<TreeView coverage={coverage}/>);
    expect(queryRows(container)).toEqual(['All Files', 'src']);

    clickRow(container, 'All Files');
    expect(queryRows(container)).toEqual(['All Files']);

    clickRow(container, 'All Files');
    expect(queryRows(container)).toEqual(['All Files', 'src']);
  });

  it('should persist child row visibility on parent row visibility change', () => {
    const { container, getByRole } = render(<TreeView coverage={coverage}/>);
    fireEvent.click(getByRole('button', { name: 'Expand All' }));
    expect(queryRows(container)).toEqual(['All Files', 'src', 'index.js', 'components', 'App.js']);

    clickRow(container, 'components');
    expect(queryRows(container)).toEqual(['All Files', 'src', 'index.js', 'components']);

    clickRow(container, 'src');
    expect(queryRows(container)).toEqual(['All Files', 'src']);

    clickRow(container, 'src');
    expect(queryRows(container)).toEqual(['All Files', 'src', 'index.js', 'components']);
  });

  it('keeps Collapse All and Expand All working after the initial collapsed state', () => {
    const { container, getByRole } = render(<TreeView coverage={coverage}/>);
    fireEvent.click(getByRole('button', { name: 'Collapse All' }));
    expect(queryRows(container)).toEqual(['All Files']);
    clickRow(container, 'All Files');
    expect(queryRows(container)).toEqual(['All Files', 'src']);
    fireEvent.click(getByRole('button', { name: 'Expand All' }));
    expect(queryRows(container)).toEqual(['All Files', 'src', 'index.js', 'components', 'App.js']);
    fireEvent.click(getByRole('button', { name: 'Collapse All' }));
    expect(queryRows(container)).toEqual(['All Files']);
  });

  it('shows top-level files and sibling directories while hiding their contents', () => {
    const tree = buildCoverageTree(Object.fromEntries(
      ['main.cpp', 'src/parser.cpp', 'tests/parser_test.cpp'].map(path => [path, {
        path, filename: path.split('/').pop(), metrics: coverage.metrics,
      }]),
    ));
    const { container } = render(<TreeView coverage={tree}/>);
    expect(queryRows(container)).toEqual(['All Files', 'main.cpp', 'src', 'tests']);
    clickRow(container, 'src');
    expect(queryRows(container)).toEqual(['All Files', 'main.cpp', 'src', 'parser.cpp', 'tests']);
  });

  it('initializes replacement coverage and connects controls to the new rows', () => {
    const { container, rerender, getByRole } = render(<TreeView coverage={coverage}/>);
    fireEvent.click(getByRole('button', { name: 'Expand All' }));
    const replacement = buildCoverageTree({
      'tests/unit/parser.cpp': { metrics: coverage.metrics },
    });
    rerender(<TreeView coverage={replacement}/>);
    expect(queryRows(container)).toEqual(['All Files', 'tests']);
    clickRow(container, 'tests');
    expect(queryRows(container)).toEqual(['All Files', 'tests', 'unit']);
    fireEvent.click(getByRole('button', { name: 'Expand All' }));
    expect(queryRows(container)).toEqual(['All Files', 'tests', 'unit', 'parser.cpp']);
  });

  it('handles a report with no files', () => {
    const { container, getByRole } = render(<TreeView coverage={buildCoverageTree({})}/>);
    expect(queryRows(container)).toEqual(['All Files']);
    fireEvent.click(getByRole('button', { name: 'Collapse All' }));
    fireEvent.click(getByRole('button', { name: 'Expand All' }));
    expect(queryRows(container)).toEqual(['All Files']);
  });

  it('preserves expanded directories when the same report rerenders', () => {
    const { container, rerender } = render(<TreeView coverage={coverage}/>);
    clickRow(container, 'src');
    rerender(<TreeView coverage={coverage}/>);
    expect(queryRows(container)).toEqual(['All Files', 'src', 'index.js', 'components']);
  });
});
