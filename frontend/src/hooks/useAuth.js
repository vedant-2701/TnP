import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { validateToken } from '../services/api';
import { toast } from 'react-toastify';
import { getUser } from '../utils/userStorage';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading, true/false = resolved
    //   const navigate = useNavigate();

    const checkAuth = async () => {
        try {
            const isValid = await validateToken();
            setIsAuthenticated(isValid);
            if (isValid) {
                const user = getUser();
                if (user?.username) {
                    toast.success(`Welcome back ${user.username}`, { draggable: true });
                }
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Token validation failed:', error);
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return { isAuthenticated, checkAuth };
};

export default useAuth;