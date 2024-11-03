import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { AuthProvider, LOCALSTORAGE_ACCESS_TOKEN_NAME } from './context/AuthContext.tsx';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './main.css'
import { client } from './client/services.gen.ts';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { REDIRECT_LOGIN_REASON_KEY } from './client/const.tsx';
import { NotificationProvider } from './context/NotificationContext.tsx';

import { MenuComponent } from './routers/MenuComponent';
import { Login } from './routers/Login';
import Dashboard from './routers/Dashboard';
import { Employees } from './routers/Employees';
import { Projects } from './routers/Projects';
import { ProjectDetail } from './routers/ProjectDetail';
import { CalculationSettings } from './routers/CalculationSettings';
import { AuthenticatedRoute } from './components/AuthenticatedRoute';
import SystemManagement from './routers/SystemManagement';
import NotFound from './routers/NotFound';

client.setConfig({
  baseUrl: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use((request) => {
  request.headers.set('Authorization', 'Bearer ' + localStorage.getItem(LOCALSTORAGE_ACCESS_TOKEN_NAME));
  return request;
});

client.interceptors.response.use((response) => {
  if (response.status === 401) {
    localStorage.removeItem(LOCALSTORAGE_ACCESS_TOKEN_NAME);
    localStorage.setItem(REDIRECT_LOGIN_REASON_KEY, 'token_expired');
    const currentPath = window.location.pathname;
    const currentParams = new URLSearchParams(window.location.search);
    const params = new URLSearchParams();
    params.set('redirect', currentPath + '?' + currentParams.toString());
    window.location.href = "/login?" + params.toString();
  }
  return response;
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider locale={zhCN}>
      <Router>
        <AuthProvider>
          <NotificationProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <AuthenticatedRoute>
                  <MenuComponent>
                    <Navigate to="/dashboard" replace />
                  </MenuComponent>
                </AuthenticatedRoute>
              } />
              <Route path="/dashboard" element={
                <AuthenticatedRoute>
                  <MenuComponent>
                    <Dashboard/>
                  </MenuComponent>
                </AuthenticatedRoute>
              } />
              <Route path="/employees" element={
                <AuthenticatedRoute>
                  <MenuComponent>
                    <Employees/>
                  </MenuComponent>
                </AuthenticatedRoute>
              } />
              <Route path="/projects" element={
                <AuthenticatedRoute>
                  <MenuComponent>
                    <Projects/>
                  </MenuComponent>
                </AuthenticatedRoute>
              } />
              <Route path="/projects/:id" element={
                <AuthenticatedRoute>
                  <MenuComponent>
                    <ProjectDetail/>
                  </MenuComponent>
                </AuthenticatedRoute>
              } />
              <Route path="/calculation-settings" element={
                <AuthenticatedRoute>
                  <MenuComponent>
                    <CalculationSettings />
                  </MenuComponent>
                </AuthenticatedRoute>
              } />
              <Route path="/system-management" element={
                <AuthenticatedRoute>
                  <MenuComponent>
                    <SystemManagement />
                  </MenuComponent>
                </AuthenticatedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </Router>
    </ConfigProvider>
  </StrictMode>,
)
