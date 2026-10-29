import React from 'react';
import ReactDOM from 'react-dom';
import { initializeTheme } from '@lcov-viewer/components';
import '@lcov-viewer/core/styles/baseline.less';
import App from './components/App';

const date = REPORT_DATE;
const coverage = COVERAGE_DATA;

initializeTheme();
ReactDOM.render(
  <App coverage={coverage} date={date} />,
  document.getElementById('root')
);
