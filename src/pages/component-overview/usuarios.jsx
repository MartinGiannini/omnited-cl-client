import React, { useState } from 'react';
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
  Card,
  Chip,
  CardContent,
  List,
  Avatar,
  ListItem,
  LinearProgress
} from '@mui/material';
import Container from '@mui/material/Container';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { sendMessageThroughWebSocket } from '../../services/backend/Conexion';

export default function ComponentUsuarios() {
  const storeSector = useSelector((state) => state.storeSector);
  const storeUsuario = useSelector((state) => state.storeUsuario);
  const storePermisos = useSelector((state) => state.storePermisos);
  const storeGrupos = useSelector((state) => state.storeGrupos);

  const [selectedSector, setSelectedSector] = useState('');
  const [selectedUsuario, setSelectedUsuario] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedGrupoHabilidad, setSelectedGrupoHabilidad] = useState('');
  const [selectedGrupoEstado, setSelectedGrupoEstado] = useState('');
  const [modifiedData, setModifiedData] = useState({});

  const getSectorById = (sectorId) => {
    return Object.values(storeSector).find((sector) => sector.idSector === sectorId);
  };

  const datosGrupoHabilidad = storeGrupos?.grupoHabilidad.find(
    (h) => h.idGrupoHabilidad === selectedGrupoHabilidad
  );

  const datosGrupoEstado = storeGrupos?.grupoEstado.find(
    (h) => h.idGrupoEstado === selectedGrupoEstado
  );

  const handleSectorChange = (event) => {
    setSelectedSector(event.target.value);
    setSelectedUsuario('');
    setSelectedOption('');
    setSelectedGrupoHabilidad('');
    setSelectedGrupoEstado('');
    setModifiedData({});
  };

  const handleUsuarioChange = (event) => {
    setSelectedUsuario(event.target.value);
    setSelectedOption('');
    setSelectedGrupoHabilidad('');
    setSelectedGrupoEstado('');
    setModifiedData({});
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setModifiedData({});
  };

  const handleReset = () => {
    setSelectedSector('');
    setSelectedUsuario('');
    setSelectedOption('');
    setSelectedGrupoHabilidad('');
    setSelectedGrupoEstado('');
    setModifiedData({});
  };

  const handleGrupoEstadoChange = (event) => {
    setSelectedGrupoEstado(event.target.value);
  };

  const handleGrupoHabilidadChange = (event) => {
    setSelectedGrupoHabilidad(event.target.value);
  };

  const handleAccept = () => {

    const sector = getSectorById(selectedSector);
    const usuario = sector?.sectorUsuario.find((user) => user.idUsuario === selectedUsuario);

    if (!usuario || !selectedOption) {
      return;
    }

    let messageType;
    let fullData;

    switch (selectedOption) {
      case 'habilidades':
        messageType = 'usuarioHabilidadesWS';
        fullData = {
          idUsuario: usuario.idUsuario,
          usuarioHabilidad: sector?.sectorHabilidad.map((H) => ({
            idHabilidad: H.idHabilidad,
            habilidadNombre: H.habilidadNombre,
            habilidadValor: (modifiedData.habilidad?.[H.idHabilidad] ?? usuario.usuarioHabilidad.find((uh) => uh.idHabilidad === H.idHabilidad)?.habilidadValor) || 0,
          }))
        };
        break;

      case 'estados':
        messageType = 'usuarioEstadosWS';
        fullData = {
          idUsuario: usuario.idUsuario,
          usuarioEstado: (modifiedData.estados || usuario.usuarioEstado.map((e) => e.idEstado)).map((idEstado) => {
            const estadoObj = sector?.sectorEstado.find((estado) => estado.idEstado === idEstado);
            return {
              idEstado,
              estadoNombre: estadoObj?.estadoNombre || '',
              estadoProductivo: estadoObj?.estadoProductivo || false,
              estadoDedicadoUsuarioFinal: estadoObj?.estadoDedicadoUsuarioFinal || false
            };
          })
        };
        break;

      case 'grupoHabilidades':
        messageType = 'usuarioHabilidadesWS';
        fullData = {
          idUsuario: usuario.idUsuario,
          usuarioHabilidad: datosGrupoHabilidad.habilidad
        }
        break;

      case 'grupoEstados':
        messageType = 'usuarioEstadosWS';
        fullData = {
          idUsuario: usuario.idUsuario,
          usuarioEstado: datosGrupoEstado.estado
        }
        break;

      case 'permisos':
        let permisos;
        let permisosUsuario;

        if (storeUsuario.usuarioPerfil.idPerfil === 1) {
          permisos = storePermisos.permisoSupervision;
          permisosUsuario = usuario.usuarioPermisoSupervision;
          messageType = 'permisosSupervisionWS';
          fullData = {
            idUsuario: usuario.idUsuario,
            usuarioPermisoSupervision: (modifiedData.permisos || permisosUsuario.map((p) => p.idPermiso)).map((idPermiso) => {
              const permisoObj = permisos.find((permiso) => permiso.idPermiso === idPermiso);
              return { idPermiso, permisoNombre: permisoObj?.permisoNombre || '' };
            })
          };
        } else {
          permisos = storePermisos.permisoOperacion;
          permisosUsuario = usuario.usuarioPermisoOperacion;
          messageType = 'permisosOperacionWS';
          fullData = {
            idUsuario: usuario.idUsuario,
            usuarioPermisoOperacion: (modifiedData.permisos || permisosUsuario.map((p) => p.idPermiso)).map((idPermiso) => {
              const permisoObj = permisos.find((permiso) => permiso.idPermiso === idPermiso);
              return { idPermiso, permisoNombre: permisoObj?.permisoNombre || '' };
            })
          };
        }
        break;

      default:
        return;
    }

    sendMessageThroughWebSocket(messageType, {
      ingresoDatos: {
        idSector: selectedSector,
        usuario: fullData,
      },
    });
  };

  const renderOptionData = () => {
    if (!selectedUsuario || !selectedOption) return null;

    const sector = getSectorById(selectedSector);

    const usuario = sector?.sectorUsuario.find(
      (user) => user.idUsuario === selectedUsuario
    );

    if (!usuario) return null;

    switch (selectedOption) {
      case 'habilidades':
        return (
          <Container maxWidth="md">
            <Box mt={3}>
              {sector?.sectorHabilidad
                ?.slice()
                .sort((a, b) => a.idHabilidad - b.idHabilidad)
                .map((habilidad) => (
                  <Box key={habilidad.idHabilidad} mb={2}>
                    <Typography>{habilidad.habilidadNombre}</Typography>
                    <Slider
                      defaultValue={
                        usuario.usuarioHabilidad.find((uh) => uh.idHabilidad === habilidad.idHabilidad)?.habilidadValor || 0
                      }
                      min={0}
                      max={100}
                      valueLabelDisplay="auto"
                      onChangeCommitted={(e, value) =>
                        setModifiedData((prev) => ({
                          ...prev,
                          habilidad: {
                            ...(prev.habilidad || {}),
                            [habilidad.idHabilidad]: value,
                          },
                        }))
                      }
                    />
                  </Box>
                ))}
            </Box>
          </Container>
        );

      case 'estados':
        return (
          <Container maxWidth="md">
            <Box mt={3}>
              <FormControl fullWidth>
                <InputLabel>Estados</InputLabel>
                <Select
                  multiple
                  value={[
                    ...new Set([
                      1, // ID del estado "Activo", siempre seleccionado
                      ...(modifiedData.estados || usuario.usuarioEstado.map((e) => e.idEstado)),
                    ]),
                  ]}

                  onChange={(event) => {
                    const selectedValues = event.target.value;
                    // Mantener siempre el estado "Activo" seleccionado
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
                      .map((idEstado) => sector?.sectorEstado.find((estado) => estado.idEstado === idEstado)?.estadoNombre)
                      .join(', ')
                  }
                >
                  {sector?.sectorEstado
                    ?.slice()
                    .sort((a, b) => a.idEstado - b.idEstado)
                    .map((E) => (
                      <MenuItem key={E.idEstado} value={E.idEstado}>
                        <Checkbox
                          checked={(modifiedData.estados || usuario.usuarioEstado.map((e) => e.idEstado)).includes(E.idEstado)}
                        />
                        <ListItemText primary={E.estadoNombre} />
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
          </Container>
        );

      case 'permisos':

        let permisosTotales;
        let permisosUsuario;

        switch (storeUsuario.usuarioPerfil.idPerfil) {
          case 1:
            permisosTotales = storePermisos.permisoSupervision
            permisosUsuario = usuario.usuarioPermisoSupervision
            break;
          case 2:
            permisosTotales = storePermisos.permisoOperacion
            permisosUsuario = usuario.usuarioPermisoOperacion
            break;
        }

        return (
          <Container maxWidth="md">
            <Box mt={3}>
              <FormControl fullWidth>
                <InputLabel>Permisos</InputLabel>
                <Select
                  multiple
                  value={modifiedData.permisos || permisosUsuario.map((e) => e.idPermiso)}

                  onChange={(event) => {
                    const selectedValues = event.target.value;
                    setModifiedData((prev) => ({
                      ...prev,
                      permisos: selectedValues,
                    }));
                  }}

                  renderValue={(selected) =>
                    selected
                      ?.slice()
                      .sort((a, b) => a.idPermiso - b.idPermiso)
                      .map((idPermiso) =>
                        permisosTotales.find((permiso) => permiso.idPermiso === idPermiso)?.permisoNombre
                      )
                      .join(', ')
                  }
                >
                  {permisosTotales
                    ?.slice() // Crear una copia para evitar modificar el array original
                    .sort((a, b) => a.idPermiso - b.idPermiso) // Ordenar por ID
                    .map((permiso) => (
                      <MenuItem key={permiso.idPermiso} value={permiso.idPermiso}>
                        <Checkbox
                          checked={
                            (modifiedData.permisos || permisosUsuario.map((e) => e.idPermiso)).includes(
                              permiso.idPermiso
                            )
                          }
                        />
                        <ListItemText primary={permiso.permisoNombre} />
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
          </Container>
        );

      case 'grupoHabilidades':
        return (
          <Container maxWidth="md">
            <Box mt={3}>
              <FormControl fullWidth>
                <InputLabel>Grupo Habilidades</InputLabel>
                <Select value={selectedGrupoHabilidad} onChange={handleGrupoHabilidadChange} >
                  {sector?.sectorGrupoHabilidad
                    ?.slice()
                    .sort((a, b) => a.idGrupoHabilidad - b.idGrupoHabilidad)
                    .map((grupoHabilidad) => (
                      <MenuItem key={grupoHabilidad.idGrupoHabilidad} value={grupoHabilidad.idGrupoHabilidad}>
                        {grupoHabilidad.grupoHabilidadNombre}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>

            {datosGrupoHabilidad && datosGrupoHabilidad.habilidad ? (

              <Card>
                <CardContent>
                  <List>
                    {datosGrupoHabilidad.habilidad
                      ?.slice()
                      .sort((a, b) => a.idHabilidad - b.idHabilidad)
                      .map((h) => (
                        <ListItem key={h.idHabilidad} alignItems="flex-start">
                          <ListItemText primary={h.habilidadNombre} secondary={`Valor: ${h.habilidadValor}`} />
                          <Box width="100%" ml={2}>
                            <LinearProgress
                              variant="determinate"
                              value={(h.habilidadValor / 100) * 100}
                              color="primary"
                            />
                          </Box>
                        </ListItem>
                      ))}
                  </List>
                </CardContent>
              </Card>

            ) : null}

          </Container>
        );

      case 'grupoEstados':
        return (
          <Container maxWidth="md">
            <Box mt={3}>
              <FormControl fullWidth>
                <InputLabel>Grupo Estados</InputLabel>
                <Select value={selectedGrupoEstado} onChange={handleGrupoEstadoChange}>
                  {sector?.sectorGrupoEstado
                    ?.slice() // Crear una copia para evitar modificar el array original
                    .sort((a, b) => a.idGrupoEstado - b.idGrupoEstado) // Ordenar por ID
                    .map((grupoEstado) => (
                      <MenuItem key={grupoEstado.idGrupoEstado} value={grupoEstado.idGrupoEstado}>
                        {grupoEstado.grupoEstadoNombre}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>

            {datosGrupoEstado && datosGrupoEstado.estado ? (

              <Card>
                <CardContent>
                  <List>
                    {datosGrupoEstado.estado
                      ?.slice()
                      .sort((a, b) => a.idEstado - b.idEstado)
                      .map((e) => (
                        <ListItem key={e.idEstado} alignItems="flex-start">
                          <Avatar>
                            {e.estadoProductivo ? (
                              <CheckCircle color="success" />
                            ) : (
                              <Cancel color="error" />
                            )}
                          </Avatar>
                          <Box ml={2} flex={1}>
                            <ListItemText
                              primary={e.estadoNombre}
                              secondary={
                                e.estadoDedicadoUsuarioFinal
                                  ? 'Dedicado al usuario final'
                                  : 'No dedicado al usuario final'
                              }
                            />
                            <Box mt={1}>
                              <Chip
                                label={e.estadoProductivo ? 'Productivo' : 'No productivo'}
                                color={e.estadoProductivo ? 'success' : 'default'}
                                size="small"
                              />
                            </Box>
                          </Box>
                        </ListItem>
                      ))}
                  </List>
                </CardContent>
              </Card>

            ) : null}

          </Container>
        );

      default:
        return null;
    }
  };

  return (

    <Box p={3}>
      <Container maxWidth="lg">
        <FormControl fullWidth margin="normal">
          <InputLabel>Sectores</InputLabel>
          <Select value={selectedSector} onChange={handleSectorChange}>
            {Object.values(storeSector).map((sector) => (
              <MenuItem key={sector.idSector} value={sector.idSector}>{sector.sectorNombre}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedSector && (
          <FormControl fullWidth variant="filled" margin="normal">
            <InputLabel>Usuarios</InputLabel>
            <Select value={selectedUsuario} onChange={handleUsuarioChange}>
              {getSectorById(selectedSector)?.sectorUsuario.map((usuario) => (
                <MenuItem key={usuario.idUsuario} value={usuario.idUsuario}>{usuario.usuarioNombre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {selectedUsuario && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Opciones</InputLabel>
            <Select value={selectedOption} onChange={handleOptionChange}>
              <MenuItem value="habilidades">Habilidades</MenuItem>
              <MenuItem value="grupoHabilidades">Grupo: Habilidad</MenuItem>
              <MenuItem value="estados">Estados</MenuItem>
              <MenuItem value="grupoEstados">Grupo: Estado</MenuItem>
              <MenuItem value="permisos">Permisos</MenuItem>
            </Select>
          </FormControl>
        )}

        {renderOptionData()}
      </Container>
      <Box mt={9} display="flex" gap={4}>
        <Button variant="outlined" color="secondary" onClick={handleReset}>Reset</Button>
        <Button variant="contained" color="primary" onClick={handleAccept}>Aceptar</Button>
      </Box>
    </Box>
  );
}