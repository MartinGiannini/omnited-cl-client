// assets
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined
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
      url: '/usuariosAdmin',
      icon: icons.LoginOutlined
    },
    {
      id: 'Colas',
      title: 'Colas',
      type: 'item',
      url: '/colasAdmin',
      icon: icons.ProfileOutlined
    }
  ]
};

export default administracion;
