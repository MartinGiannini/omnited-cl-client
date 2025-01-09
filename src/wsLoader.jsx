import React, { useEffect, useState } from 'react';
import App from './App'; // Aplicación principal
import { useSelector } from 'react-redux';
import { CircularProgress, Box, Typography } from '@mui/material'; // Importa componentes de MUI
import WebSocketService from './services/websocket/websocket.service';

export default function WSLoader() {
  const wsConnectionStatus = useSelector((state) => state.storeWebsocket.connectionStatus);
  const [isWebSocketReady, setIsWebSocketReady] = useState(false);

  // Monitorear el estado del WebSocket
  useEffect(() => {
    if (wsConnectionStatus === 1) { // 1 corresponde al estado "Conectado"
      setIsWebSocketReady(true);
    }
  }, [wsConnectionStatus]);

  // Pantalla de carga mientras el WebSocket no está listo
  if (!isWebSocketReady) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Conectando al WebSocket...
        </Typography>
      </Box>
    );
  }

  // Carga la aplicación principal cuando el WebSocket esté listo
  return (
    <App />
  );
}