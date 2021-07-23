import { MouseEvent } from 'react';

interface Entity {
  id: number;
  createDate?: Date;
  modifyDate?: Date;
}

export interface Data extends Entity {
  [key: string]: any;
}

export interface Login {
  username: string;
  password: string;
  remember?: boolean;
}

export interface User extends Entity {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

export interface Address extends Entity {
  lineOne?: string;
  lineTwo?: string;
  lineThree?: string;
  lineFour?: string;
  city?: string;
  zip?: string;
  state?: string;
}

export interface FormProps {
  /** Id of the record to fetch. */
  id: number;
  /** Always run first on cancel. */
  beforeCancel?: (e: MouseEvent<HTMLElement>) => void;
  /** Always run first on ok. */
  beforeOk?: (e: MouseEvent<HTMLElement>) => void;
  /** Always run last on cancel. */
  afterCancel?: (e: MouseEvent<HTMLElement>) => void;
  /** Always run last on ok, if form validates and saves. */
  afterOk?: (e: MouseEvent<HTMLElement>) => void;
}
