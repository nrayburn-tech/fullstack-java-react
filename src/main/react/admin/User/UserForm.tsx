import React, { useEffect, MouseEvent, useCallback, useState } from 'react';
import { Form, Modal } from 'antd';
import UserFormComp, { getUser, updateUser } from '../../components/UserForm';

import type { FormProps, User } from '../../types';

const { useForm } = Form;

function UserForm({ id, beforeCancel, beforeOk, afterCancel, afterOk }: FormProps) {
  const [form] = useForm<User>();
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    getUser(id, signal)
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

        await updateUser(data);
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
    [afterOk, beforeOk, form]
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
        <UserFormComp />
      </Form>
    </Modal>
  );
}

export default UserForm;
