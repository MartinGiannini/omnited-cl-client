import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// assets
import EditOutlined from '@ant-design/icons/EditOutlined';
import ProfileOutlined from '@ant-design/icons/ProfileOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';

import casSessionService from '../../../../../services/session/authentication/casSessionService';
import useCasService from '../../../../../services/cas/cas.service';
import { casLogoutSuccess } from '../../../../../store/casSlice';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

export default function ProfileTab() {
  const dispatch = useDispatch();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { clearCasAuthentication } = casSessionService();
  const { logout } = useCasService();

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

  const handleLogOutClick = () => {
    logout()
      .then((response) => {
        clearCasAuthentication();
        dispatch(casLogoutSuccess());
        window.location.href = response;
      })
      .catch((err) => {
        console.error('ERROR: ', err);
      });
  }

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0, '/apps/profiles/user/personal')}>
        <ListItemIcon>
          <EditOutlined />
        </ListItemIcon>
        <ListItemText primary="Editar Perfil" />
      </ListItemButton>
      <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1, '/apps/profiles/account/basic')}>
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="Ver Perfil" />
      </ListItemButton>
      <ListItemButton selected={selectedIndex === 2} onClick={(event) => handleLogOutClick()}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="Salir" />
      </ListItemButton>
    </List>
  );
}

ProfileTab.propTypes = { handleLogout: PropTypes.func };
