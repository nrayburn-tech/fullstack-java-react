import { Button, Checkbox, Col, Form, Input, Row } from 'antd';
import React from 'react';

import './login.css';
import { fetchJSON } from '../lib/fetch';
import { Login } from '../types';

async function loginUser(user: string, pass: string, remember?: boolean) {
  const formData = new FormData();
  formData.append('username', user);
  formData.append('password', pass);
  formData.append('remember', String(!!remember));
  const res = await fetch('/api/login', {
    method: 'POST',
    body: formData
  });

  // Re-direct on no error.
  if (res.ok || res.redirected) {
    window.location.href = window.location.origin;
  }
}

async function registerUser(user: string, pass: string) {
  await fetchJSON('/api/user/register', {
    method: 'POST',
    body: JSON.stringify({ email: user, password: pass })
  });
}

function LoginForm() {
  const [form] = Form.useForm<Login>();
  const login = async (values: Login) => {
    await loginUser(values.username, values.password, values.remember);
  };

  const register = async () => {
    const { username, password } = form.getFieldsValue(true);
    await registerUser(username, password);
  };

  return (
    <Form<Login>
      initialValues={{ remember: true }}
      onFinish={login}
      form={form}
      className='login-form'
    >
      <Row>
        <Col span={24}>
          <Form.Item
            label='Username'
            name='username'
            rules={[{ required: true, message: 'Please input your username!' }]}
            labelCol={{ span: 24 }}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label='Password'
            name='password'
            rules={[{ required: true, message: 'Please input your password!' }]}
            labelCol={{ span: 24 }}
          >
            <Input.Password />
          </Form.Item>
        </Col>
      </Row>

      <Row style={{ marginBottom: '24px' }}>
        <Col span={12}>
          <Form.Item name='remember' valuePropName='checked' style={{ marginBottom: '0' }}>
            <Checkbox>Remember Me</Checkbox>
          </Form.Item>
        </Col>
        <Col span={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button htmlType='button' onClick={register}>
            Register
          </Button>
        </Col>
      </Row>

      <Button type='primary' htmlType='submit'>
        Submit
      </Button>
    </Form>
  );
}

export default LoginForm;
