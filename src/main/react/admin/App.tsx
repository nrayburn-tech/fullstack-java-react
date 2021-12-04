import { Tabs } from 'antd';
import React, { lazy, Suspense } from 'react';

import Auth from '../context/auth';

const { TabPane } = Tabs;

const AddressTable = lazy(() => import('./Address/AddressTable'));
const UserTable = lazy(() => import('./User/UserTable'));

function App() {
  return (
    <Auth>
      <div>
        <Tabs defaultActiveKey='1'>
          <TabPane tab='User' key='1'>
            <Suspense fallback='Loading...'>
              <UserTable />
            </Suspense>
          </TabPane>
          <TabPane tab='Address' key='2'>
            <Suspense fallback='Loading...'>
              <AddressTable />
            </Suspense>
          </TabPane>
        </Tabs>
      </div>
    </Auth>
  );
}

export default App;
