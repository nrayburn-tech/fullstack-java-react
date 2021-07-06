import React from 'react';
import { Tabs } from 'antd';
import { UserTable } from './User/UserTable';
import { AddressTable } from './Address/AddressTable';

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
