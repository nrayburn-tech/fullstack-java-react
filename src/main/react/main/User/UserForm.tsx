import React, { useEffect, MouseEvent, useCallback, useState } from 'react';
import { Checkbox, Col, Form, Input, Modal, Row, Select } from 'antd';
import { fetchJSON } from '../lib/fetch';

import type { FormProps, User } from '../../types';

const { Item, useForm } = Form;
const { Option } = Select;

const url = '/api/user';
function UserForm({ id, beforeCancel, beforeOk, afterCancel, afterOk }: FormProps) {
  const [form] = useForm<User>();
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetchJSON(url + '/' + id, { signal: signal })
      .then((data) => {
        form.setFieldsValue(data);
        setVisible(true);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          throw err;
        }
      });

    return () => controller.abort();
  }, [form, id]);

  const handleOk = useCallback(
    async (e: MouseEvent<HTMLElement>) => {
      beforeOk?.(e);

      try {
        const data = await form.validateFields();

        await fetchJSON(url, {
          method: 'PATCH',
          body: JSON.stringify(data)
        });
        afterOk?.(e);
        setVisible(false);
      } catch (err) {
        // Re-throw if not a form validation error.
        // If it is a validation error, the fields already
        // update to show the errors.
        if (!err.errorFields) {
          throw err;
        }
      }
    },
    [afterOk, beforeOk, form, id]
  );

  const handleCancel = useCallback(
    async (e: MouseEvent<HTMLElement>) => {
      beforeCancel?.(e);
      afterCancel?.(e);
      setVisible(false);
    },
    [afterCancel, beforeCancel]
  );

  return (
    <Modal title='User' visible={isVisible} onCancel={handleCancel} onOk={handleOk}>
      <Form<User> form={form} labelCol={{ span: 24 }}>
        <Item hidden name='id'>
          <Input autoComplete='off' />
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
              rules={[
                { required: true, message: 'Please input your email address.', type: 'email' }
              ]}
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
    </Modal>
  );
}

export default UserForm;
