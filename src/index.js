import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TreeList from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<TreeList />, document.getElementById('root'));
registerServiceWorker();
