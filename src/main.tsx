import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { AuthProvider, useAuth, LOCALSTORAGE_ACCESS_TOKEN_NAME } from './context/AuthContext.tsx';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Dashboard } from './routers/Dashboard.tsx';
import { Login } from './routers/Login.tsx';
import MainPage from './routers/MainPage.tsx';
import { Employees } from './routers/Employees.tsx';
import { Projects } from './routers/Projects.tsx';
import { ProjectDetail } from './routers/ProjectDetail.tsx';
import { SystemConfig } from './routers/SystemConfig.tsx';
import './main.css'
import { client } from './client/services.gen.ts';

client.setConfig({
  baseUrl: "http://localhost:8001",
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use((request, options) => {
  request.headers.set('Authorization', 'Bearer ' + localStorage.getItem(LOCALSTORAGE_ACCESS_TOKEN_NAME));
  return request;
});

client.interceptors.response.use((response)=>{
  if (response.status === 401) {
    localStorage.removeItem(LOCALSTORAGE_ACCESS_TOKEN_NAME);
    localStorage.setItem('redirect_login_reason', 'token_expired');
    const currentPath = window.location.pathname;
    window.location.href = "/login?redirect=" + currentPath;
  }
  return response;
})

const AuthenticatedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, checkAuth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={
      <AuthenticatedRoute>
        <Dashboard>
          <MainPage/>
        </Dashboard>
      </AuthenticatedRoute>
    } />
    <Route path="/dashboard" element={
      <AuthenticatedRoute>
        <Dashboard>
          <MainPage/>
        </Dashboard>
      </AuthenticatedRoute>
    } />
    <Route path="/mainpage" element={
      <AuthenticatedRoute>
        <Dashboard>
          <MainPage/>
        </Dashboard>
      </AuthenticatedRoute>
    } />
    <Route path="/people" element={
      <AuthenticatedRoute>
        <Dashboard>
          <Employees/>
        </Dashboard>
      </AuthenticatedRoute>
    } />
    <Route path="/projects" element={
      <AuthenticatedRoute>
        <Dashboard>
          <Projects/>
        </Dashboard>
      </AuthenticatedRoute>
    } />
    <Route path="/projects-detail" element={
      <AuthenticatedRoute>
        <Dashboard>
          <ProjectDetail/>
        </Dashboard>
      </AuthenticatedRoute>
    } />
    <Route path="/settings" element={
      <AuthenticatedRoute>
        <Dashboard>
          <SystemConfig />
        </Dashboard>
      </AuthenticatedRoute>
    } />
  </Routes>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  </StrictMode>,
)
