import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { AuthProvider, LOCALSTORAGE_ACCESS_TOKEN_NAME } from './context/AuthContext.tsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './main.css'
import { client } from './client/services.gen.ts';
import { AppRoutes } from './routes/AppRoutes';

client.setConfig({
  baseUrl: "http://localhost:8001",
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
    localStorage.setItem('redirect_login_reason', 'token_expired');
    const currentPath = window.location.pathname;
    window.location.href = "/login?redirect=" + currentPath;
  }
  return response;
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <Routes>
          {AppRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </AuthProvider>
    </Router>
  </StrictMode>,
)
