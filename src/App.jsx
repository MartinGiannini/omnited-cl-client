import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { useSelector } from 'react-redux';
// project import
import router from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import { CircularProgress, Box, Typography } from '@mui/material'; // Importa componentes de MUI
import { useWebSocketInicial } from './services/websocket/useWebSocketInicial'

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {

  const userDataLoaded = useWebSocketInicial();
  const dialogState = useSelector((state) => state.dialog);

  if (!userDataLoaded) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando datos del usuario...
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeCustomization>
      <ScrollTop>
        <RouterProvider router={router} />
      </ScrollTop>
    </ThemeCustomization>
  );

}