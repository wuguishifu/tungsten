import { createContext, useCallback, useContext, useEffect, useState } from 'react';

type AuthContextProps = {
  username: null | string;
  ready: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext({} as AuthContextProps);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: Readonly<React.ReactNode> }) {
  const [username, setUsername] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth');
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const data = await response.json();
      setUsername(data.username);
    } catch (error) {
      setUsername(null);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const response = await fetch('/api/auth/login', {
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
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUsername(null);
  }, []);

  const value = {
    username,
    ready,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
