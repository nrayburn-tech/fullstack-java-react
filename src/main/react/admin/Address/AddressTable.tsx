import { Button, Table } from 'antd';
import type { ColumnProps } from 'antd/es/table';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { fetchJSON } from '../../lib/fetch';
import type { Address, User } from '../../types';

import AddressForm from './AddressForm';

const url = '/api/address';
export function AddressTable() {
  const [id, setId] = useState(0);
  const [data, setData] = useState<User[]>([]);
  const [rows, setRows] = useState<number[]>([]);

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

  const columns: ColumnProps<Address>[] = useMemo(() => {
    return [
      {
        title: 'Actions',
        render: (val, record) => {
          return (
            <Button
              onClick={() => {
                setId(record.id);
                // De-select the other rows, so it is clear what was opened.
                setRows([record.id]);
              }}
            >
              Open
            </Button>
          );
        },
        width: '100px'
      },
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

  const refreshData = useCallback(async () => {
    const resData = await fetchJSON(url);
    setData(resData);
  }, []);

  const createRecord = useCallback(async () => {
    // Send an empty body, so it doesn't error on the backend.
    const data = await fetchJSON(url, { method: 'POST', body: JSON.stringify({}) });
    // Set the id, so it automatically opens the new form.
    setId(data.id);
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
    // De-select the rows in the table, except the one we had open.
    setRows([id]);
    // Set the id to close the form.
    setId(0);
    // Update the table's data.
    await refreshData();
  }, [id, refreshData]);

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
            setRows(selected as number[]);
          }
        }}
      />
      {/* Only render if id is truthy */}
      {id ? <AddressForm id={id} afterCancel={handleCancel} afterOk={handleOk} /> : null}
    </div>
  );
}
