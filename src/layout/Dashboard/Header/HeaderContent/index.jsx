import { useSelector } from 'react-redux';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';

// project import
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';
import Phone from './Phone'
import WhatsApp from './WhatsApp';
import Twitter from './Twitter';
import Messages from './Messages'
import States from './States';
import Espacio from './Espacio';

// project import

import { WebRTCProvider } from '../../../../services/webrtc/phone.service';

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const casRol = useSelector((state) => state.storeCas.casRol);
  const permisosOperacion = useSelector((state) => state.storeUsuario.usuarioPermisoOperacion);

  // Mapeo de componentes por nombre de permiso
  const permisosComponentes = {
    States: { componente: <States key="States" />, orden: 0 },
    Phone: { componente: <Phone key="Phone" />, orden: 1 },
    WhatsApp: { componente: <WhatsApp key="WhatsApp" />, orden: 2 },
    Twitter: { componente: <Twitter key="Twitter" />, orden: 3 }
  };

  // Define los componentes según el rol
  const renderPrimaryComponentsByRole = (rol, permisos) => {
    switch (rol) {
      case 'Administrador':
        return (
          <>
            <Espacio />
            {/* none */}
          </>
        );
      case 'Supervisor':
        return (
          <>
            {permisos
            .map((permiso) => permisosComponentes[permiso.permisoNombre]) // Mapea permisos a componentes
            .filter((item) => item) // Filtra componentes válidos
            .sort((a, b) => a.orden - b.orden) // Ordena por el atributo `orden`
            .map((item) => item.componente)} {/* Renderiza los componentes ordenados */}
            <Espacio />
          </>
        );
      case 'Operador':
        return (
          <>
            {permisos
            .map((permiso) => permisosComponentes[permiso.nombre]) // Mapea permisos a componentes
            .filter((item) => item) // Filtra componentes válidos
            .sort((a, b) => a.orden - b.orden) // Ordena por el atributo `orden`
            .map((item) => item.componente)} {/* Renderiza los componentes ordenados */}
            <Espacio />
          </>
        );
      default:
        return null; // Si no hay un rol definido
    }
  };

  const renderSecondaryComponentsByRole = (rol) => {
    switch (rol) {
      case 'Administrador':
        return (
          <>
            <Notification />
          </>
        );
      case 'Supervisor':
        return (
          <>
            <Messages />
            <Notification />
          </>
        );
      case 'Operador':
        return (
          <>
            <Messages />
            <Notification />
          </>
        );
      default:
        return null; // Si no hay un rol definido
    }
  };

  return (
    <>
      <WebRTCProvider>
        {/*
        <States />
        <Phone />
        <WhatsApp />
        <Twitter />
        */}
        {renderPrimaryComponentsByRole(casRol, permisosOperacion)}
      </WebRTCProvider>

      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}
      {renderSecondaryComponentsByRole(casRol)}
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
}
