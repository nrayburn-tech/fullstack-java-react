import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import UserForm from './UserForm';
import '../index.css';

render(
  <StrictMode>
    <UserForm />
  </StrictMode>,
  document.getElementById('root')
);
