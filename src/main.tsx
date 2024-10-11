import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { AuthProvider, useAuth, LOCALSTORAGE_ACCESS_TOKEN_NAME } from './context/AuthContext.tsx';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { Dashboard } from './routers/Dashboard.tsx';
import { Login } from './routers/Login.tsx';
import MainPage from './routers/MainPage.tsx';
import { Employees } from './routers/Employees.tsx';
import { Projects } from './routers/Projects.tsx';
import { ProjectDetail } from './routers/ProjectDetail.tsx';
import {  SystemConfig } from './routers/SystemConfig.tsx';
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
    const currentPath = window.location.pathname;
    window.location.href = "/login?redirect=" + currentPath;
  }
  return response;
})


//console.log('aa '+localStorage.getItem("access_token"));

////OpenAPI.BASE = "http://alang-main.griffin-vibes.ts.net:8000"
// OpenAPI.BASE = "http://api.aaronyou.photos"
// OpenAPI.BASE = "http://localhost:8001"
// OpenAPI.TOKEN = async () => {
//   return localStorage.getItem("access_token") || ""
// }
// OpenAPI.interceptors.request.use(async(request) => {
//    console.log("laal");
  
//    console.log(request);
//    console.log("laal");
//   //const token = localStorage.getItem('token');
//   // const res = await LoginService.testToken()
//   // if(res.is_active){
//   //   console.log("yes");
    
//   // }
  
//   return request; // <-- must return request
// });
// OpenAPI.interceptors.response.use((response)=>{
//   console.log("1111");
  
//    console.log(response);
//    if(response.status === 401){

//    }
//    console.log("1111");
//    return response
// })

const AuthenticatedRoute: React.FC<{ children: React.ReactNode}> = ({ children }) => {
  const { isAuthenticated, } = useAuth();
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
  {
    path: "/settings",
    element: (
      <AuthenticatedRoute>
        <Dashboard>
          <SystemConfig />
        </Dashboard>
      </AuthenticatedRoute>
    ),
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
