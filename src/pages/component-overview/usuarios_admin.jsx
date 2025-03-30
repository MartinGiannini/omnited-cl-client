import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import { sendMessageThroughWebSocket } from '../../services/backend/Conexion';

export default function UsuariosAdmin() {
  const storeSector = useSelector((state) => state.storeSector);
  const storePermisos = useSelector((state) => state.storePermisos);

  // Zona de SELECCIÓN (fondo azul claro)
  const [filterSectores, setFilterSectores] = useState([]); // Sectores para filtrar la búsqueda
  const [userSearch, setUserSearch] = useState('');
  const [selectedUsuario, setSelectedUsuario] = useState(''); // Puede ser "nuevo" o un id numérico

  // Zona de EDICIÓN/INGRESO de datos
  const [assignedSectores, setAssignedSectores] = useState([]); // Sectores asignados al usuario (para edición)
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [userField, setUserField] = useState(''); // Usuario (se convierte a minúsculas)
  const [correo, setCorreo] = useState('');
  const [correoError, setCorreoError] = useState('');
  const [perfil, setPerfil] = useState(''); // "2" Supervisor, "3" Operador
  const [condicion, setCondicion] = useState(''); // "1", "2", "3"
  // Para permisos, usamos dos arrays (Supervisor: ambos; Operador: solo permisosOperación)
  const [permisosSupervisionSeleccionados, setPermisosSupervisionSeleccionados] = useState([]);
  const [permisosOperacionSeleccionados, setPermisosOperacionSeleccionados] = useState([]);

  // Helper: Obtiene todos los usuarios (sin duplicados) de storeSector
  const getAllUsers = () => {
    let users = [];
    Object.values(storeSector).forEach(sector => {
      if (Array.isArray(sector.sectorUsuario)) {
        sector.sectorUsuario.forEach(u => {
          if (!users.find(user => user.idUsuario === u.idUsuario)) {
            users.push(u);
          }
        });
      }
    });
    return users;
  };

  // Filtrar usuarios según búsqueda y sectores de filtro (si se han seleccionado)
  const filteredUsers = getAllUsers().filter(u => {
    const matchSearch = u.usuarioNombre?.toLowerCase().includes(userSearch.toLowerCase()) || false;
    if (filterSectores.length === 0) return matchSearch;
    // El usuario debe estar en al menos uno de los sectores filtrados
    let belongs = false;
    Object.values(storeSector).forEach(sector => {
      if (filterSectores.includes(sector.idSector) && sector.sectorUsuario.find(user => user.idUsuario === u.idUsuario)) {
        belongs = true;
      }
    });
    return matchSearch && belongs;
  });

  // HANDLERS - Zona de SELECCIÓN
  const handleFilterSectoresChange = (e) => {
    setFilterSectores(e.target.value);
  };

  const handleUserSearchChange = (e) => {
    setUserSearch(e.target.value);
  };

  const handleUsuarioChange = (e) => {
    const value = e.target.value;
    setSelectedUsuario(value);
    if (value === 'nuevo') {
      // Nuevo usuario: limpiar campos
      setNombre('');
      setApellido('');
      setUserField('');
      setCorreo('');
      setPerfil('');
      setCondicion('');
      setPermisosSupervisionSeleccionados([]);
      setPermisosOperacionSeleccionados([]);
      setAssignedSectores([]);
    } else {
      // Cargar datos del usuario seleccionado (buscando en todos los sectores)
      const user = getAllUsers().find(u => u.idUsuario === value);
      if (user) {
        setNombre(user.usuarioNombre || '');
        setApellido(user.usuarioApellido || '');
        setUserField(user.usuarioUsuario ? user.usuarioUsuario.toLowerCase() : '');
        setCorreo(user.usuarioCorreo || '');
        setPerfil(user.usuarioPerfil?.idPerfil?.toString() || '');
        setCondicion(user.usuarioCondicion?.idCondicion?.toString() || '');
        // Buscar sectores asignados (recorriendo storeSector)
        let assigned = [];
        Object.values(storeSector).forEach(sector => {
          if (Array.isArray(sector.sectorUsuario) && sector.sectorUsuario.find(u => u.idUsuario === value)) {
            assigned.push(sector.idSector);
          }
        });
        setAssignedSectores(assigned);
        // Cargar permisos según perfil
        if (user.usuarioPerfil?.idPerfil === 2) {
          setPermisosSupervisionSeleccionados(user.usuarioPermisoSupervision?.map(p => p.idPermiso) || []);
          setPermisosOperacionSeleccionados(user.usuarioPermisoOperacion?.map(p => p.idPermiso) || []);
        } else if (user.usuarioPerfil?.idPerfil === 3) {
          setPermisosOperacionSeleccionados(user.usuarioPermisoOperacion?.map(p => p.idPermiso) || []);
          setPermisosSupervisionSeleccionados([]);
        } else {
          setPermisosSupervisionSeleccionados([]);
          setPermisosOperacionSeleccionados([]);
        }
      }
    }
  };

  // HANDLERS - Zona de EDICIÓN
  const handleAssignedSectoresChange = (e) => {
    const { value } = e.target;
    if (perfil === '3') {
      // Operador: solo permite 1 sector
      setAssignedSectores(Array.isArray(value) ? value.slice(0, 1) : [value]);
    } else {
      setAssignedSectores(Array.isArray(value) ? value : []);
    }
  };

  const handleUserFieldChange = (e) => {
    // Forzar minúsculas
    setUserField(e.target.value.toLowerCase());
  };

  const handleCorreoChange = (e) => {
    const value = e.target.value;
    setCorreo(value);
    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!regex.test(value)) {
      setCorreoError('Formato de correo no válido');
    } else {
      setCorreoError('');
    }
  };

  const handlePerfilChange = (e) => {
    setPerfil(e.target.value);
    // Reiniciar permisos al cambiar perfil
    setPermisosSupervisionSeleccionados([]);
    setPermisosOperacionSeleccionados([]);
  };

  const handleCondicionChange = (e) => {
    setCondicion(e.target.value);
  };

  const handlePermisosSupervisionChange = (e) => {
    const { value } = e.target;
    setPermisosSupervisionSeleccionados(Array.isArray(value) ? value : []);
  };

  const handlePermisosOperacionChange = (e) => {
    const { value } = e.target;
    setPermisosOperacionSeleccionados(Array.isArray(value) ? value : []);
  };

  // Handler de envío: arma el payload con los datos
  const handleAccept = () => {
    const usuarioPayload = {
      idUsuario: selectedUsuario === 'nuevo' ? null : selectedUsuario,
      usuarioNombre: nombre,
      usuarioApellido: apellido,
      usuarioUsuario: userField,
      usuarioCorreo: correo,
      usuarioPerfil: { idPerfil: Number(perfil) },
      usuarioCondicion: { idCondicion: Number(condicion) },
      // Asignar sectores editados
      usuarioSector: assignedSectores.map(id => {
        const sector = Object.values(storeSector).find(s => s.idSector === id);
        return { idSector: id, sectorNombre: sector ? sector.sectorNombre : '' };
      })
    };

    if (perfil === '2') {
      usuarioPayload.usuarioPermisoSupervision = permisosSupervisionSeleccionados.map(idPermiso => {
        const permiso = storePermisos.permisoSupervision.find(p => p.idPermiso === idPermiso);
        return { idPermiso, permisoNombre: permiso?.permisoNombre || '' };
      });
      usuarioPayload.usuarioPermisoOperacion = permisosOperacionSeleccionados.map(idPermiso => {
        const permiso = storePermisos.permisoOperacion.find(p => p.idPermiso === idPermiso);
        return { idPermiso, permisoNombre: permiso?.permisoNombre || '' };
      });
    } else if (perfil === '3') {
      usuarioPayload.usuarioPermisoOperacion = permisosOperacionSeleccionados.map(idPermiso => {
        const permiso = storePermisos.permisoOperacion.find(p => p.idPermiso === idPermiso);
        return { idPermiso, permisoNombre: permiso?.permisoNombre || '' };
      });
    }

    sendMessageThroughWebSocket('usuarioadminWS', {
      ingresoDatos: {
        idSector: '',
        sectores: usuarioPayload.usuarioSector,
        usuario: usuarioPayload,
      },
    });
  };

  return (
    <Box p={3}>
      <Container maxWidth="lg">
        {/* Zona de SELECCIÓN (Fondo azul claro) */}
        <Box sx={{ bgcolor: '#e3f2fd', p: 2, mb: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Filtrar por Sectores</InputLabel>
            <Select
              multiple
              value={filterSectores}
              onChange={handleFilterSectoresChange}
              renderValue={(selected) =>
                selected.map(id => {
                  const sector = Object.values(storeSector).find(s => s.idSector === id);
                  return sector ? sector.sectorNombre : '';
                }).join(', ')
              }
            >
              {Object.values(storeSector).map(sector => (
                <MenuItem key={sector.idSector} value={sector.idSector}>
                  <Checkbox checked={filterSectores.includes(sector.idSector)} />
                  <ListItemText primary={sector.sectorNombre} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Buscar Usuario"
            value={userSearch}
            onChange={handleUserSearchChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Usuarios</InputLabel>
            <Select value={selectedUsuario} onChange={handleUsuarioChange}>
              <MenuItem value="nuevo">Nuevo Usuario</MenuItem>
              {filteredUsers
              .filter((usuario) => usuario.usuarioPerfil && (usuario.usuarioPerfil.idPerfil === 2 || usuario.usuarioPerfil.idPerfil === 3))
              .map(user => (
                <MenuItem key={user.idUsuario} value={user.idUsuario}>
                  {user.usuarioNombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Zona de EDICIÓN/INGRESO de datos (sin fondo especial) */}
        {selectedUsuario && (
          <Box sx={{ p: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Sectores Asignados</InputLabel>
              <Select
                multiple
                value={assignedSectores}
                onChange={handleAssignedSectoresChange}
                renderValue={(selected) =>
                  selected.map(id => {
                    const sector = Object.values(storeSector).find(s => s.idSector === id);
                    return sector ? sector.sectorNombre : '';
                  }).join(', ')
                }
              >
                {Object.values(storeSector).map(sector => (
                  <MenuItem key={sector.idSector} value={sector.idSector}>
                    <Checkbox checked={assignedSectores.includes(sector.idSector)} />
                    <ListItemText primary={sector.sectorNombre} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Usuario"
              value={userField}
              onChange={handleUserFieldChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Correo"
              value={correo}
              onChange={handleCorreoChange}
              type="email"
              error={!!correoError}
              helperText={correoError}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Perfil</InputLabel>
              <Select value={perfil} onChange={handlePerfilChange}>
                <MenuItem value="2">Supervisor</MenuItem>
                <MenuItem value="3">Operador</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Condición</InputLabel>
              <Select value={condicion} onChange={handleCondicionChange}>
                <MenuItem value="1">Habilitado</MenuItem>
                <MenuItem value="2">Deshabilitado</MenuItem>
                <MenuItem value="3">Testing</MenuItem>
              </Select>
            </FormControl>
            {perfil === '2' && (
              <>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Permisos Supervisión</InputLabel>
                  <Select
                    multiple
                    value={permisosSupervisionSeleccionados}
                    onChange={handlePermisosSupervisionChange}
                    renderValue={(selected) =>
                      selected.map(id => {
                        const permiso = storePermisos.permisoSupervision.find(p => p.idPermiso === id);
                        return permiso?.permisoNombre;
                      }).join(', ')
                    }
                  >
                    {storePermisos.permisoSupervision.map(permiso => (
                      <MenuItem key={permiso.idPermiso} value={permiso.idPermiso}>
                        <Checkbox checked={permisosSupervisionSeleccionados.includes(permiso.idPermiso)} />
                        <ListItemText primary={permiso.permisoNombre} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Permisos Operación</InputLabel>
                  <Select
                    multiple
                    value={permisosOperacionSeleccionados}
                    onChange={handlePermisosOperacionChange}
                    renderValue={(selected) =>
                      selected.map(id => {
                        const permiso = storePermisos.permisoOperacion.find(p => p.idPermiso === id);
                        return permiso?.permisoNombre;
                      }).join(', ')
                    }
                  >
                    {storePermisos.permisoOperacion.map(permiso => (
                      <MenuItem key={permiso.idPermiso} value={permiso.idPermiso}>
                        <Checkbox checked={permisosOperacionSeleccionados.includes(permiso.idPermiso)} />
                        <ListItemText primary={permiso.permisoNombre} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
            {perfil === '3' && (
              <FormControl fullWidth margin="normal">
                <InputLabel>Permisos Operación</InputLabel>
                <Select
                  multiple
                  value={permisosOperacionSeleccionados}
                  onChange={handlePermisosOperacionChange}
                  renderValue={(selected) =>
                    selected.map(id => {
                      const permiso = storePermisos.permisoOperacion.find(p => p.idPermiso === id);
                      return permiso?.permisoNombre;
                    }).join(', ')
                  }
                >
                  {storePermisos.permisoOperacion.map(permiso => (
                    <MenuItem key={permiso.idPermiso} value={permiso.idPermiso}>
                      <Checkbox checked={permisosOperacionSeleccionados.includes(permiso.idPermiso)} />
                      <ListItemText primary={permiso.permisoNombre} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <Box mt={3} display="flex" gap={4}>
              <Button variant="outlined" color="secondary">
                Reset
              </Button>
              <Button variant="contained" color="primary" onClick={handleAccept}>
                Aceptar
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}