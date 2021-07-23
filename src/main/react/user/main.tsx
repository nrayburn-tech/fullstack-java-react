import { Button, Col, Row } from 'antd';
import React, { lazy, StrictMode, Suspense } from 'react';
import { render } from 'react-dom';

import '../index.css';
import Auth from '../context/auth';

const UserForm = lazy(() => import('./UserForm'));

render(
  <StrictMode>
    <Auth>
      <Row>
        <Col span={2} offset={22}>
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
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Suspense fallback='Loading...'>
            <UserForm />
          </Suspense>
        </Col>
      </Row>
    </Auth>
  </StrictMode>,
  document.getElementById('root')
);
