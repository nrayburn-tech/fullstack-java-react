import React, { useCallback, useEffect } from 'react';
import { Checkbox, Col, Form, Input, Row, Select } from 'antd';
import { cloneDeep, unset } from 'lodash';
import { User } from '../types';

const { Item, useForm } = Form;
const { Option } = Select;

async function updateUser(data: User) {
  const res = await fetch('/api/user', {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  await res.json();
}

async function getUser(): Promise<User> {
  const res = await fetch('/api/user/auth', { headers: { 'Content-Type': 'application/json' } });
  return await res.json();
}

const labelCol = { span: 24 };

let dataChangeTimeout: number;
function UserForm() {
  const [form] = useForm();
  useEffect(() => {
    getUser().then((data) => {
      form.setFieldsValue(data);
    });
  }, []);

  const handleDataChange = useCallback((data) => {
    if (!Array.isArray(data)) {
      return;
    }
    clearTimeout(dataChangeTimeout);
    dataChangeTimeout = window.setTimeout(() => {
      const saveData = cloneDeep(form.getFieldsValue());
      for (let i = 0; i < data.length; i++) {
        if (data[i].errors.length) {
          unset(saveData, data[i].name);
        }
      }
      updateUser(saveData).then();
    }, 500);
  }, []);

  return (
    <Form<User> form={form} labelCol={labelCol} onFieldsChange={handleDataChange}>
      <Item hidden name='id'>
        <Input />
      </Item>
      <Row>
        <Col span={10}>
          <Item
            name='firstName'
            label='First Name'
            rules={[{ required: true, message: 'Please input your first name.' }]}
          >
            <Input autoComplete='off' />
          </Item>
        </Col>
        <Col span={10} offset={2}>
          <Item
            name='lastName'
            label='Last Name'
            rules={[{ required: true, message: 'Please input your last name.' }]}
          >
            <Input autoComplete='off' />
          </Item>
        </Col>
      </Row>
      <Row>
        <Col span={16}>
          <Item
            name='email'
            label='Email'
            rules={[{ required: true, message: 'Please input your email address.', type: 'email' }]}
          >
            <Input autoComplete='off' />
          </Item>
        </Col>
        <Col span={6} offset={2}>
          <Item name='enabled' label='Enabled' valuePropName='checked'>
            <Checkbox />
          </Item>
        </Col>
      </Row>
      <Row>
        <Col span={10}>
          <Item
            name='phoneOne'
            label='Phone One'
            rules={[{ required: true, message: 'Please input your phone number.' }]}
          >
            <Input autoComplete='off' />
          </Item>
        </Col>
        <Col span={10} offset={2}>
          <Item name='phoneTwo' label='Phone Two'>
            <Input autoComplete='off' />
          </Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Item name='roles' label='Roles'>
            <Select mode='multiple' allowClear>
              <Option value='USER'>User</Option>
              <Option value='ADMIN'>Admin</Option>
            </Select>
          </Item>
        </Col>
      </Row>
    </Form>
  );
}

export default UserForm;
