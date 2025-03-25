import { Navigate } from 'react-router-dom';
import { validateToken } from '../../services/api';
import { useEffect, useState } from 'react';
import Loading from '../Loading';
import { toast } from 'react-toastify';

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isValid = await validateToken();
        // const isValid = true;
        toast.success(`Welcome back ${JSON.parse(localStorage.getItem('user')).username}`, {
          draggable: true,
        });
        setIsAuthenticated(isValid);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      // <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-700 to-red-500 flex items-center justify-center">
      //   <div className="bg-white p-8 rounded-lg shadow-md">
      //     <p className="text-gray-600">Validating session...</p>
      //   </div>
      // </div>
      <Loading />
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}