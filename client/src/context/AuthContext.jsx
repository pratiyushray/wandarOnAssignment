import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/auth/me', {
                method: 'GET',
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setUser(data.data);
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error(err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };


    const register = async (userData) => {
        setError(null);
        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(userData),
            });

            const data = await res.json();

            if (data.success) {
                await checkUserLoggedIn();
                return true;
            } else {
                setError(data.error);
                return false;
            }
        } catch (err) {
            setError('Registration failed. Please try again.');
            return false;
        }
    };

    const login = async (email, password) => {
        setError(null);
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.success) {
                await checkUserLoggedIn();
                return true;
            } else {
                setError(data.error);
                return false;
            }
        } catch (err) {
            setError('Login failed. Please check your network.');
            return false;
        }
    };

    const logout = async () => {
        try {
            await fetch('http://localhost:5000/api/auth/logout', {});
            setUser(null);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
