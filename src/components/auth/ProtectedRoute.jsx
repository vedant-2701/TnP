import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Loading from '../Loading';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return <Loading />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}