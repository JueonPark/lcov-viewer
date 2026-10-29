import React from 'react';
import ReactDOM from 'react-dom';
import { initializeTheme } from '@lcov-viewer/components';
import '@lcov-viewer/core/styles/baseline.less';
import './index.less';
import App from './components/App';

initializeTheme();
ReactDOM.render(<App/>, document.getElementById('root'));
