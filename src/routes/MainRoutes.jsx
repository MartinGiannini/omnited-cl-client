import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const PanelMonitoria = Loadable(lazy(() => import('pages/component-overview/panel_monitoria')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

const TestNotificaciones = Loadable(lazy(() => import('pages/component-overview/test-notificaciones')));
const UsuariosSuper = Loadable(lazy(() => import('pages/component-overview/usuarios_super')));
const UsuariosAdmin = Loadable(lazy(() => import('pages/component-overview/usuarios_admin')));
const Grupos = Loadable(lazy(() => import('pages/component-overview/grupos_super')));
const ColasSuper = Loadable(lazy(() => import('pages/component-overview/colas_super')));
const ColasAdmin = Loadable(lazy(() => import('pages/component-overview/colas_admin')));
const WhatsApp = Loadable(lazy(() => import('pages/component-overview/whatsapp_opera')));

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
      path: 'whatsapp_opera',
      element: <WhatsApp />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'colas_admin',
      element: <ColasAdmin />
    },
    {
      path: 'colas_super',
      element: <ColasSuper />
    },
    {
      path: 'usuarios_admin',
      element: <UsuariosAdmin />
    },
    {
      path: 'usuarios_super',
      element: <UsuariosSuper />
    },
    {
      path: 'habilidades_admin',
      element: <ColasSuper />
    },
    {
      path: 'estados_admin',
      element: <ColasAdmin />
    },
    {
      path: 'grupos_super',
      element: <Grupos />
    },
    {
      path: 'test-notificaciones',
      element: <TestNotificaciones />
    },
    {
      path: 'panel_monitoria',
      element: <PanelMonitoria />
    }
  ]
};

export default MainRoutes;