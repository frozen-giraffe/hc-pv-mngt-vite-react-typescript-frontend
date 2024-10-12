import React from 'react';
import { Dashboard } from '../routers/Dashboard';
import { Login } from '../routers/Login';
import MainPage from '../routers/MainPage';
import { Employees } from '../routers/Employees';
import { Projects } from '../routers/Projects';
import { ProjectDetail } from '../routers/ProjectDetail';
import { CalculationSettings } from '../routers/CalculationSettings';
import { AuthenticatedRoute } from '../components/AuthenticatedRoute';
import SystemManagement from '../routers/SystemManagement';

export const AppRoutes = [
  { path: "/login", element: <Login /> },
  { 
    path: "/", 
    element: (
      <AuthenticatedRoute>
        <Dashboard>
          <MainPage/>
        </Dashboard>
      </AuthenticatedRoute>
    )
  },
  { 
    path: "/dashboard", 
    element: (
      <AuthenticatedRoute>
        <Dashboard>
          <MainPage/>
        </Dashboard>
      </AuthenticatedRoute>
    )
  },
  { 
    path: "/people", 
    element: (
      <AuthenticatedRoute>
        <Dashboard>
          <Employees/>
        </Dashboard>
      </AuthenticatedRoute>
    )
  },
  { 
    path: "/projects", 
    element: (
      <AuthenticatedRoute>
        <Dashboard>
          <Projects/>
        </Dashboard>
      </AuthenticatedRoute>
    )
  },
  { 
    path: "/projects-detail", 
    element: (
      <AuthenticatedRoute>
        <Dashboard>
          <ProjectDetail/>
        </Dashboard>
      </AuthenticatedRoute>
    )
  },
  { 
    path: "/calculation-settings", 
    element: (
      <AuthenticatedRoute>
        <Dashboard>
          <CalculationSettings />
        </Dashboard>
      </AuthenticatedRoute>
    )
  },
  { 
    path: "/system-management", 
    element: (
      <AuthenticatedRoute>
        <Dashboard>
          <SystemManagement />
        </Dashboard>
      </AuthenticatedRoute>
    )
  }
];