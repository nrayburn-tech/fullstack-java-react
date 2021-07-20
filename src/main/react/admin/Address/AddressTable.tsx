import type { ColumnProps } from 'antd/es/table';
import React, { useMemo } from 'react';

import AddressFormComp from '../../components/AddressForm';
import TableWithForm from '../../components/TableWithForm';
import type { Address } from '../../types';

const url = '/api/address';
export function AddressTable() {
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
      <TableWithForm url={url} columns={columns}>
        <AddressFormComp />
      </TableWithForm>
    </div>
  );
}
