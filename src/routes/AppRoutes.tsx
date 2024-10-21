import { MenuComponent } from '../routers/MenuComponent';
import { Login } from '../routers/Login';
import Dashboard from '../routers/Dashboard';
import { Employees } from '../routers/Employees';
import { Projects } from '../routers/Projects';
import { ProjectDetail } from '../routers/ProjectDetail';
import { CalculationSettings } from '../routers/CalculationSettings';
import { AuthenticatedRoute } from '../components/AuthenticatedRoute';
import SystemManagement from '../routers/SystemManagement';
import { Navigate } from 'react-router-dom';
import NotFound from '../routers/NotFound';

export const AppRoutes = [
  { path: "/login", element: <Login /> },
  { 
    path: "/", 
    element: (
      <AuthenticatedRoute>
        <MenuComponent>
          <Navigate to="/dashboard" replace />
        </MenuComponent>
      </AuthenticatedRoute>
    )
  },
  { 
    path: "/dashboard", 
    element: (
      <AuthenticatedRoute>
        <MenuComponent>
          <Dashboard/>
        </MenuComponent>
      </AuthenticatedRoute>
    )
  },
  { 
    path: "/employees", 
    element: (
      <AuthenticatedRoute>
        <MenuComponent>
          <Employees/>
        </MenuComponent>
      </AuthenticatedRoute>
    )
  },
  { 
    path: "/projects", 
    element: (
      <AuthenticatedRoute>
        <MenuComponent>
          <Projects/>
        </MenuComponent>
      </AuthenticatedRoute>
    )
  },
  { 
    path: "/project/detail", 
    element: (
      <AuthenticatedRoute>
        <MenuComponent>
          <ProjectDetail/>
        </MenuComponent>
      </AuthenticatedRoute>
    )
  },
  { 
    path: "/calculation-settings", 
    element: (
      <AuthenticatedRoute>
        <MenuComponent>
          <CalculationSettings />
        </MenuComponent>
      </AuthenticatedRoute>
    )
  },
  { 
    path: "/system-management", 
    element: (
      <AuthenticatedRoute>
        <MenuComponent>
          <SystemManagement />
        </MenuComponent>
      </AuthenticatedRoute>
    )
  },
  // Add the 404 route at the end
  { 
    path: "*", 
    element: <NotFound />
  }
];
