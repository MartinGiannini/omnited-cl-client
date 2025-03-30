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
} from '@mui/material';
import { sendMessageThroughWebSocket } from '../../services/backend/Conexion';
import { showDialog } from '../../store/dialogSlice';

export default function ColasSuper() {
  const storeSector = useSelector((state) => state.storeSector);
  const storeEstrategias = useSelector((state) => state.storeEstrategias);

  const [selectedSector, setSelectedSector] = useState('');
  const [selectedCola, setSelectedCola] = useState('');
  const [modifiedData, setModifiedData] = useState({});
  const dispatch = useDispatch();

  const getSectorById = (sectorId) => {
    return Object.values(storeSector).find((sector) => sector.idSector === sectorId);
  };

  const getEstrategiaById = (idEstrategia) => {
    return Object.values(storeEstrategias).find((E) => E.idEstrategia === idEstrategia);
  }

  const getHabilidadesById = (idSector, idsHabilidades) => {
    return getSectorById(idSector).sectorHabilidad.filter(H => idsHabilidades.includes(H.idHabilidad))
  }

  const handleSectorChange = (event) => {
    setSelectedSector(event.target.value);
    setSelectedCola('');
    setModifiedData({});
  };

  const handleColaChange = (event) => {
    setSelectedCola(event.target.value);
    setModifiedData({});
  };

  const handleReset = () => {
    setSelectedSector('');
    setSelectedCola('');
    setModifiedData({});
  };

  const handleHabilidadChange = (event) => {
    const selectedValues = event.target.value;

    // Validación para garantizar al menos una habilidad seleccionada
    if (selectedValues.length === 0) {
      dispatch(
        showDialog({
          title: 'Aviso:',
          message: 'Debe seleccionar al menos una habilidad.'
        })
      );
      return;
    }

    setModifiedData((prev) => ({
      ...prev,
      colaHabilidad: selectedValues,
    }));
  };

  const handleAccept = () => {

    const sector = getSectorById(selectedSector);
    const cola = sector?.sectorCola.find((c) => c.idCola === parseInt(selectedCola, 10));
    let messageType = 'colaadminWS';

    if (!sector || !cola) {
      console.error('Datos incompletos para enviar');
      return;
    }

    const fullData = {
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

    sendMessageThroughWebSocket(messageType, {
      ingresoDatos: {
        idSector: selectedSector,
        cola: fullData,
      },
    });
  }

  const renderColaDetails = () => {
    if (!selectedCola) return null;

    const sector = getSectorById(selectedSector);
    const cola = sector?.sectorCola.find((c) => c.idCola === parseInt(selectedCola, 10));

    if (!cola) return null;

    const habilidadesTotales = sector.sectorHabilidad || [];
    const habilidadesSeleccionadas = modifiedData.colaHabilidad || cola.colaHabilidad.map((H) => H.idHabilidad);


    console.log("Las habilidades totales son: ", habilidadesTotales)
    console.log("Las habilidades seleccionadas son: ", habilidadesSeleccionadas)

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
                  ?.slice()
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
                <MenuItem value="0">Ninguna</MenuItem>
                {sector.sectorCola
                  .filter((C) => C.idCola !== cola.idCola) // Excluye la cola seleccionada
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
                    .filter((nombre) => nombre !== undefined) // Filtrar valores undefined
                    .join(', ') // Unir nombres con comas
                }
              >
                {habilidadesTotales
                  ?.slice()
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
