import React, { useEffect, MouseEvent, useCallback, useState } from 'react';
import { AutoComplete, Button, Col, Form, Input, Modal, Row, SelectProps } from 'antd';
import { fetchJSON } from '../lib/fetch';

import type { Address, FormProps } from '../../types';

const { Item, useForm } = Form;

interface AddressResult {
  properties: AddressProperties;
}

interface AddressProperties {
  gid: string;
  country: string;
  county: string;
  housenumber: string;
  label: string;
  locality: string;
  name: string;
  postalcode: string;
  region: string;
  street: string;
}

interface OptionProps {
  label: string;
  value: string;
  props: AddressProperties;
}

let autocompleteTimer: number;
const apiKey = import.meta.env.VITE_GEOCODE_API;
const url = '/api/address';
const autocompleteUrl = 'https://api.geocode.earth/v1/autocomplete';
async function getAddressResults(text: string) {
  const url =
    `${autocompleteUrl}?api_key=${apiKey}&text=${text}` +
    // Only want addresses in the US.
    `&layers=address&boundary.gid=whosonfirst:country:85633793`;
  const data = await fetchJSON(url);
  return data.features as AddressResult[];
}
function AddressForm({ id, beforeCancel, beforeOk, afterCancel, afterOk }: FormProps) {
  const [form] = useForm<Address>();
  const [isVisible, setVisible] = useState(false);
  const [showLineTwo, setShowLineTwo] = useState(false);
  const [showLineThree, setShowLineThree] = useState(false);
  const [showLineFour, setShowLineFour] = useState(false);
  const [options, setOptions] = useState<OptionProps[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetchJSON(url + '/' + id, { signal: signal })
      .then((data) => {
        form.setFieldsValue(data);
        setVisible(true);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          throw err;
        }
      });

    return () => controller.abort();
  }, [form, id]);

  const handleOk = useCallback(
    async (e: MouseEvent<HTMLElement>) => {
      beforeOk?.(e);

      try {
        const data = await form.validateFields();

        await fetchJSON(url, {
          method: 'PATCH',
          body: JSON.stringify(data)
        });
        afterOk?.(e);
        setVisible(false);
      } catch (err) {
        // Re-throw if not a form validation error.
        // If it is a validation error, the fields already
        // update to show the errors.
        if (!err.errorFields) {
          throw err;
        }
      }
    },
    [afterOk, beforeOk, form, id]
  );

  const handleCancel = useCallback(
    async (e: MouseEvent<HTMLElement>) => {
      beforeCancel?.(e);
      afterCancel?.(e);
      setVisible(false);
    },
    [afterCancel, beforeCancel]
  );

  //TODO: Do something special if the results are less than 10 long,
  // so that some API calls can be avoided.
  const handleAddressSearch = useCallback(async (text: string) => {
    clearTimeout(autocompleteTimer);
    if (text.length < 4) {
      return;
    }
    autocompleteTimer = setTimeout(async () => {
      const results = await getAddressResults(text);
      const newOpts = [];
      for (const result of results) {
        newOpts.push({
          label: result.properties.label,
          value: result.properties.gid,
          props: result.properties
        });
      }
      setOptions(newOpts);
    }, 500);
  }, []);

  const handleAddressSelect = useCallback((value: string, opt: OptionProps) => {
    form.setFieldsValue({
      lineOne: opt.props.name,
      lineTwo: '',
      lineThree: '',
      lineFour: '',
      city: opt.props.locality,
      state: opt.props.region,
      zip: opt.props.postalcode
    });
  }, []) as SelectProps<any>['onSelect'];

  return (
    <Modal title='Address' visible={isVisible} onCancel={handleCancel} onOk={handleOk}>
      <Form<Address> form={form} labelCol={{ span: 24 }}>
        <Item hidden name='id'>
          <Input autoComplete='off' />
        </Item>
        <Row>
          <Col span={24}>
            <Item
              name='lineOne'
              label='Line One'
              rules={[{ required: true, message: 'Please input your address.' }]}
            >
              <AutoComplete
                options={options}
                onSearch={handleAddressSearch}
                onSelect={handleAddressSelect}
              />
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {showLineTwo ? (
              <Item name='lineTwo' label='Line Two'>
                <Input autoComplete='off' />
              </Item>
            ) : (
              <Button
                type='link'
                onClick={() => {
                  setShowLineTwo(true);
                }}
              >
                Show Line Two
              </Button>
            )}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {showLineTwo &&
              (showLineThree ? (
                <Item name='lineThree' label='Line Three'>
                  <Input autoComplete='off' />
                </Item>
              ) : (
                <Button
                  type='link'
                  onClick={() => {
                    setShowLineThree(true);
                  }}
                >
                  Show Line Three
                </Button>
              ))}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {showLineTwo &&
              showLineThree &&
              (showLineFour ? (
                <Item name='lineFour' label='Line Four'>
                  <Input autoComplete='off' />
                </Item>
              ) : (
                <Button
                  type='link'
                  onClick={() => {
                    setShowLineFour(true);
                  }}
                >
                  Show Line Four
                </Button>
              ))}
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <Item name='state' label='State'>
              <Input />
            </Item>
          </Col>
          <Col span={10} offset={2}>
            <Item name='city' label='City'>
              <Input />
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <Item name='zip' label='Postal Code'>
              <Input />
            </Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default AddressForm;
