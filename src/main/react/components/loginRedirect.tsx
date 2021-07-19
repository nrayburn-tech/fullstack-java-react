import React from 'react';
import { notification } from 'antd';

export type redirect = (url: string) => void;
/**
 * Show a notification with a link to open the login
 * page in a new tab/page.
 */
function loginRedirect(url: string) {
  notification.info({
    key: 'login-redirect',
    message: 'You are not logged in',
    description: (
      <div>
        Click{' '}
        <a
          href={url}
          target='_blank'
          onClick={() => {
            notification.close('login-redirect');
          }}
          rel='noreferrer'
        >
          here
        </a>{' '}
        to open the login page.
      </div>
    ),
    duration: 0
  });
}

export default loginRedirect;
