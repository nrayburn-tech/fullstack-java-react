import { Tabs } from 'antd';
import React from 'react';

import { AddressTable } from './Address/AddressTable';
import { UserTable } from './User/UserTable';

const { TabPane } = Tabs;

function App() {
  return (
    <div>
      <Tabs defaultActiveKey='1'>
        <TabPane tab='User' key='1'>
          <UserTable />
        </TabPane>
        <TabPane tab='Address' key='2'>
          <AddressTable />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default App;
