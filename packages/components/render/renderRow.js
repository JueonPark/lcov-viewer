import { BRANCH_NODE, calculatePercentage, clsx, resolveCoverageClass } from '@lcov-viewer/core';
import classes from './renderRow.module.less';

const coverageClasses = {
  good: clsx(classes.numbers, classes.coverage, classes.good),
  normal: clsx(classes.numbers, classes.coverage, classes.normal),
  bad: clsx(classes.numbers, classes.coverage, classes.bad),
};

const renderTitleCell = (node, depth, linkSelector) => {
  const link = linkSelector && linkSelector(node);
  const title = link ? `<a href="${link}">${node.name}</a>` : node.name;
  const offset = node.type === BRANCH_NODE ? 0.5 : 1.75; // 1.75 = 0.5 + 1 (close icon) + 0.25 (close icon margin)

  return `<td class=${classes.title} style="padding-left: ${depth + offset}rem">${title}</td>`;
};

const renderMetricCells = (stats, category) => {
  const rowCoverage = calculatePercentage(stats[category]);
  const coverageClassName = resolveCoverageClass(rowCoverage, coverageClasses);

  return [
    `<td class="${classes.numbers}">${stats[category].covered}/${stats[category].total}</td>`,
    `<td class="${coverageClassName}">${rowCoverage.toFixed(1)}%</td>`,
  ];
};

const renderRow = (row, { linkSelector }) => {
  const cells = [
    renderTitleCell(row.node, row.depth, linkSelector),
    ...renderMetricCells(row.node.metrics, 'lines'),
    ...renderMetricCells(row.node.metrics, 'functions'),
    ...renderMetricCells(row.node.metrics, 'branches'),
  ];
  const isBranch = row.node.type === BRANCH_NODE;
  const className = clsx(
    classes.root,
    isBranch && classes.folder,
    isBranch && row.depth === 0 && classes.open,
    row.depth > 1 && classes.hidden,
  );

  return `<tr class="${className}" data-node="${row.node.path}" data-node-type="${row.node.type}">${cells.join('')}</tr>`;
};

export default renderRow;
