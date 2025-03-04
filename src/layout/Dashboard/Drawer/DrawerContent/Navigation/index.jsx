import React from 'react';
import { useSelector } from 'react-redux';

// material-ui
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //
// ============================== ACA SE DEBE FILTRAR EL MENU de NAVEGACION IZQUIERDO ======================== //

export default function Navigation() {

  const usuarioPermisoAdministracion = useSelector((state) => state.storeUsuario.usuarioPermisoAdministracion);
  const usuarioPermisoSupervision = useSelector((state) => state.storeUsuario.usuarioPermisoSupervision);
  const usuarioPermisoOperacion = useSelector((state) => state.storeUsuario.usuarioPermisoOperacion);

  // Extraer los IDs permitidos de permisosAdministracion
  const permisosAdministracionIds = usuarioPermisoAdministracion.map((permiso) => permiso.permisoNombre);

  // Extraer los IDs permitidos de permisosSupervision
  const permisosSupervisionIds = usuarioPermisoSupervision.map((permiso) => permiso.permisoNombre);

  // Extraer los IDs permitidos de permisosOperacion
  const permisosOperacionIds = usuarioPermisoOperacion.map((permiso) => permiso.permisoNombre);

  let filteredMenu;

  const navGroups = menuItem.items.map((menu) => {

    if (menu.id === 'administracion') {
      filteredMenu = {
        ...menu,
        children: menu.children.filter(child => permisosAdministracionIds.includes(child.id))
      };
    } else {
      if (menu.id === 'supervision') {
        filteredMenu = {
          ...menu,
          children: menu.children.filter(child => permisosSupervisionIds.includes(child.id))
        };
      } else {
        if (menu.id === 'operacion') {
          filteredMenu = {
            ...menu,
            children: menu.children.filter(child => permisosOperacionIds.includes(child.id))
          };
        } else {
          filteredMenu = menu
        }
      }
    }

    switch (filteredMenu.type) {
      case 'group':
        return <NavGroup key={filteredMenu.id} item={filteredMenu} />;
      default:
        return (
          <Typography key={filteredMenu.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
}