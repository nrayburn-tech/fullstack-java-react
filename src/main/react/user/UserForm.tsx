import { Form } from 'antd';
import { cloneDeep, unset } from 'lodash';
import React, { useCallback, useEffect } from 'react';

import UserFormComp, { getUser, updateUser } from '../components/UserForm';
import { User } from '../types';

const { useForm } = Form;

const labelCol = { span: 24 };

let dataChangeTimeout: number;
function UserForm() {
  const [form] = useForm();
  useEffect(() => {
    getUser(null).then((data) => {
      form.setFieldsValue(data);
    });
  }, [form]);

  const handleDataChange = useCallback(
    (data) => {
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
    },
    [form]
  );

  return (
    <Form<User> form={form} labelCol={labelCol} onFieldsChange={handleDataChange}>
      <UserFormComp />
    </Form>
  );
}

export default UserForm;
