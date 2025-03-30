import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  List,
  ListItem,
  Button,
  Tooltip,
  Checkbox,
  ListItemText
} from '@mui/material';

// Componente Timer que muestra la diferencia entre ahora y el timestamp recibido, actualizado cada segundo.
function Timer({ lastTime }) {
  const [elapsed, setElapsed] = useState(Date.now() - lastTime);
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Date.now() - lastTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [lastTime]);
  const seconds = Math.floor(elapsed / 1000);
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return (
    <Typography variant="body2">
      {`${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`}
    </Typography>
  );
}

export default function PanelOperadores() {
  // Se utiliza el slice storeRealTime para los operadores y storeSector para sectores
  const operadores = useSelector((state) => state.storeRealTime) || [];
  const storeSector = useSelector((state) => state.storeSector);

  // Estado para filtrar operadores por sectores
  const [selectedSectors, setSelectedSectors] = useState([]);

  const handleSectorChange = (event) => {
    const { value } = event.target;
    setSelectedSectors(typeof value === 'string' ? value.split(',') : value);
  };

  // Filtrar operadores: si se seleccionó al menos un sector, se muestran sólo los que tengan ese idSector.
  const filteredOperadores =
    selectedSectors.length > 0
      ? operadores.filter((op) => selectedSectors.includes(op.idSector))
      : operadores;

  // Helper: Obtener el nombre del sector a partir del idSector.
  const getSectorName = (idSector) => {
    const sector = Object.values(storeSector).find((s) => s.idSector === idSector);
    return sector ? sector.sectorNombre : '';
  };

  return (
    <Container maxWidth="lg">
      {/* Zona de filtros (Fondo azul claro) */}
      <Box sx={{ bgcolor: '#e3f2fd', p: 2, mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          Operadores en tiempo real
        </Typography>
        <FormControl fullWidth>
          <InputLabel>Filtrar por Sectores</InputLabel>
          <Select
            multiple
            value={selectedSectors}
            onChange={handleSectorChange}
            renderValue={(selected) =>
              selected.map((id) => getSectorName(id)).join(', ')
            }
          >
            {Object.values(storeSector).map((sector) => (
              <MenuItem key={sector.idSector} value={sector.idSector}>
                <Checkbox checked={selectedSectors.indexOf(sector.idSector) > -1} />
                <ListItemText primary={sector.sectorNombre} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Encabezado de columnas */}
      <Box sx={{ display: 'flex', fontWeight: 'bold', borderBottom: '2px solid #000', mb: 1, p: 1 }}>
        <Box sx={{ flex: 1 }}>Operador</Box>
        <Box sx={{ flex: 1 }}>Extensión</Box>
        <Box sx={{ flex: 1 }}>Estados</Box>
        <Box sx={{ flex: 1 }}>Habilidades</Box>
      </Box>

      {/* Lista de operadores */}
      <List>
        {filteredOperadores.map((op) => (
          <ListItem key={op.idOperador} sx={{ borderBottom: '1px solid #ccc' }}>
            <Box sx={{ display: 'flex', width: '100%' }}>
              {/* Columna 1: Usuario y estado actual */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1">{op.idOperador}</Typography>
                <Typography variant="body2">{op.operadorEstadoActual}</Typography>
              </Box>
              {/* Columna 2: Estado de la extensión y tiempo transcurrido */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1">{op.extensionPeerStatus}</Typography>
                {op.extensionLastTime && <Timer lastTime={op.extensionLastTime} />}
              </Box>
              {/* Columna 3: Estados */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2">
                  {op.operadorEstado && op.operadorEstado.length
                    ? op.operadorEstado.join(', ')
                    : 'N/A'}
                </Typography>
              </Box>
              {/* Columna 4: Habilidades */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2">
                  {op.operadorHabilidad && op.operadorHabilidad.length
                    ? op.operadorHabilidad.join(', ')
                    : 'N/A'}
                </Typography>
              </Box>
            </Box>
            {/* Botón con tooltip para ver detalles (opcional) */}
            <Box>
              <Tooltip
                title={
                  <Box>
                    <Typography variant="body2">
                      <strong>Habilidades:</strong>{' '}
                      {op.operadorHabilidad && op.operadorHabilidad.length
                        ? op.operadorHabilidad.join(', ')
                        : 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Estados:</strong>{' '}
                      {op.operadorEstado && op.operadorEstado.length
                        ? op.operadorEstado.join(', ')
                        : 'N/A'}
                    </Typography>
                  </Box>
                }
                arrow
                placement="top"
              >
                <Button variant="outlined" size="small" sx={{ ml: 2 }}>
                  Ver Detalles
                </Button>
              </Tooltip>
            </Box>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
