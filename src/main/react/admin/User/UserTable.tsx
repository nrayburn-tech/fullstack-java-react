import type { ColumnProps } from 'antd/es/table';
import React from 'react';

import TableWithForm from '../../components/TableWithForm';
import UserFormComp from '../../components/UserForm';
import type { User } from '../../types';

const userColumns: ColumnProps<User>[] = [
  {
    title: 'First Name',
    dataIndex: 'firstName'
  },
  {
    title: 'Last Name',
    dataIndex: 'lastName'
  }
];

export function UserTable() {
  return (
    <div>
      <TableWithForm url={'/api/user'} columns={userColumns} modal={{ title: 'User' }}>
        <UserFormComp />
      </TableWithForm>
    </div>
  );
}

export default UserTable;
