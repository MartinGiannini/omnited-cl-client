import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

import { updateEstadoActual } from '../../../../store/usersOptionsSlice';

// ==============================|| HEADER CONTENT - SELECT ||============================== //

export default function States() {
  const userOptions = useSelector((state) => state.storeUserOptions);
  const usuarioEstados = useSelector((state) => state.storeUsuario.estados);
  const estadoActual = userOptions.estadoActual;
  const dispatch = useDispatch();

  const handleChange = (event) => {
    dispatch(updateEstadoActual(parseInt(event.target.value)));
  };

  return (
    <Box sx={{ ml: { xs: 0, md: 1 } }}>
      <FormControl fullWidth sx={{ width: { xs: '100%', md: 224 } }} variant="outlined" size="small">
        <InputLabel id="estado-select-label">Estado</InputLabel>
        <Select labelId="estado-select-label" id="estado-select" value={estadoActual} onChange={handleChange} label="Estado">
          {usuarioEstados
            .slice()
            .sort((a, b) => a.id - b.id)
            .map((estado) => (
              <MenuItem key={estado.id} value={estado.id}>
                {estado.nombre}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
}