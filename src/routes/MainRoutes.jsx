import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

const TestNotificaciones = Loadable(lazy(() => import('pages/component-overview/test-notificaciones')));
const Usuarios = Loadable(lazy(() => import('pages/component-overview/usuarios')));
const Grupos = Loadable(lazy(() => import('pages/component-overview/grupos')));
const Colas = Loadable(lazy(() => import('pages/component-overview/colas')));
const WhatsApp = Loadable(lazy(() => import('pages/component-overview/whatsapp')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'whatsapp',
      element: <WhatsApp />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'colas',
      element: <Colas />
    },
    {
      path: 'grupos',
      element: <Grupos />
    },
    {
      path: 'usuarios',
      element: <Usuarios />
    },
    {
      path: 'test-notificaciones',
      element: <TestNotificaciones />
    },
    {
      path: 'typography',
      element: <Typography />
    }
  ]
};

export default MainRoutes;