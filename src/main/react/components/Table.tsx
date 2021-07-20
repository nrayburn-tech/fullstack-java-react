import { Table as AntTable, TableProps as AntTableProps } from 'antd';
import React from 'react';

import { Data } from '../types';

export type TableProps<T extends Data> = Omit<AntTableProps<T>, 'rowKey'>;

function Table<T extends Data>(props: TableProps<T>) {
  return <AntTable rowKey='id' {...props} />;
}

export default Table;
