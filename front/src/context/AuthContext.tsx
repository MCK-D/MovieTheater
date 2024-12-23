import React, { createContext, useContext, useState, useEffect } from 'react';
import UserResponse from '../interfaces/UserResponse.tsx';
import { fetchWrapper } from '../FetchWrapper.tsx';

interface AuthContextType {
  user: null | UserResponse;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

// Initialize context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  register: async () => {},
  login: async () => {},
  logout: () => {},
  checkAuth: async () => {},
  fetchUser: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [user, setUser] = useState<UserResponse | null>(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
    }
    return null;
  });

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetchWrapper(`${import.meta.env.VITE_API_URL}/api/user/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }, logout);

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      } else {
        const errorData = await response.json();
        console.error(`Failed to fetch user: ${errorData.message}`);
        setUser(null);
      }
    } catch (error) {
      console.error('Fetch user error:', error);
      setUser(null);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await fetchWrapper(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      }, logout);

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      } else {
        // Handle different response statuses
        const errorData = await response.json();
        throw new Error(errorData.message || 'An unknown error occurred.');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      } else {
        throw new Error('An unexpected error occurred.');
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetchWrapper(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      }, logout);

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        await fetchUser(); // Fetch the full user data from /me
      } else {
        throw await response.json();
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetchWrapper(`${import.meta.env.VITE_API_URL}/api/auth/checkAuth`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }, logout);

      if (response.ok) {
        fetchUser(); // Fetch user data if authentication check is successful
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Check auth error:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) fetchUser();
  }, []);

  return (
      <AuthContext.Provider value={{ user, register, login, logout, checkAuth, fetchUser }}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
