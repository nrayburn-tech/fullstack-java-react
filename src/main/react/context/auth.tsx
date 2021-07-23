import React, { createContext, ReactNode, useEffect, useState } from 'react';

import { fetchJSON } from '../lib/fetch';
import { User } from '../types';

export const AuthContext = createContext<User | null>(null);

function Auth({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<User | null>(null);

  useEffect(() => {
    fetchJSON('/api/user/auth').then((data) => {
      setAuth(data);
    });
  }, []);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export default Auth;
