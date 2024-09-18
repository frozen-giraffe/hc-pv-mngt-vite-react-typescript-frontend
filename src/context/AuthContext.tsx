import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserCreate, UserPublic, UsersService } from '../client';

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
    const token = localStorage.getItem(LOCALSTORAGE_ACCESS_TOKEN_NAME);
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  // const getUser = () =>{
  //   UsersService.readUserMe().then((user:UserPublic)=>{
     
  //   }).catch((reason)=>{
  //     console.log(reason);
  //   })
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
