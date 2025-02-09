import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Importa useSelector y useDispatch
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Transitions from 'components/@extended/Transitions';
import MainCard from 'components/MainCard';
import { IconButton, Popper, Paper, Grid, Box, Button, Typography, ClickAwayListener, TextField } from '@mui/material';
import PhoneOutlined from '@mui/icons-material/PhoneOutlined'; // Ícono de teléfono
import BackspaceOutlined from '@mui/icons-material/BackspaceOutlined'; // Ícono para borrar
import Hangup from '@mui/icons-material/CallEnd';
import Call from '@mui/icons-material/Call'
import PauseCircleOutlineOutlined from '@mui/icons-material/PauseCircleOutlineOutlined'; // Ícono de hold
import TransferWithinAStationOutlined from '@mui/icons-material/TransferWithinAStationOutlined'; // Ícono de transferir
import MicOffOutlined from '@mui/icons-material/MicOffOutlined';
import { useWebRTC } from '../../../../services/webrtc/phone.service';

export default function Phone() {
  const theme = useTheme();
  
  const usuarioExtensionStatus = useSelector((state) => state.storeUsuario.usuarioExtension.connectionStatus); // Usa useSelector para obtener el estado
  
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const { startCall, handleHangup } = useWebRTC();

  // Cambiar el color y el relleno según el estado de conexión
  const getIconStyles = () => {
    switch (usuarioExtensionStatus) {
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

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleKeyPress = (value) => {
    setInputValue(prev => prev + value); // Añadir el número o símbolo al inputValue
  };

  const handleRedButton = () => {
    if (usuarioExtensionStatus === 1) {
      setInputValue(prev => prev.slice(0, -1)); // Borrar el último valor
    } else {
      handleHangup();
    }
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleHold = () => {
    //holdCall();
  };

  const handleStart = () => {
    console.log("El estado de la conexión es: ",usuarioExtensionStatus)
    if (usuarioExtensionStatus !== 1) {
      alert('No estás conectado a WebRTC');
      return;
    }
    if (inputValue) {
      startCall(inputValue);
    } else {
      alert('Ingresa un número o usuario válido para llamar');
    }
  };

  // Determinar el ícono basado en el estado de conexión
  const redButtonIcon = usuarioExtensionStatus === 1 ? <BackspaceOutlined /> : <Hangup />;

  // Agregar manejo de teclas para la marcación
  useEffect(() => {
    const handleKeyDown = (e) => {
      const validKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '*', '#'];
      if (validKeys.includes(e.key)) {
        handleKeyPress(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const id = open ? 'simple-popper' : undefined;

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
        <PhoneOutlined style={{ fontSize: '1rem' }} />
      </IconButton>

      <Popper placement={matchesXs ? 'bottom' : 'bottom-start'} open={open} anchorEl={anchorRef.current} transition disablePortal modifiers={[{ name: 'offset', options: { offset: [0, 9] } }]}>
        {({ TransitionProps }) => (
          <Transitions type="grow" position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
            <ClickAwayListener onClickAway={handleClose}>
              <Paper elevation={2} sx={{ boxShadow: 2, width: 240, padding: 1 }}>
                <MainCard title="Teclado" content={false} >
                  {/* Campo de entrada de texto para el visor */}
                  <TextField variant="outlined" fullWidth value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Ingresa número o usuario" sx={{ mb: 2, border: '1px solid #999', borderRadius: 1, bgcolor: '#f9f9f9' }} />

                  <Grid container spacing={1} sx={{ px: 0 }}>
                    {/* Botones numéricos */}
                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((item) => (
                          <Grid item xs={4} key={item}>
                            <Button variant="contained" fullWidth onClick={() => handleKeyPress(item)} sx={{ height: '35px', fontSize: '1rem', bgcolor: '#e0e0e0', color: 'text.primary', boxShadow: 3, '&:hover': { bgcolor: '#d0d0d0', boxShadow: 4 }, '&:active': { bgcolor: '#b0b0b0' }, }}>
                              {item}
                            </Button>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>

                    {/* Botones de llamada y borrado */}
                    <Grid item xs={6}>
                      <Button variant="contained" color="success" fullWidth startIcon={<Call />} onClick={handleStart} sx={{ height: '40px', boxShadow: 3, bgcolor: '#28a745', color: 'white' }}/>
                    </Grid>
                    <Grid item xs={6}>
                      <Button variant="contained" color="error" fullWidth startIcon={redButtonIcon} onClick={handleRedButton} sx={{ height: '40px', boxShadow: 3, bgcolor: '#dc3545', color: 'white' }}/>
                    </Grid>

                    {/* Botones laterales: Mute, Hold, Transferir */}
                    <Grid item xs={4}>
                      <Button variant="contained" color="warning" fullWidth startIcon={<PauseCircleOutlineOutlined />} onClick={handleHold} sx={{height: '35px',bgcolor: '#ff8800',color: 'black',boxShadow: 3,'&:hover': { bgcolor: '#ff7700' }}}/>
                    </Grid>
                    <Grid item xs={4}>
                      <Button variant="contained" color="info" fullWidth startIcon={<TransferWithinAStationOutlined />}
                        onClick={() => alert('Transferencia iniciada')}
                        sx={{ height: '35px', bgcolor: '#138496', color: 'white', boxShadow: 3, '&:hover': { bgcolor: '#117a8b' }}}/>
                    </Grid>
                    <Grid item xs={4}>
                      <Button variant="contained" color="secondary" fullWidth startIcon={<MicOffOutlined />}
                        onClick={() => alert('Silenciado')}
                        sx={{ height: '35px', bgcolor: '#bd2130', color: 'white', boxShadow: 3, '&:hover': { bgcolor: '#b71c1c' },}}/>
                    </Grid>
                  </Grid>
                </MainCard>
              </Paper>
            </ClickAwayListener>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}