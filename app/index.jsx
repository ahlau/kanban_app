/*
require('./main.css');
var component = require('./component');
document.body.appendChild(component());
*/
import './main.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';

ReactDOM.render(<App />, document.getElementById('app'));