import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import './login.css';

async function login(user: string, pass: string, remember: boolean) {
  const formData = new FormData();
  formData.append('username', user);
  formData.append('password', pass);
  formData.append('remember', String(remember));
  const res = await fetch('/api/login', {
    method: 'POST',
    body: formData
  });

  // Re-direct on no error.
  if (res.ok || res.redirected) {
    window.location.href = window.location.origin;
  }
}

function LoginForm() {
  const onFinish = async (values: any) => {
    await login(values.username, values.password, values.remember);
  };

  return (
    <Form initialValues={{ remember: true }} onFinish={onFinish} className='login-form'>
      <Form.Item
        label='Username'
        name='username'
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label='Password'
        name='password'
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item name='remember' valuePropName='checked'>
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Button type='primary' htmlType='submit'>
        Submit
      </Button>
    </Form>
  );
}

export default LoginForm;
