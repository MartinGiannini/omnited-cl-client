import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  MenuItem,
  Select,
  Slider,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  Button,
  Box,
  Typography,
  TextField,
  Container
} from '@mui/material';
import { sendMessageThroughWebSocket } from '../../services/backend/Conexion';

export default function SectoresGruposSelect() {
  const storeSector = useSelector((state) => state.storeSector);
  const storeGruposEstado = useSelector((state) => state.storeGrupos.grupoEstado);
  const storeGruposHabilidad = useSelector((state) => state.storeGrupos.grupoHabilidad);

  const [selectedSector, setSelectedSector] = useState('');
  const [selectedTipoGrupo, setSelectedTipoGrupo] = useState('');
  const [selectedGrupoEstado, setSelectedGrupoEstado] = useState('');
  const [selectedGrupoHabilidad, setSelectedGrupoHabilidad] = useState('');
  const [grupoHabilidadDetails, setGrupoHabilidadDetails] = useState(null);
  const [grupoEstadoDetails, setGrupoEstadoDetails] = useState(null);
  const [modifiedData, setModifiedData] = useState({});
  const [nuevoNombreGrupo, setNuevoNombreGrupo] = useState('');

  const getSectorById = (sectorId) => {
    return Object.values(storeSector).find((S) => S.idSector === sectorId);
  };

  const getGrupoEstadoById = (grupoEstadoId) => {
    return Object.values(storeGruposEstado).find((G) => G.idGrupoEstado === grupoEstadoId);
  };

  const getGrupoHabilidadById = (grupoHabilidadId) => {
    return Object.values(storeGruposHabilidad).find((G) => G.idGrupoHabilidad === grupoHabilidadId);
  };

  // Si se selecciona un grupo existente, se carga sus detalles
  useEffect(() => {
    if (selectedGrupoHabilidad && selectedGrupoHabilidad !== 'agregar') {
      setGrupoHabilidadDetails(getGrupoHabilidadById(selectedGrupoHabilidad));
    } else {
      setGrupoHabilidadDetails(null);
    }
  }, [selectedGrupoHabilidad]);

  useEffect(() => {
    if (selectedGrupoEstado && selectedGrupoEstado !== 'agregar') {
      setGrupoEstadoDetails(getGrupoEstadoById(selectedGrupoEstado));
    } else {
      setGrupoEstadoDetails(null);
    }
  }, [selectedGrupoEstado]);

  const handleSectorChange = (event) => {
    setSelectedSector(event.target.value);
    setSelectedTipoGrupo('');
    setSelectedGrupoEstado('');
    setSelectedGrupoHabilidad('');
    setGrupoHabilidadDetails(null);
    setGrupoEstadoDetails(null);
    setNuevoNombreGrupo('');
    setModifiedData({});
  };

  const handleSelectedTipoGrupoChange = (event) => {
    setSelectedTipoGrupo(event.target.value);
    setSelectedGrupoEstado('');
    setSelectedGrupoHabilidad('');
    setGrupoHabilidadDetails(null);
    setGrupoEstadoDetails(null);
    setNuevoNombreGrupo('');
    setModifiedData({});
  };

  const handleGrupoEstadoChange = (event) => {
    setModifiedData({});
    setGrupoEstadoDetails(null);
    setNuevoNombreGrupo('');
    setSelectedGrupoEstado(event.target.value);
  };

  const handleGrupoHabilidadChange = (event) => {
    setModifiedData({});
    setGrupoHabilidadDetails(null);
    setNuevoNombreGrupo('');
    setSelectedGrupoHabilidad(event.target.value);
  };

  const handleReset = () => {
    setSelectedSector('');
    setSelectedTipoGrupo('');
    setSelectedGrupoEstado('');
    setSelectedGrupoHabilidad('');
    setGrupoHabilidadDetails(null);
    setGrupoEstadoDetails(null);
    setNuevoNombreGrupo('');
    setModifiedData({});
  };

  const handleAccept = () => {
    const sector = getSectorById(selectedSector);
    let messageType;
    let fullData;

    switch (selectedTipoGrupo) {
      case 'grupoHabilidades':
        messageType = 'grupoHabilidadesWS';
        fullData = {
          idGrupoHabilidad: selectedGrupoHabilidad,
          grupoHabilidadNombre: nuevoNombreGrupo,
          habilidad: sector?.sectorHabilidad.map((H) => ({
            idHabilidad: H.idHabilidad,
            // Si se modificó el valor se usa ese; en caso de grupo existente se utiliza el valor del grupo,
            // y en caso de "agregar" se deja en 0.
            habilidadValor: modifiedData.habilidad?.[H.idHabilidad] !== undefined
              ? modifiedData.habilidad[H.idHabilidad]
              : (selectedGrupoHabilidad !== 'agregar' && grupoHabilidadDetails?.habilidad
                ? (grupoHabilidadDetails.habilidad.find((gh) => gh.idHabilidad === H.idHabilidad)?.habilidadValor || 0)
                : 0)
          }))
        };
        break;

      case 'grupoEstados':
        messageType = 'grupoEstadosWS';
        fullData = {
          idGrupoEstado: selectedGrupoEstado,
          grupoEstadoNombre: nuevoNombreGrupo,
          estado: (modifiedData.estados ||
            (selectedGrupoEstado !== 'agregar' && grupoEstadoDetails?.estado
              ? grupoEstadoDetails.estado.map((e) => e.idEstado)
              : [1] // Por defecto, siempre se incluye el estado "Activo" (id 1)
            )
          ).map((idEstado) => ({ idEstado }))
        };
        break;

      default:
        return;
    }

    sendMessageThroughWebSocket(messageType, {
      ingresoDatos: {
        idSector: selectedSector,
        seleccionados: fullData,
      },
    });

    handleReset();
  };

  // Renderizado de los detalles del grupo (habilidades o estados)
  const renderGrupoDetails = () => {
    const sector = getSectorById(selectedSector);

    if (selectedTipoGrupo === 'grupoHabilidades' && selectedGrupoHabilidad) {
      // Usamos el array completo de habilidades definido en el sector.
      const abilities = sector?.sectorHabilidad?.slice().sort((a, b) => a.idHabilidad - b.idHabilidad);
      return (
        <Container maxWidth="md">
          {selectedGrupoHabilidad === '1100011' && (
            <TextField
              fullWidth
              label="Nombre del Grupo"
              value={nuevoNombreGrupo}
              onChange={(e) => setNuevoNombreGrupo(e.target.value)}
              margin="normal"
            />
          )}
          <Box mt={3}>
            {abilities?.map((H) => {
              // Se determina el valor por defecto:
              // Si ya se modificó se usa ese valor;
              // sino, en caso de grupo existente se busca en los detalles;
              // y en caso de grupo nuevo se arranca en 0.
              const defaultVal = modifiedData.habilidad?.[H.idHabilidad] !== undefined
                ? modifiedData.habilidad[H.idHabilidad]
                : (selectedGrupoHabilidad !== '1100011' && grupoHabilidadDetails?.habilidad
                  ? (grupoHabilidadDetails.habilidad.find((gh) => gh.idHabilidad === H.idHabilidad)?.habilidadValor || 0)
                  : 0);
              return (
                <Box key={H.idHabilidad} mb={2}>
                  <Typography>{H.habilidadNombre}</Typography>
                  <Slider
                    value={
                      modifiedData.habilidad?.[H.idHabilidad] !== undefined
                        ? modifiedData.habilidad[H.idHabilidad]
                        : defaultVal
                    }
                    min={0}
                    max={100}
                    valueLabelDisplay="auto"
                    onChange={(e, value) =>
                      setModifiedData((prev) => ({
                        ...prev,
                        habilidad: {
                          ...(prev.habilidad || {}),
                          [H.idHabilidad]: value,
                        },
                      }))
                    }
                  />
                </Box>
              );
            })}
          </Box>
        </Container>
      );
    } else if (selectedTipoGrupo === 'grupoEstados' && selectedGrupoEstado) {
      // Para grupoEstados, si se selecciona "agregar" se arma un default que incluye el estado "Activo" (id 1)
      const defaultEstados = selectedGrupoEstado !== '1100011' && grupoEstadoDetails?.estado
        ? grupoEstadoDetails.estado.map((e) => e.idEstado)
        : [1];
      const selectedEstados = modifiedData.estados || defaultEstados;
      return (
        <Container maxWidth="md">
          {selectedGrupoEstado === '1100011' && (
            <TextField
              fullWidth
              label="Nombre del Grupo"
              value={nuevoNombreGrupo}
              onChange={(e) => setNuevoNombreGrupo(e.target.value)}
              margin="normal"
            />
          )}
          <Box mt={3}>
            <FormControl fullWidth>
              <InputLabel>Estados</InputLabel>
              <Select
                multiple
                value={selectedEstados}
                onChange={(event) => {
                  const selectedValues = event.target.value;
                  // Se asegura que el estado "Activo" (id 1) esté siempre seleccionado
                  if (!selectedValues.includes(1)) {
                    selectedValues.push(1);
                  }
                  setModifiedData((prev) => ({
                    ...prev,
                    estados: selectedValues,
                  }));
                }}
                renderValue={(selected) =>
                  selected
                    .map((idEstado) => sector?.sectorEstado.find((E) => E.idEstado === idEstado)?.estadoNombre)
                    .join(', ')
                }
              >
                {sector?.sectorEstado
                  ?.slice()
                  .sort((a, b) => a.idEstado - b.idEstado)
                  .map((E) => (
                    <MenuItem key={E.idEstado} value={E.idEstado}>
                      <Checkbox checked={selectedEstados.includes(E.idEstado)} />
                      <ListItemText primary={E.estadoNombre} />
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </Container>
      );
    }
    return null;
  };

  return (
    <Box p={3}>
      <Container maxWidth="lg">
        {/* Select de Sectores */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Sectores</InputLabel>
          <Select value={selectedSector} onChange={handleSectorChange}>
            {Object.values(storeSector).map((sector) => (
              <MenuItem key={sector.idSector} value={sector.idSector}>
                {sector.sectorNombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedSector && (
          <FormControl fullWidth margin="normal">
            <InputLabel id="grupo-select-label">Tipo de Grupo</InputLabel>
            <Select
              labelId="grupo-select-label"
              value={selectedTipoGrupo}
              onChange={handleSelectedTipoGrupoChange}
            >
              <MenuItem value="grupoEstados">Grupo Estados</MenuItem>
              <MenuItem value="grupoHabilidades">Grupo Habilidades</MenuItem>
            </Select>
          </FormControl>
        )}

        {/* Select para grupoEstados, con la opción "Agregar Grupo" */}
        {selectedTipoGrupo === 'grupoEstados' && (
          <FormControl fullWidth margin="normal">
            <InputLabel id="grupo-estado-select-label">Grupo Estados</InputLabel>
            <Select
              labelId="grupo-estado-select-label"
              value={selectedGrupoEstado}
              onChange={handleGrupoEstadoChange}
            >
              <MenuItem value="1100011">Agregar Grupo</MenuItem>
              {getSectorById(selectedSector)?.sectorGrupoEstado.map((G) => (
                <MenuItem key={G.idGrupoEstado} value={G.idGrupoEstado}>
                  {G.grupoEstadoNombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Select para grupoHabilidades, con la opción "Agregar Grupo" */}
        {selectedTipoGrupo === 'grupoHabilidades' && (
          <FormControl fullWidth margin="normal">
            <InputLabel id="grupo-habilidad-select-label">Grupo Habilidades</InputLabel>
            <Select
              labelId="grupo-habilidad-select-label"
              value={selectedGrupoHabilidad}
              onChange={handleGrupoHabilidadChange}
            >
              <MenuItem value="1100011">Agregar Grupo</MenuItem>
              {getSectorById(selectedSector)?.sectorGrupoHabilidad.map((G) => (
                <MenuItem key={G.idGrupoHabilidad} value={G.idGrupoHabilidad}>
                  {G.grupoHabilidadNombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {renderGrupoDetails()}
      </Container>
      <Box mt={9} display="flex" gap={4}>
        <Button variant="outlined" color="secondary" onClick={handleReset}>
          Reset
        </Button>
        <Button variant="contained" color="primary" onClick={handleAccept}>
          Aceptar
        </Button>
      </Box>
    </Box>
  );
}
