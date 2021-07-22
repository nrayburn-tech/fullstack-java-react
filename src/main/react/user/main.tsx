import { Button, Col, Row } from 'antd';
import React, { lazy, StrictMode, Suspense } from 'react';
import { render } from 'react-dom';

import '../index.css';

const UserForm = lazy(() => import('./UserForm'));

render(
  <StrictMode>
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
  </StrictMode>,
  document.getElementById('root')
);
