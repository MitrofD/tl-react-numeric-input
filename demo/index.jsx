import React from 'react';
import { render } from 'react-dom';
import Root from './Root';
import './main.scss';


const rootEl = document.getElementById('root');

if (rootEl) {
  render(<Root />, rootEl);
}
