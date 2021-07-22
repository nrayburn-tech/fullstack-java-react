import type { ColumnProps } from 'antd/es/table';
import React, { useMemo } from 'react';

import AddressFormComp from '../../components/AddressForm';
import TableWithForm from '../../components/TableWithForm';
import type { Address } from '../../types';

export function AddressTable({ userId }: { userId?: number }) {
  const columns: ColumnProps<Address>[] = useMemo(() => {
    return [
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
  }, []);

  return (
    <div>
      <TableWithForm
        url='/api/address'
        urlList={userId ? `/api/user/address/${userId}` : undefined}
        columns={columns}
        modal={{ title: 'Address' }}
      >
        <AddressFormComp />
      </TableWithForm>
    </div>
  );
}
