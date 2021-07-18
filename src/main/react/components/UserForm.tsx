import { Checkbox, Col, Form, Input, Row, Select } from 'antd';
import React from 'react';
import { User } from '../types';
import { fetchJSON } from '../lib/fetch';

const { Item } = Form;
const { Option } = Select;

function UserForm() {
  return (
    <>
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
    </>
  );
}

export async function updateUser(data: User): Promise<User> {
  return await fetchJSON('/api/user', { method: 'PATCH', body: JSON.stringify(data) });
}

export async function getUser(id: number | null, signal?: AbortSignal): Promise<User> {
  return await fetchJSON(`/api/user/${id ? id : 'auth'}`, { signal });
}

export default UserForm;
