import { Button, Col, Row } from 'antd';
import React, { StrictMode } from 'react';
import { render } from 'react-dom';

import UserForm from './UserForm';
import '../index.css';

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
        <UserForm />
      </Col>
    </Row>
  </StrictMode>,
  document.getElementById('root')
);
