// assets
import { LoginOutlined, ProfileOutlined, CaretUpFilled, StarFilled } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  CaretUpFilled,
  StarFilled
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const administracion = {
  id: 'administracion',
  title: 'Administración',
  type: 'group',
  children: [
    {
      id: 'Usuarios',
      title: 'Usuarios',
      type: 'item',
      url: '/usuarios_admin',
      icon: icons.LoginOutlined
    },
    {
      id: 'Colas',
      title: 'Colas',
      type: 'item',
      url: '/colas_admin',
      icon: icons.ProfileOutlined
    },
    {
      id: 'Estados',
      title: 'Estados',
      type: 'item',
      url: '/estados_admin',
      icon: icons.StarFilled
    },
    {
      id: 'Habilidades',
      title: 'Habilidades',
      type: 'item',
      url: '/habilidades_admin',
      icon: icons.StarFilled
    },
    {
      id: 'BotEditor',
      title: 'BotEditor',
      type: 'item',
      url: '/botEditor',
      icon: icons.StarFilled
    }
  ]
};

export default administracion;
