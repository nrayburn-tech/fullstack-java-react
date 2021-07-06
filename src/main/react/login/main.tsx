import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import LoginForm from './LoginForm';
import '../index.css';

render(
  <StrictMode>
    <LoginForm />
  </StrictMode>,
  document.getElementById('root')
);
