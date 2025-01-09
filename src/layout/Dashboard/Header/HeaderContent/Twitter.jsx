import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Importa useSelector y useDispatch
import { useTheme } from '@mui/material/styles';
import { IconButton, Popper, Paper, Grid, Box, Button, Typography, ClickAwayListener, TextField } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter'; // Ícono de whatsapp

import { setVistaActiva } from '../../../../store/whatsAppSlice';

export default function Twitter() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const anchorRef = useRef(null);

  const twitterConfig = useSelector((state) => state.storeTwitter);

  const handleToggle = () => {
    dispatch(setVistaActiva('twitter')); // Cambiar la vista a 'whatsapp'
  };

  // Cambiar el color y el relleno según el estado de conexión
  const getIconStyles = () => {
    switch (twitterConfig.connectionStatus) {
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
        <TwitterIcon style={{ fontSize: '1.5rem' }} />
      </IconButton>
    </Box>
  );
}