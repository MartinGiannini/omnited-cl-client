import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Importa useSelector y useDispatch
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Transitions from 'components/@extended/Transitions';
import MainCard from 'components/MainCard';
import { IconButton, Popper, Paper, Grid, Box, Button, Typography, ClickAwayListener, TextField } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp'; // Ícono de whatsapp
import BackspaceOutlined from '@mui/icons-material/BackspaceOutlined'; // Ícono para borrar
import Hangup from '@mui/icons-material/CallEnd';
import Call from '@mui/icons-material/Call'
import PauseCircleOutlineOutlined from '@mui/icons-material/PauseCircleOutlineOutlined'; // Ícono de hold
import TransferWithinAStationOutlined from '@mui/icons-material/TransferWithinAStationOutlined'; // Ícono de transferir
import MicOffOutlined from '@mui/icons-material/MicOffOutlined';
import { useWebRTC } from '../../../../services/webrtc/phone.service';
import { setVistaActiva } from '../../../../store/whatsAppSlice';

export default function WhatsApp() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const anchorRef = useRef(null);

  const whatsAppConfig = useSelector((state) => state.storeWhatsApp);

  const handleToggle = () => {
    dispatch(setVistaActiva('whatsapp')); // Cambiar la vista a 'whatsapp'
  };

  // Cambiar el color y el relleno según el estado de conexión
  const getIconStyles = () => {
    switch (whatsAppConfig.connectionStatus) {
      case 0: // Desconectado
        return { color: 'grey', bgcolor: 'transparent' };
      case 1: // Conectado
        return { color: 'white', bgcolor: 'green', boxShadow: '0 0 8px 2px rgba(0, 255, 0, 0.6)' };
      case 2: // Llamando
        return { color: 'white', bgcolor: 'orange', boxShadow: '0 0 8px 2px rgba(255, 165, 0, 0.6)' };
      case 3: // Llamada establecida
        return { color: 'white', bgcolor: 'red', boxShadow: '0 0 8px 2px rgba(255, 0, 0, 0.6)' };
      default:
        return { color: 'grey', bgcolor: 'transparent' };
    }
  };

  const { color, bgcolor, boxShadow } = getIconStyles();

  return (
    <Box sx={{ paddingLeft: 1, ml: { xs: 0, md: 1 } }}>
      <IconButton ref={anchorRef} color="secondary" variant="light" sx={{ 
        color: color,
        bgcolor: bgcolor,
        boxShadow: boxShadow,
        borderRadius: '50%', // Hacer el fondo redondeado
        p: 0.2, // Ajustar padding para reducir el tamaño del círculo
        transition: 'all 0.3s', // Suavizar las transiciones
        '&:hover': {
          bgcolor: bgcolor, // Mantener el color de fondo
          opacity: 0.5, // Reducir opacidad al pasar el ratón
        },
      }} aria-label="open phone keypad" onClick={handleToggle}>
        <WhatsAppIcon style={{ fontSize: '1.5rem' }} />
      </IconButton>
    </Box>
  );
}