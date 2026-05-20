import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return null; // or a spinner

  return isLoggedIn ? <>{children}</> : <Navigate to="/" replace />;
}