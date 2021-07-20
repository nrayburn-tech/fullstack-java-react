import { render } from '@testing-library/react';
import React from 'react';

import UserForm from './UserForm';

const renderForm = () => {
  const utils = render(<UserForm id={1} />);

  const firstName = utils.getByLabelText('First Name');
  const lastName = utils.getByLabelText('Last Name');
  const email = utils.getByLabelText('Email');
  const enabled = utils.getByLabelText('Enabled');
  const phoneOne = utils.getByLabelText('Phone One');
  const phoneTwo = utils.getByLabelText('Phone Two');
  const roles = utils.getByLabelText('Roles');

  return {
    utils,
    firstName,
    lastName,
    email,
    enabled,
    phoneOne,
    phoneTwo,
    roles
  };
};
