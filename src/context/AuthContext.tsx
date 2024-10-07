import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { LoginService, UserCreate, UserPublic, UsersService } from '../client';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const LOCALSTORAGE_ACCESS_TOKEN_NAME='access_token'
interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  user: UserPublic | undefined,
  setUser: React.Dispatch<React.SetStateAction<UserPublic | undefined>>
}
//const url = 'http://alang-main.griffin-vibes.ts.net/api/v1/login/access-token';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//implement things in AuthContextType and add to AuthContext, so return of useAuth has access to these things in whole project
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserPublic>();
  useEffect(() => {
     getUser()
    const token = localStorage.getItem(LOCALSTORAGE_ACCESS_TOKEN_NAME);
    if (token) {
      setIsAuthenticated(true);
    }
    // setInterval(()=>{
    //   console.log("ppp");
      
    // },10)
    console.log("AuthProvider useEffect");
    
  }, []);
  const getUser = async() =>{
    const {data, error} = await UsersService.readUserMe()
    if(error){
      message.error("获取用户信息失败: " + error);
    }
    setUser(data)
  }
  // const checkTOkenValidation=async()=>{
  //   const res:UserPublic = await LoginService.testToken()
  //   if(!res.is_active){
  //     navigate('/login')
  //   }

  // }
  const login = (token: string) => {
    localStorage.setItem(LOCALSTORAGE_ACCESS_TOKEN_NAME, token);
    setIsAuthenticated(true);
    
  };

  const logout = () => {
    localStorage.removeItem(LOCALSTORAGE_ACCESS_TOKEN_NAME);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, setUser }}>
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
