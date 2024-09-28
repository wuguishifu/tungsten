import endpoints from '@/lib/endpoints';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

type AuthContextProps = {
  username: null | string;
  ready: boolean;
  register: (username: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<string>;
  logout: () => Promise<void>;
};

const AuthContext = createContext({} as AuthContextProps);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: Readonly<React.ReactNode> }) {
  const [username, setUsername] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const authTimeout = useRef<NodeJS.Timeout | null>(null);

  const refreshAuth = useCallback(async () => {
    try {
      const response = await fetch(endpoints.users.refresh, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const data = await response.json();
      setUsername(data.username);

      if (authTimeout.current) {
        clearTimeout(authTimeout.current);
      }
      authTimeout.current = setTimeout(refreshAuth, data.tokenExpirationMs - 10000);
    } catch (error) {
      setUsername(null);
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(error);
      }
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const login = useCallback(async (username: string, password: string): Promise<string> => {
    const response = await fetch(endpoints.users.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    setUsername(data.username);
    if (authTimeout.current) {
      clearTimeout(authTimeout.current);
    }
    authTimeout.current = setTimeout(refreshAuth, data.tokenExpirationMs - 10000);
    return data.username;
  }, [refreshAuth]);

  const logout = useCallback(async () => {
    await fetch(endpoints.users.logout, {
      method: 'POST',
    });
    setUsername(null);
  }, []);

  const register = useCallback(async (username: string, password: string) => {
    const response = await fetch(endpoints.users.register, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
      body: JSON.stringify({
        username,
        password,
      }),
    });
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    setUsername(data.username);
    if (authTimeout.current) {
      clearTimeout(authTimeout.current);
    }
    authTimeout.current = setTimeout(refreshAuth, data.tokenExpirationMs - 10000);
    return data.username;
  }, [refreshAuth]);

  const value = {
    username,
    ready,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
