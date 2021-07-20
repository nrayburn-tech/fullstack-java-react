import { Table as AntTable, TableProps as AntTableProps } from 'antd';
import React from 'react';

export type TableProps<T extends Record<string, any>> = Omit<AntTableProps<T>, 'rowKey'>;

function Table<T extends Record<string, any>>(props: TableProps<T>) {
  return <AntTable rowKey='id' {...props} />;
}

export default Table;
