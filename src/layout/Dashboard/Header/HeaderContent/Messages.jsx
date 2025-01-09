import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Popper, Paper, IconButton, TextField, Button, ClickAwayListener, List, ListItem, ListItemText, Divider, Grid, ListItemButton, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ChatOutlined from '@mui/icons-material/ChatOutlined';
import SendOutlined from '@mui/icons-material/SendOutlined';
import useMediaQuery from '@mui/material/useMediaQuery';
import { sendMessage } from '../../../../store/userMessagesSlice'; // Importar la acción para enviar mensajes

import Transitions from 'components/@extended/Transitions';

export default function Messages() {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [recipient, setRecipient] = useState('');
  const anchorRef = useRef(null);

  // Obtener la lista de destinatarios y el historial de mensajes desde el store
  const recipients = useSelector((state) => state.storeUserMessages.recipients);
  const messageHistory = useSelector((state) => state.storeUserMessages.history);

  const dispatch = useDispatch();

  // Obtener el theme y matchesXs para manejar la responsividad
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('xs'));

  // Toggle del Popper
  const handleToggle = () => setOpen((prev) => !prev);

  // Cerrar el Popper al hacer click fuera
  const handleClose = () => setOpen(false);

  // Manejo de la selección del destinatario
  const handleRecipientSelect = (selectedRecipient) => setRecipient(selectedRecipient);

  // Manejo del input para mensajes
  const handleInputChange = (event) => setInputValue(event.target.value);

  // Enviar mensaje
  const handleSendMessage = () => {
    if (inputValue && recipient) {
      // Despachar el mensaje al store
      dispatch(sendMessage({ recipient, text: inputValue }));
      setInputValue('');
    }
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      {/* Icono de mensajería */}
      <IconButton ref={anchorRef} color="secondary" variant="light" sx={{ color: 'text.primary', bgcolor: open ? 'grey.50' : 'transparent' }} aria-label="open messaging" onClick={handleToggle}>
        <ChatOutlined style={{ fontSize: '1.5rem' }} />
      </IconButton>

      {/* Popper para mensajería */}
      <Popper placement={matchesXs ? 'bottom' : 'bottom-end'} open={open} anchorEl={anchorRef.current} transition disablePortal modifiers={[{ name: 'offset', options: { offset: [matchesXs ? -5 : 0, 9] } }]}>
        {({ TransitionProps }) => (
          <Transitions type="grow" position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
            <ClickAwayListener onClickAway={handleClose}>
              <Paper elevation={3} sx={{ boxShadow: theme.customShadows.z1, width: matchesXs ? 350 : 400, p: 2 }}>
                <Grid container spacing={2}>
                  {/* Listado de destinatarios en el margen izquierdo con alto fijo y scrollbar */}
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" sx={{ mb: 0 }}>Destinatarios</Typography>
                    <List sx={{ maxHeight: 350, overflowY: 'auto', border: '1px solid #ccc' }}>
                      {recipients.map((rec, index) => (
                        <ListItemButton key={index} selected={recipient === rec} onClick={() => handleRecipientSelect(rec)}>
                          <ListItemText primary={rec} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Grid>

                  {/* Historial de mensajes en el margen derecho con alto fijo y scrollbar */}
                  <Grid item xs={8}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Historial de Mensajes</Typography>
                    <List sx={{ height: 400, overflowY: 'auto', border: '1px solid #ccc', bgcolor: '#f9f9f9' }}> {/* Alto fijo: 400px */}
                      {messageHistory.map((message, index) => (
                        <React.Fragment key={index}>
                          <ListItem>
                            <ListItemText
                              primary={<Typography variant="body1" sx={{ fontWeight: message.type === 'sent' ? 'bold' : 'normal' }}>
                                {message.type === 'sent' ? 'Tú' : message.recipient}
                              </Typography>}
                              secondary={<Typography variant="body2" sx={{whiteSpace: 'normal',overflowWrap: 'break-word',color: 'text.secondary',}}>
                                {message.message.text}
                              </Typography>}
                              sx={{ textAlign: message.type === 'sent' ? 'right' : 'left' }}
                            />
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      ))}
                    </List>
                  </Grid>
                </Grid>

                {/* Input para escribir mensaje y botón de enviar en la parte inferior */}
                <Box display="flex" alignItems="center" mt={2}>
                  <TextField fullWidth placeholder="Escribe un mensaje..." value={inputValue} onChange={handleInputChange} size="small" />
                  <Button variant="contained" color="primary" onClick={handleSendMessage} sx={{ ml: 1 }} startIcon={<SendOutlined />}>
                    Enviar
                  </Button>
                </Box>
              </Paper>
            </ClickAwayListener>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}