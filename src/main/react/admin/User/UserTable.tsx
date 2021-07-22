import type { ColumnProps } from 'antd/es/table';
import React, { useMemo } from 'react';

import TableWithForm from '../../components/TableWithForm';
import UserFormComp from '../../components/UserForm';
import type { User } from '../../types';

const url = '/api/user';
export function UserTable() {
  const columns: ColumnProps<User>[] = useMemo(() => {
    return [
      {
        title: 'First Name',
        dataIndex: 'firstName'
      },
      {
        title: 'Last Name',
        dataIndex: 'lastName'
      }
    ];
  }, []);

  return (
    <div>
      <TableWithForm url={url} columns={columns} modal={{ title: 'User' }}>
        <UserFormComp />
      </TableWithForm>
    </div>
  );
}
