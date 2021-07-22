import { Button, Form, FormInstance, Modal, ModalProps } from 'antd';
import type { ColumnProps } from 'antd/es/table';
import { merge } from 'lodash';
import React, {
  ForwardedRef,
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useReducer,
  useState
} from 'react';

import { fetchJSON } from '../lib/fetch';
import { Data } from '../types';

import Table, { TableProps } from './Table';

const { useForm } = Form;

type IdAction = { id: number; type: 'id' };
type RowAction = { rows: number[]; type: 'rows' };
type IdAndRowAction = { id: number; rows: number[]; type: 'id_rows' };
type Action = IdAction | RowAction | IdAndRowAction;
function reducer(state: { id: number; rows: number[] }, action: Action) {
  if (action.type === 'id') {
    return { ...state, id: action.id };
  } else if (action.type === 'rows') {
    return { ...state, rows: action.rows };
  } else if (action.type === 'id_rows') {
    return { id: action.id, rows: action.rows };
  }
  throw new Error('Incorrect action type supplied.');
}
export interface TableWithFormProps<T extends Data>
  extends Omit<TableProps<T>, 'dataSource' | 'title' | 'rowSelection'> {
  /** Children of the form. */
  children: ReactNode | ((props?: unknown) => ReactNode);
  /** Make columns required */
  columns: ColumnProps<T>[];
  /** Base URL of the API to call */
  url: string;
  /** Optional url if the function to get a list of records is different from the others. */
  urlList?: string;
  /** Function called before creating a record.
   * Return an object to use as the default value.
   * Return false to cancel the record from being created.
   * */
  beforeCreateRecord?: () => T | false | Promise<T | false>;
  /** Function called after creating a record. */
  afterCreateRecord?: (record: T) => void | Promise<void>;
  /** Function called before deleting a record.
   * Return false to cancel the record from being deleted.
   * */
  beforeDeleteRecord?: () => false | Promise<false>;
  /** Function called after deleting a record. */
  afterDeleteRecord?: () => void | Promise<void>;
  /** Function called before updating a record.
   * Return an object to use merge with the form data.
   * Return false to cancel the record from being updated.
   * */
  beforeSaveRecord?: () => T | false | Promise<T | false>;
  /** Function called after creating a record. */
  afterSaveRecord?: (record: T) => void | Promise<void>;
  /** Props passed to the modal */
  modal?: Omit<ModalProps, 'children' | 'visible' | 'onOk' | 'onCancel'> & {
    padding?: number | string;
  };
}
export interface TableWithAPIRef<T extends Data> {
  id: number;
  rows: readonly number[];
  data: readonly T[];
  refreshData: () => Promise<void>;
}

