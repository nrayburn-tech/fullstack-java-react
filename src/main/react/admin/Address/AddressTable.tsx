import type { ColumnProps } from 'antd/es/table';
import React from 'react';

import AddressFormComp from '../../components/AddressForm';
import TableWithForm from '../../components/TableWithForm';
import type { Address } from '../../types';

const addressColumns: ColumnProps<Address>[] = [
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
export function AddressTable({ userId }: { userId?: number }) {
  return (
    <div>
      <TableWithForm
        url='/api/address'
        urlList={userId ? `/api/user/address/${userId}` : undefined}
        columns={addressColumns}
        modal={{ title: 'Address' }}
      >
        <AddressFormComp />
      </TableWithForm>
    </div>
  );
}

export default AddressTable;
