import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { OpenAPI } from './client';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { Dashboard } from './routers/Dashboard.tsx';
import { Login } from './routers/Login.tsx';
import { MainPage } from './routers/MainPage.tsx';
import { Employees } from './routers/Employees.tsx';
import { Projects } from './routers/Projects.tsx';
import { ProjectDetail } from './routers/ProjectDetail.tsx';
//console.log('aa '+localStorage.getItem("access_token"));

OpenAPI.BASE = "http://alang-main.griffin-vibes.ts.net"
OpenAPI.TOKEN = async () => {
  return localStorage.getItem("access_token") || ""
}
const AuthenticatedRoute: React.FC<{ children: React.ReactNode}> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthenticatedRoute>
        <Dashboard>
          <MainPage/>
        </Dashboard>
      </AuthenticatedRoute>),
    
  },
  {
    path: "/login",
    element: <Login />,
    
  },
  {
    path: "/dashboard",
    element: (
    <AuthenticatedRoute>
      <Dashboard>
          <MainPage/>
        </Dashboard>
    </AuthenticatedRoute>),
    
  },
  {
    path: "/mainpage",
    element: (
      <AuthenticatedRoute>
        <Dashboard>
          <MainPage/>
        </Dashboard>
      </AuthenticatedRoute>),
    
  },
  {
    path: "/people",
    element: (
      <AuthenticatedRoute>
        <Dashboard>
          <Employees/>
        </Dashboard>
      </AuthenticatedRoute>),
    
  },
  {
    path: "/projects",
    element: (
      <AuthenticatedRoute>
        <Dashboard>
          <Projects/>
        </Dashboard>
      </AuthenticatedRoute>),
    
  },
  {
    path: "/projects-detail",
    element: (
      <AuthenticatedRoute>
        <Dashboard>
          <ProjectDetail/>
        </Dashboard>
      </AuthenticatedRoute>),
    
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
