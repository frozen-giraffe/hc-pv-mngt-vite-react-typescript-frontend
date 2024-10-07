import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { LoginService, OpenAPI } from './client';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { Dashboard } from './routers/Dashboard.tsx';
import { Login } from './routers/Login.tsx';
import MainPage  from './routers/MainPage.tsx';
import { Employees } from './routers/Employees.tsx';
import { Projects } from './routers/Projects.tsx';
import { ProjectDetail } from './routers/ProjectDetail.tsx';
import { Interceptors } from './client/core/OpenAPI.ts';
import { AxiosRequestConfig } from 'axios';
import './main.css'
//console.log('aa '+localStorage.getItem("access_token"));

//OpenAPI.BASE = "http://alang-main.griffin-vibes.ts.net:8000"
OpenAPI.BASE = "http://api.aaronyou.photos"
OpenAPI.TOKEN = async () => {
  return localStorage.getItem("access_token") || ""
}
OpenAPI.interceptors.request.use(async(request) => {
   console.log("laal");
  
   console.log(request);
   console.log("laal");
  //const token = localStorage.getItem('token');
  // const res = await LoginService.testToken()
  // if(res.is_active){
  //   console.log("yes");
    
  // }
  
  return request; // <-- must return request
});
OpenAPI.interceptors.response.use((response)=>{
  console.log("1111");
  
   console.log(response);
   if(response.status === 401){

   }
   console.log("1111");
   return response
})

const AuthenticatedRoute: React.FC<{ children: React.ReactNode}> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated+"11");
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
