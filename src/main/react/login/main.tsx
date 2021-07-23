import React, { StrictMode } from 'react';
import { render } from 'react-dom';

import Auth from '../context/auth';

import LoginForm from './LoginForm';

import '../index.css';

render(
  <StrictMode>
    <Auth>
      <LoginForm />
    </Auth>
  </StrictMode>,
  document.getElementById('root')
);
