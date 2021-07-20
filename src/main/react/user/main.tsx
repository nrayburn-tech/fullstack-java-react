import { Button } from 'antd';
import React, { StrictMode } from 'react';
import { render } from 'react-dom';

import UserForm from './UserForm';
import '../index.css';

render(
  <StrictMode>
    <div>
      <Button
        onClick={async () => {
          const res = await fetch('/api/logout');
          if (res.redirected) {
            window.location.href = res.url;
          }
        }}
      >
        Logout
      </Button>
      <UserForm />
    </div>
  </StrictMode>,
  document.getElementById('root')
);
