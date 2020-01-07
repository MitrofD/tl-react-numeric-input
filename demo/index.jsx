import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Main';


const rootEl = document.getElementById('root');

if (rootEl) {
  ReactDOM.render(<Main />, rootEl);
}