const TableWithForm = forwardRef(
  <T extends Data>(
    {
      afterCreateRecord,
      afterDeleteRecord,
      afterSaveRecord,
      beforeCreateRecord,
      beforeDeleteRecord,
      beforeSaveRecord,
      children,
      columns: initColumns,
      url,
      urlList,
      modal,
      ...props
    }: TableWithFormProps<T>,
    ref: ForwardedRef<unknown>
  ) => {
    const [form] = useForm();
    const [data, setData] = useState<T[]>([]);
    const [{ id, rows }, dispatch] = useReducer(reducer, { id: 0, rows: [] });

    useEffect(() => {
      const controller = new AbortController();
      const signal = controller.signal;
      fetchJSON(urlList ?? url, { signal: signal })
        .then((data) => {
          setData(data);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            throw err;
          }
        });
      return () => controller.abort();
    }, [url, urlList]);

    const refreshData = useCallback(async () => {
      const resData = await fetchJSON(urlList ?? url);
      setData(resData);
    }, [url, urlList]);

    const createRecord = useCallback(async () => {
      const initData = await beforeCreateRecord?.();
      if (initData === false) {
        return;
      }
      // Send an empty body, so it doesn't error on the backend.
      const data = await fetchJSON(url, { method: 'POST', body: JSON.stringify(initData ?? {}) });
      await afterCreateRecord?.(data);
      // Set the id, so it automatically opens the new form.
      dispatch({ type: 'id', id: data.id });
      // Eventually update the tables data, timeout to let rendering the form have priority.
      setTimeout(refreshData, 100);
    }, [afterCreateRecord, beforeCreateRecord, refreshData, url]);

    const deleteSelected = useCallback(async () => {
      async function deleteRecord(id: number) {
        const canContinue = await beforeDeleteRecord?.();
        if (canContinue === false) {
          return;
        }
        const res = await fetch(url + '/' + id, { method: 'DELETE' });
        if (!res.ok) {
          throw new Error('Deleting record failed.');
        }
        await afterDeleteRecord?.();
      }

      let errCount = 0;
      await Promise.all(
        rows.map(async (row) => {
          try {
            await deleteRecord(row);
          } catch (err) {
            errCount++;
          }
        })
      );
      console.log('There were', errCount, 'errors.');
      await refreshData();
    }, [afterDeleteRecord, beforeDeleteRecord, refreshData, rows, url]);

    const closeForm = useCallback(() => {
      form.resetFields();
      dispatch({ type: 'id', id: 0 });
      setTimeout(refreshData, 0);
    }, [form, refreshData]);

    const openForm = useCallback(
      async (id: number) => {
        const data = await fetchJSON(`${url}/${id}`);
        form.setFieldsValue(data);
        dispatch({ type: 'id_rows', id: id, rows: [id] });
      },
      [form, url]
    );

    const cancelForm = useCallback(async () => {
      form.resetFields();
      closeForm();
    }, [closeForm, form]);

    const saveForm = useCallback(async () => {
      const initData = await beforeSaveRecord?.();
      if (initData === false) {
        return;
      }
      await form.validateFields();
      const formData = form.getFieldsValue(true);
      const apiData = await fetchJSON(url, {
        method: 'PATCH',
        body: JSON.stringify(merge(formData, initData ?? {}))
      });
      await afterSaveRecord?.(apiData);
      closeForm();
    }, [afterSaveRecord, beforeSaveRecord, closeForm, form, url]);

    const columns = useMemo(() => {
      const actionColumn: ColumnProps<T> = {
        title: 'Actions',
        render: (_, { id }) => {
          return (
            <Button
              onClick={async () => {
                await openForm(id);
              }}
            >
              Open
            </Button>
          );
        },
        width: '100px'
      };
      return [actionColumn, ...initColumns];
    }, [initColumns, openForm]);

    useImperativeHandle<unknown, TableWithAPIRef<T>>(
      ref,
      () => ({
        id,
        rows,
        data,
        refreshData
      }),
      [data, id, refreshData, rows]
    );

    return (
      <div>
        <Table<T>
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
          rowSelection={{
            selectedRowKeys: rows,
            onChange: (selected) => {
              dispatch({ type: 'rows', rows: selected as number[] });
            }
          }}
          dataSource={data}
          columns={columns}
          bordered={true}
          {...props}
        />
        <TableForm
          form={form}
          modal={{ ...modal, visible: !!id, onCancel: cancelForm, onOk: saveForm }}
        >
          {children}
        </TableForm>
      </div>
    );
  }
);

interface FormProps<T extends Data> {
  children: ReactNode | ((props?: unknown) => ReactNode);
  form: FormInstance<T>;
  modal: Omit<ModalProps, 'children'> & { padding?: number | string };
}

function TableForm<T extends Data>({ children, form, modal }: FormProps<T>) {
  const myStyle = {
    padding: '0 ' + (typeof modal.padding === 'number' ? `${modal.padding}px` : modal.padding),
    ...modal.style
  };
  return (
    <Modal width='auto' {...modal} style={myStyle}>
      <Form<T> form={form}>{typeof children === 'function' ? children() : children}</Form>
    </Modal>
  );
}

export default TableWithForm;
