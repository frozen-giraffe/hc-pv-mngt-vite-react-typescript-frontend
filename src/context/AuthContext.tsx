import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { UserPublic, UsersService, LoginService } from '../client';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

export const LOCALSTORAGE_ACCESS_TOKEN_NAME = 'access_token';

interface AuthContextType {
  isAuthenticated: boolean | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  user: UserPublic | undefined;
  setUser: React.Dispatch<React.SetStateAction<UserPublic | undefined>>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<UserPublic>();
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem(LOCALSTORAGE_ACCESS_TOKEN_NAME);
    if (token) {
      try {
        await getUser();
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to authenticate:', error);
        logout();
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const getUser = async () => {
    if (!localStorage.getItem(LOCALSTORAGE_ACCESS_TOKEN_NAME)) {
      console.log("getUserMe失败: 没有Token");
      throw new Error("No token available");
    }
    const { data, error } = await UsersService.readUserMe();
    if (error) {
      message.error("获取用户信息失败: " + error);
      throw error;
    }
    if (!data?.is_active) {
      throw new Error("User is not active");
    }
    setUser(data);
  };

  const login = async (username: string, password: string) => {
    try {
      const { data, error } = await LoginService.loginAccessToken({ body: { username, password } });
      if (error) throw error;
      if (!data) throw new Error("No data received from login");
      
      localStorage.setItem(LOCALSTORAGE_ACCESS_TOKEN_NAME, data.access_token);
      await getUser();
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem(LOCALSTORAGE_ACCESS_TOKEN_NAME);
    setIsAuthenticated(false);
    setUser(undefined);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, setUser, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
