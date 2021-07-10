import { SelectProps } from 'antd';
import React, { ChangeEventHandler, ReactNode } from 'react';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});

jest.mock('antd', () => {
  const antd = jest.requireActual('antd');

  const Select = (props: Omit<SelectProps<any>, 'onChange'> & { onChange: ChangeEventHandler }) => {
    return (
      // eslint-disable-next-line jsx-a11y/no-onchange
      <select
        value={props.value}
        defaultValue={props.defaultValue}
        disabled={props.disabled}
        className={props.className}
        onChange={props.onChange}
        id={props.id}
      >
        {props.children}
      </select>
    );
  };

  Select.Option = ({ children, ...otherProps }: { children: ReactNode; value: string }) => (
    <option {...otherProps}>{children}</option>
  );

  Select.OptGroup = ({ children, ...otherProps }: { children: ReactNode; label: string }) => (
    <optgroup {...otherProps}>{children}</optgroup>
  );

  return { ...antd, Select };
});
