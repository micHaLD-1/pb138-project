import { createContext, useContext, useState } from 'react';

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = () => setUser({ firstName: 'Dev', lastName: 'User', email: 'dev@test.com' });
  const logout = () => setUser(null);
  const updateUser = (updates: Partial<User>) => {
    setUser((current) => (current ? { ...current, ...updates } : current));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}