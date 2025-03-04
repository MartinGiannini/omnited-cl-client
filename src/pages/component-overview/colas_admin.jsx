import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Button,
  Box,
  Container,
  Checkbox,
  ListItemText,
  TextField,
} from '@mui/material';
import { sendMessageThroughWebSocket } from '../../services/backend/Conexion';
import { showDialog } from '../../store/dialogSlice';

export default function ColasAdmin() {
  const storeSector = useSelector((state) => state.storeSector);
  const storeEstrategias = useSelector((state) => state.storeEstrategias);
  const dispatch = useDispatch();

  const [selectedSector, setSelectedSector] = useState('');
  const [selectedCola, setSelectedCola] = useState('');
  const [modifiedData, setModifiedData] = useState({});

  // Estado para los datos de una nueva cola
  const [newColaData, setNewColaData] = useState({
    colaNombre: '',
    colaEstrategia: '',
    colaHabilidad: [],
    colaEspera: '',
    colaRingueo: '',
    colaAutoPausa: '',
    colaPrioridad: '',
    colaDesborde: '',
  });

  const getSectorById = (sectorId) => {
    return Object.values(storeSector).find((sector) => sector.idSector === sectorId);
  };

  const getEstrategiaById = (idEstrategia) => {
    return Object.values(storeEstrategias).find((E) => E.idEstrategia === idEstrategia);
  };

  const getHabilidadesById = (idSector, idsHabilidades) => {
    return getSectorById(idSector).sectorHabilidad.filter(H => idsHabilidades.includes(H.idHabilidad));
  };

  const handleSectorChange = (event) => {
    setSelectedSector(event.target.value);
    setSelectedCola('');
    setModifiedData({});
    // Reiniciar datos de nueva cola
    setNewColaData({
      colaNombre: '',
      colaEstrategia: '',
      colaHabilidad: [],
      colaEspera: '',
      colaRingueo: '',
      colaAutoPausa: '',
      colaPrioridad: '',
      colaDesborde: '',
    });
  };

  const handleColaChange = (event) => {
    const value = event.target.value;
    setSelectedCola(value);
    setModifiedData({});
    // Si se selecciona "Nueva Cola", reiniciamos newColaData
    if (value === 'nuevo') {
      setNewColaData({
        colaNombre: '',
        colaEstrategia: '',
        colaHabilidad: [],
        colaEspera: '',
        colaRingueo: '',
        colaAutoPausa: '',
        colaPrioridad: '',
        colaDesborde: '',
      });
    }
  };

  const handleReset = () => {
    setSelectedSector('');
    setSelectedCola('');
    setModifiedData({});
    setNewColaData({
      colaNombre: '',
      colaEstrategia: '',
      colaHabilidad: [],
      colaEspera: '',
      colaRingueo: '',
      colaAutoPausa: '',
      colaPrioridad: '',
      colaDesborde: '',
    });
  };

  const handleHabilidadChange = (event) => {
    const selectedValues = event.target.value;
    if (selectedValues.length === 0) {
      dispatch(
        showDialog({
          title: 'Aviso:',
          message: 'Debe seleccionar al menos una habilidad.'
        })
      );
      return;
    }
    // Si estamos en "nueva cola", actualizamos newColaData; de lo contrario, modifiedData.
    if (selectedCola === 'nuevo') {
      setNewColaData((prev) => ({
        ...prev,
        colaHabilidad: selectedValues,
      }));
    } else {
      setModifiedData((prev) => ({
        ...prev,
        colaHabilidad: selectedValues,
      }));
    }
  };

  // Handler para cambios en campos de la nueva cola
  const handleNewColaFieldChange = (field) => (event) => {
    setNewColaData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleAccept = () => {
    const sector = getSectorById(selectedSector);
    if (!sector) {
      console.error('Sector no seleccionado');
      return;
    }
    let fullData;
    let messageType = 'colaadminWS';
    if (selectedCola === 'nuevo') {
      // Usar datos de newColaData
      // Validar que se haya ingresado al menos el nombre
      if (!newColaData.colaNombre) {
        dispatch(
          showDialog({
            title: 'Error',
            message: 'Debe ingresar el nombre de la nueva cola'
          })
        );
        return;
      }
      fullData = {
        // Como es nueva cola, idCola puede ser null o dejar que el backend lo asigne
        idCola: null,
        colaNombre: newColaData.colaNombre,
        colaEstrategia: getEstrategiaById(newColaData.colaEstrategia || '') || {},
        colaHabilidad: getHabilidadesById(sector.idSector, newColaData.colaHabilidad || []),
        colaEspera: newColaData.colaEspera,
        colaRingueo: newColaData.colaRingueo,
        colaAutoPausa: newColaData.colaAutoPausa,
        colaPrioridad: newColaData.colaPrioridad,
        colaDesborde: newColaData.colaDesborde || '',
      };
    } else {
      // Cola existente
      const cola = sector?.sectorCola.find((c) => c.idCola === parseInt(selectedCola, 10));
      if (!cola) {
        console.error('Cola no encontrada');
        return;
      }
      fullData = {
        idCola: cola.idCola,
        colaNombre: cola.colaNombre,
        colaEstrategia: getEstrategiaById(modifiedData.colaEstrategia || cola.colaEstrategia.idEstrategia),
        colaHabilidad: getHabilidadesById(sector.idSector, modifiedData.colaHabilidad || cola.colaHabilidad.map((h) => h.idHabilidad)),
        colaEspera: modifiedData.colaEspera || cola.colaEspera,
        colaRingueo: modifiedData.colaRingueo || cola.colaRingueo,
        colaAutoPausa: modifiedData.colaAutoPausa || cola.colaAutoPausa,
        colaPrioridad: modifiedData.colaPrioridad || cola.colaPrioridad,
        colaDesborde: modifiedData.colaDesborde || cola.colaDesborde || '',
      };
    }

    sendMessageThroughWebSocket(messageType, {
      ingresoDatos: {
        idSector: selectedSector,
        cola: fullData,
      },
    });
  };

  const renderColaDetails = () => {
    const sector = getSectorById(selectedSector);
    if (!selectedCola) return null;
    
    // Si es "nueva cola", mostramos campos para ingresar los datos nuevos
    if (selectedCola === 'nuevo') {
      const habilidadesTotales = sector.sectorHabilidad || [];
      const habilidadesSeleccionadas = newColaData.colaHabilidad || [];
      return (
        <Container maxWidth="md">
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>Nueva Cola</Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Nombre de la Cola"
              value={newColaData.colaNombre}
              onChange={handleNewColaFieldChange('colaNombre')}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Estrategias</InputLabel>
              <Select
                value={newColaData.colaEstrategia}
                onChange={handleNewColaFieldChange('colaEstrategia')}
              >
                {Object.values(storeEstrategias)
                  .slice()
                  .sort((a, b) => a.idEstrategia - b.idEstrategia)
                  .map((E) => (
                    <MenuItem key={E.idEstrategia} value={E.idEstrategia}>
                      {E.estrategiaNombre}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Habilidades</InputLabel>
              <Select
                multiple
                value={habilidadesSeleccionadas}
                onChange={handleHabilidadChange}
                renderValue={(selected) =>
                  selected
                    .map((idHabilidad) =>
                      habilidadesTotales.find((H) => H.idHabilidad === idHabilidad)?.habilidadNombre
                    )
                    .filter((nombre) => nombre !== undefined)
                    .join(', ')
                }
              >
                {habilidadesTotales
                  .slice()
                  .sort((a, b) => a.idHabilidad - b.idHabilidad)
                  .map((H) => (
                    <MenuItem key={H.idHabilidad} value={H.idHabilidad}>
                      <Checkbox checked={habilidadesSeleccionadas.includes(H.idHabilidad)} />
                      <ListItemText primary={H.habilidadNombre} />
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Espera</InputLabel>
              <Select
                value={newColaData.colaEspera}
                onChange={handleNewColaFieldChange('colaEspera')}
              >
                {[...Array(12).keys()].map((num) => (
                  <MenuItem key={num} value={(num + 1) * 5}>
                    {(num + 1) * 5}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Ringueo</InputLabel>
              <Select
                value={newColaData.colaRingueo}
                onChange={handleNewColaFieldChange('colaRingueo')}
              >
                {[...Array(12).keys()].map((num) => (
                  <MenuItem key={num} value={(num + 1) * 5}>
                    {(num + 1) * 5}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>AutoPausa</InputLabel>
              <Select
                value={newColaData.colaAutoPausa}
                onChange={handleNewColaFieldChange('colaAutoPausa')}
              >
                {[...Array(25).keys()].map((num) => (
                  <MenuItem key={num} value={num * 5}>
                    {num * 5}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Prioridad</InputLabel>
              <Select
                value={newColaData.colaPrioridad}
                onChange={handleNewColaFieldChange('colaPrioridad')}
              >
                {[...Array(21).keys()].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Cola de Desborde</InputLabel>
              <Select
                value={newColaData.colaDesborde}
                onChange={handleNewColaFieldChange('colaDesborde')}
              >
                <MenuItem value="">Ninguna</MenuItem>
                {sector.sectorCola
                  .filter((C) => C.idCola !== parseInt(selectedCola, 10))
                  .map((C) => (
                    <MenuItem key={C.idCola} value={C.idCola}>
                      {C.colaNombre}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </Container>
      );
    } else {
      // Mostrar detalles de cola existente
      const cola = sector?.sectorCola.find((c) => c.idCola === parseInt(selectedCola, 10));
      if (!cola) return null;
      const habilidadesTotales = sector.sectorHabilidad || [];
      const habilidadesSeleccionadas = modifiedData.colaHabilidad || cola.colaHabilidad.map((H) => H.idHabilidad);
      return (
        <Container maxWidth="md">
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>Detalles de la Cola</Typography>
            <Box mt={2}>
              <FormControl fullWidth>
                <InputLabel>Estrategias</InputLabel>
                <Select
                  value={modifiedData.colaEstrategia || cola.colaEstrategia.idEstrategia}
                  onChange={(event) =>
                    setModifiedData((prev) => ({
                      ...prev,
                      colaEstrategia: event.target.value,
                    }))
                  }
                >
                  {Object.values(storeEstrategias)
                    .slice()
                    .sort((a, b) => a.idEstrategia - b.idEstrategia)
                    .map((E) => (
                      <MenuItem key={E.idEstrategia} value={E.idEstrategia}>
                        {E.estrategiaNombre}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
            <Box mt={2}>
              <FormControl fullWidth>
                <InputLabel>Espera</InputLabel>
                <Select
                  value={modifiedData.colaEspera || cola.colaEspera}
                  onChange={(event) =>
                    setModifiedData((prev) => ({
                      ...prev,
                      colaEspera: event.target.value,
                    }))
                  }
                >
                  {[...Array(12).keys()].map((num) => (
                    <MenuItem key={num} value={(num + 1) * 5}>
                      {(num + 1) * 5}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box mt={2}>
              <FormControl fullWidth>
                <InputLabel>Ringueo</InputLabel>
                <Select
                  value={modifiedData.colaRingueo || cola.colaRingueo}
                  onChange={(event) =>
                    setModifiedData((prev) => ({
                      ...prev,
                      colaRingueo: event.target.value,
                    }))
                  }
                >
                  {[...Array(12).keys()].map((num) => (
                    <MenuItem key={num} value={(num + 1) * 5}>
                      {(num + 1) * 5}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box mt={2}>
              <FormControl fullWidth>
                <InputLabel>AutoPausa</InputLabel>
                <Select
                  value={modifiedData.colaAutoPausa || cola.colaAutoPausa}
                  onChange={(event) =>
                    setModifiedData((prev) => ({
                      ...prev,
                      colaAutoPausa: event.target.value,
                    }))
                  }
                >
                  {[...Array(25).keys()].map((num) => (
                    <MenuItem key={num} value={num * 5}>
                      {num * 5}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box mt={2}>
              <FormControl fullWidth>
                <InputLabel>Prioridad</InputLabel>
                <Select
                  value={modifiedData.colaPrioridad || cola.colaPrioridad}
                  onChange={(event) =>
                    setModifiedData((prev) => ({
                      ...prev,
                      colaPrioridad: event.target.value,
                    }))
                  }
                >
                  {[...Array(21).keys()].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box mt={2}>
              <FormControl fullWidth>
                <InputLabel>Colas de Desborde</InputLabel>
                <Select
                  value={modifiedData.colaDesborde || cola.colaDesborde || ''}
                  onChange={(event) =>
                    setModifiedData((prev) => ({
                      ...prev,
                      colaDesborde: event.target.value,
                    }))
                  }
                >
                  <MenuItem value="">Ninguna</MenuItem>
                  {sector.sectorCola
                    .filter((C) => C.idCola !== cola.idCola)
                    .map((C) => (
                      <MenuItem key={C.idCola} value={C.idCola}>
                        {C.colaNombre}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
            <Box mt={2}>
              <FormControl fullWidth>
                <InputLabel>Habilidades</InputLabel>
                <Select
                  multiple
                  value={habilidadesSeleccionadas}
                  onChange={handleHabilidadChange}
                  renderValue={(selected) =>
                    selected
                      .map((idHabilidad) =>
                        habilidadesTotales.find((H) => H.idHabilidad === idHabilidad)?.habilidadNombre
                      )
                      .filter((nombre) => nombre !== undefined)
                      .join(', ')
                  }
                >
                  {habilidadesTotales
                    .slice()
                    .sort((a, b) => a.idHabilidad - b.idHabilidad)
                    .map((H) => (
                      <MenuItem key={H.idHabilidad} value={H.idHabilidad}>
                        <Checkbox checked={habilidadesSeleccionadas.includes(H.idHabilidad)} />
                        <ListItemText primary={H.habilidadNombre} />
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Container>
      );
    }
  };

  return (
    <Box p={3}>
      <Container maxWidth="lg">
        <FormControl fullWidth margin="normal">
          <InputLabel>Sectores</InputLabel>
          <Select value={selectedSector} onChange={handleSectorChange}>
            {Object.values(storeSector).map((S) => (
              <MenuItem key={S.idSector} value={S.idSector}>
                {S.sectorNombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedSector && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Colas</InputLabel>
            <Select value={selectedCola} onChange={handleColaChange}>
              <MenuItem value="nuevo">Nueva Cola</MenuItem>
              {getSectorById(selectedSector)?.sectorCola.map((C) => (
                <MenuItem key={C.idCola} value={C.idCola}>
                  {C.colaNombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {renderColaDetails()}
      </Container>
      <Box mt={9} display="flex" gap={4}>
        <Button variant="outlined" color="secondary" onClick={handleReset}>Reset</Button>
        <Button variant="contained" color="primary" onClick={handleAccept}>Aceptar</Button>
      </Box>
    </Box>
  );
}
