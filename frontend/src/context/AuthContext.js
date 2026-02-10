import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        checkAuthStatus();
    }, []);
    const checkAuthStatus = async () => {
        try {
            const response = await axios.get('/api/v1/auth/check', { withCredentials: true });
            if (response.data.IsAuthenticated) {
                setIsAuthenticated(true);
                setUsername(response.data.Username);
            }
        }
        catch (error) {
            setIsAuthenticated(false);
            setUsername(null);
        }
        finally {
            setIsLoading(false);
        }
    };
    const login = async (username, password) => {
        try {
            const response = await axios.post('/api/v1/auth/login', { Username: username, Password: password }, { withCredentials: true });
            if (response.data.Success) {
                setIsAuthenticated(true);
                setUsername(username);
                return true;
            }
            return false;
        }
        catch (error) {
            return false;
        }
    };
    const logout = async () => {
        try {
            await axios.post('/api/v1/auth/logout', {}, { withCredentials: true });
        }
        finally {
            setIsAuthenticated(false);
            setUsername(null);
        }
    };
    return (_jsx(AuthContext.Provider, { value: { isAuthenticated, username, login, logout, isLoading }, children: children }));
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
