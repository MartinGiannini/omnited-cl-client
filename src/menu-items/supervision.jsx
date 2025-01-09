// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined,
  UserAddOutlined,
  LayoutFilled,
  CaretUpFilled,
  StarFilled,
  GroupOutlined
} from '@ant-design/icons';

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined,
  UserAddOutlined,
  LayoutFilled,
  CaretUpFilled,
  StarFilled,
  GroupOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const supervision = {
  id: 'supervision',
  title: 'Supervisión',
  type: 'group',
  children: [
    {
      id: 'Usuarios',
      title: 'Usuarios',
      type: 'item',
      url: '/usuarios',
      icon: icons.UserAddOutlined
    },
    {
      id: 'Colas',
      title: 'Colas',
      type: 'item',
      url: '/colas',
      icon: icons.LayoutFilled
    },
    {
      id: 'Habilidades',
      title: 'Habilidades',
      type: 'item',
      url: '/habilidades',
      icon: icons.CaretUpFilled
    },
    {
      id: 'Estados',
      title: 'Estados',
      type: 'item',
      url: '/estados',
      icon: icons.StarFilled
    },
    {
      id: 'Grupos',
      title: 'Grupos',
      type: 'item',
      url: '/grupos',
      icon: icons.GroupOutlined
    },
    {
      id: 'util-typography',
      title: 'Typography',
      type: 'item',
      url: '/typography',
      icon: icons.FontSizeOutlined
    },
    {
      id: 'Test-Notificaciones',
      title: 'TestNotificaciones',
      type: 'item',
      url: '/test-notificaciones',
      icon: icons.FontSizeOutlined
    },
    {
      id: 'util-color',
      title: 'Color',
      type: 'item',
      url: '/color',
      icon: icons.BgColorsOutlined
    },
    {
      id: 'util-shadow',
      title: 'Shadow',
      type: 'item',
      url: '/shadow',
      icon: icons.BarcodeOutlined
    }
  ]
};

export default supervision;
