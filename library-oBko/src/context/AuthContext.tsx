import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  userId: number;
  role: "ADMIN" | "STAFF" | "GUEST" | "MEMBER";
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API = '/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // true on start — checking session

  // On every app load, ask BE if there's an active session
  useEffect(() => {
    async function rehydrate() {
      try {
        const res = await fetch(`${API}/auth/me`, {
          credentials: 'include', // sends the sessionId cookie
        });
        if (res.ok) {
          const data = await res.json();
          setUser({ userId: data.data.userId, role: data.data.role });
        }
      } catch {
        // no active session, stay null
      } finally {
        setIsLoading(false);
      }
    }
    rehydrate();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      credentials: 'include', // BE will Set-Cookie: sessionId here
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message ?? 'Prihlásenie zlyhalo');
    }

    const data = await res.json();
    setUser({ userId: data.data.userId, role: data.data.role });
  };

  const logout = async () => {
    await fetch(`${API}/auth/logout`, {
      method: 'POST',
      credentials: 'include', // BE clears the cookie
    });
    setUser(null);
  };

  const register = async (data: RegisterData) => {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message ?? 'Registrácia zlyhala');
    }
    // registration doesn't log you in — user needs to sign in after
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}