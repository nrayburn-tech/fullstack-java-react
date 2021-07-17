import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { Button, Table } from 'antd';
import UserForm from './UserForm';
import { fetchJSON } from '../lib/fetch';

import type { ColumnProps } from 'antd/es/table';
import type { User } from '../../types';

type IdAction = { id: number; type: 'id' };
type RowAction = { rows: number[]; type: 'rows' };
type IdAndRowAction = { id: number; rows: number[]; type: 'id_rows' };

function reducer(
  state: { id: number; rows: number[] },
  action: IdAction | RowAction | IdAndRowAction
) {
  if (action.type === 'id') {
    return { ...state, id: action.id };
  } else if (action.type === 'rows') {
    return { ...state, rows: action.rows };
  } else if (action.type === 'id_rows') {
    return { id: action.id, rows: action.rows };
  }
  throw new Error('Incorrect action type supplied.');
}

const url = '/api/user';
export function UserTable() {
  const [data, setData] = useState<User[]>([]);
  const [{ id, rows }, dispatch] = useReducer(reducer, { id: 0, rows: [] });

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetchJSON(url, { signal: signal })
      .then((data) => {
        setData(data);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          throw err;
        }
      });
    return () => controller.abort();
  }, []);

  const columns: ColumnProps<User>[] = useMemo(() => {
    return [
      {
        title: 'Actions',
        render: (val, record) => {
          return (
            <Button
              onClick={() => {
                dispatch({ type: 'id_rows', id: record.id, rows: [record.id] });
              }}
            >
              Open
            </Button>
          );
        },
        width: '100px'
      },
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

  const refreshData = useCallback(async () => {
    const resData = await fetchJSON(url);
    setData(resData);
  }, []);

  const createRecord = useCallback(async () => {
    // Send an empty body, so it doesn't error on the backend.
    const data = await fetchJSON(url, { method: 'POST', body: JSON.stringify({}) });
    // Set the id, so it automatically opens the new form.
    dispatch({ type: 'id', id: data.id });
    // Eventually update the tables data, timeout to let rendering the form have priority.
    setTimeout(refreshData, 100);
  }, [refreshData]);

  const deleteSelected = useCallback(async () => {
    async function deleteRecord(id: number) {
      const res = await fetch(url + '/' + id, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error('Deleting record failed.');
      }
    }
    for (const row of rows) {
      await deleteRecord(row);
    }
    await refreshData();
  }, [refreshData, rows]);

  const closeForm = useCallback(async () => {
    // TODO: Doesn't seem to work like I expect it to.
    // Set the id to close the form.
    dispatch({ type: 'id', id: 0 });
    // Update the table's data.
    await refreshData();
  }, [refreshData]);

  const handleOk = useCallback(async () => {
    await closeForm();
  }, [closeForm]);

  const handleCancel = useCallback(async () => {
    await closeForm();
  }, [closeForm]);

  return (
    <div>
      <Table<User>
        title={() => {
          return (
            <div>
              <Button onClick={createRecord} style={{ margin: '0 10px' }}>
                Create
              </Button>
              <Button onClick={refreshData} style={{ margin: '0 10px' }}>
                Refresh
              </Button>
              <Button onClick={deleteSelected} style={{ margin: '0 10px' }}>
                Delete
              </Button>
            </div>
          );
        }}
        columns={columns}
        dataSource={data}
        rowKey='id'
        rowSelection={{
          selectedRowKeys: rows,
          onChange: (selected) => {
            dispatch({ type: 'rows', rows: selected as number[] });
          }
        }}
      />
      {/* Only render if id is truthy */}
      {id ? <UserForm id={id} afterCancel={handleCancel} afterOk={handleOk} /> : null}
    </div>
  );
}
