import { Form } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import UserFormComp, { getUser, updateUser } from '../components/UserForm';
import { User } from '../types';

const { useForm } = Form;

const labelCol = { span: 24 };

let dataChangeTimeout: number;
function UserForm() {
  const [form] = useForm();
  const [initialValues, setInitialValues] = useState<User>();
  useEffect(() => {
    getUser(null).then((data) => {
      setInitialValues(data);
    });
  }, [form]);

  const handleDataChange = useCallback(() => {
    clearTimeout(dataChangeTimeout);
    dataChangeTimeout = window.setTimeout(() => {
      const touched: any[] = [];
      const saveData = form.getFieldsValue(true, (meta) => {
        if (meta.name.join('.') === 'id') {
          return true;
        }
        if (meta.touched && !meta.errors.length) {
          touched.push({ ...meta, touched: false });
        }
        return meta.touched;
      });

      updateUser(saveData).then(() => {
        form.setFields(touched);
      });
    }, 500);
  }, [form]);

  return initialValues ? (
    <Form<User>
      form={form}
      labelCol={labelCol}
      onFieldsChange={handleDataChange}
      initialValues={initialValues}
    >
      <UserFormComp />
    </Form>
  ) : null;
}

export default UserForm;
