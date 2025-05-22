import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

import { sendMessageThroughWebSocket } from '../../../../services/backend/Conexion';

// ==============================|| HEADER CONTENT - SELECT ||============================== //

export default function States() {
  const usuarioStore = useSelector((state) => state.storeUsuario);
  const localStore = useSelector((state) => state.storeLocal);
  const [estadoActual, setEstadoActual] = useState(localStore.usuarioEstadoActual);
  const selectedEstado = usuarioStore.usuarioEstado.find((E) => E.idEstado === estadoActual);

  const handleChange = (event) => {
    const newId = event.target.value;
    const newEstado = usuarioStore.usuarioEstado.find((e) => e.idEstado === newId);
    sendMessageThroughWebSocket('usuarioEventoWS', {
      cambioEstado: {
        usuario: usuarioStore,
        estado: newEstado,
      },
    });
    setEstadoActual(newId);
  };

  let comboColor = 'grey';
  if (selectedEstado) {
    if (selectedEstado.estadoNombre === 'Activo') {
      comboColor = 'green';
    } else if (selectedEstado.estadoProductivo) {
      comboColor = 'yellow';
    } else {
      comboColor = 'red';
    }
  }

  return (
    <Box sx={{ ml: { xs: 0, md: 1 } }}>
      <FormControl
        fullWidth
        sx={{
          width: { xs: '100%', md: 224 },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: comboColor,
            },
            '&:hover fieldset': {
              borderColor: comboColor,
            },
            '&.Mui-focused fieldset': {
              borderColor: comboColor,
            },
          },
        }}
        variant="outlined"
        size="small"
      >
        <InputLabel id="estado-select-label">Estado</InputLabel>
        <Select labelId="estado-select-label" id="estado-select" value={estadoActual} onChange={handleChange} label="Estado">
          {usuarioStore.usuarioEstado
            .slice()
            .sort((a, b) => a.idEstado - b.idEstado)
            .map((estado) => (
              <MenuItem key={estado.idEstado} value={estado.idEstado}>{estado.estadoNombre}</MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
}