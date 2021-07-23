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
  enabled?: boolean;
  roles?: string[];
  phoneOne?: string;
  phoneTwo?: string;
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
