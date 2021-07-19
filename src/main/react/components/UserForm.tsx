import { Button, Checkbox, Col, Form, FormInstance, Input, Row, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { Address, User } from '../types';
import { fetchJSON } from '../lib/fetch';
import { ColumnProps } from 'antd/lib/table';

const { Item } = Form;
const { Option } = Select;

const addressColumns: ColumnProps<Address>[] = [
  {
    title: 'Actions',
    render: (val, record) => {
      return <Button onClick={() => {}}>Open</Button>;
    },
    width: '100px'
  },
  {
    title: 'Line One',
    dataIndex: 'lineOne'
  },
  {
    title: 'Line Two',
    dataIndex: 'lineTwo'
  },
  {
    title: 'City',
    dataIndex: 'city'
  },
  {
    title: 'State',
    dataIndex: 'state'
  },
  {
    title: 'Zip',
    dataIndex: 'zip'
  }
];

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
      <Row>
        <Col span={24}>
          <Item
            noStyle
            shouldUpdate={(prev, incoming) => {
              return prev?.id !== incoming?.id;
            }}
          >
            {(form: FormInstance<User>) => {
              return <AddressTable userId={form.getFieldValue('id')} />;
            }}
          </Item>
        </Col>
      </Row>
    </>
  );
}

function AddressTable({ userId }: { userId: number }) {
  const [tableData, setTableData] = useState<Address[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if (userId) {
      getAddressList(userId, signal)
        .then((data) => {
          setTableData(data);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            throw err;
          }
        });
    }
    return () => controller.abort();
  }, [userId]);

  return <Table columns={addressColumns} dataSource={tableData} />;
}

export async function updateUser(data: User): Promise<User> {
  return await fetchJSON('/api/user', { method: 'PATCH', body: JSON.stringify(data) });
}

export async function getUser(id: number | null, signal?: AbortSignal): Promise<User> {
  return await fetchJSON(`/api/user/${id ? id : 'auth'}`, { signal });
}

export async function getAddressList(id: number | null, signal: AbortSignal): Promise<Address[]> {
  return await fetchJSON(`/api/user/address/${id}`, { signal });
}

export default UserForm;
