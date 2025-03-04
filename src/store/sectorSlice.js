import { createSlice } from '@reduxjs/toolkit';

const initialState = {

};

const sectorSlice = createSlice({
    name: 'sector',
    initialState,
    reducers: {
        updateSectorData: (state, action) => {
            return { ...state, ...action.payload };
        },
        updateSectorUsuarioHabilidad: (state, action) => {
            const { idUsuario, usuarioHabilidad } = action.payload;
            // Recorremos cada clave (cada sector) del state
            Object.keys(state).forEach((key) => {
                const sector = state[key];
                if (sector.sectorUsuario && Array.isArray(sector.sectorUsuario)) {
                    // Actualizamos cada usuario que tenga el idUsuario que coincide
                    sector.sectorUsuario = sector.sectorUsuario.map((user) => {
                        if (user.idUsuario === idUsuario) {
                            return { ...user, usuarioHabilidad };
                        }
                        return user;
                    });
                }
            });
        },
        updateSectorUsuarioEstado: (state, action) => {
            const { idUsuario, usuarioEstado } = action.payload;
            // Recorremos cada clave (cada sector) del state
            Object.keys(state).forEach((key) => {
                const sector = state[key];
                if (sector.sectorUsuario && Array.isArray(sector.sectorUsuario)) {
                    // Actualizamos cada usuario que tenga el idUsuario que coincide
                    sector.sectorUsuario = sector.sectorUsuario.map((user) => {
                        if (user.idUsuario === idUsuario) {
                            return { ...user, usuarioEstado };
                        }
                        return user;
                    });
                }
            });
        },
        updateSectorUsuarioPermisoOperacion: (state, action) => {
            const { idUsuario, usuarioPermisoOperacion } = action.payload;
            // Recorremos cada clave (cada sector) del state
            Object.keys(state).forEach((key) => {
                const sector = state[key];
                if (sector.sectorUsuario && Array.isArray(sector.sectorUsuario)) {
                    // Actualizamos cada usuario que tenga el idUsuario que coincide
                    sector.sectorUsuario = sector.sectorUsuario.map((user) => {
                        if (user.idUsuario === idUsuario) {
                            return { ...user, usuarioPermisoOperacion };
                        }
                        return user;
                    });
                }
            });
        },
        updateSectorUsuarioPermisoSupervision: (state, action) => {
            const { idUsuario, usuarioPermisoSupervision } = action.payload;
            // Recorremos cada clave (cada sector) del state
            Object.keys(state).forEach((key) => {
                const sector = state[key];
                if (sector.sectorUsuario && Array.isArray(sector.sectorUsuario)) {
                    // Actualizamos cada usuario que tenga el idUsuario que coincide
                    sector.sectorUsuario = sector.sectorUsuario.map((user) => {
                        if (user.idUsuario === idUsuario) {
                            return { ...user, usuarioPermisoSupervision };
                        }
                        return user;
                    });
                }
            });
        },
        updateSectorGrupoEstado: (state, action) => {
            const newGrupoEstado = action.payload; // El objeto que llega con idGrupoEstado, grupoEstadoNombre, estado, etc.
            Object.keys(state).forEach((key) => {
                const sector = state[key];
                if (sector.sectorGrupoEstado && Array.isArray(sector.sectorGrupoEstado)) {
                    const index = sector.sectorGrupoEstado.findIndex(
                        (grupo) => grupo.idGrupoEstado === newGrupoEstado.idGrupoEstado
                    );
                    if (index !== -1) {
                        // Actualiza el grupo encontrado con el nuevo objeto completo
                        sector.sectorGrupoEstado[index] = newGrupoEstado;
                    }
                }
            });
        },
        updateSectorGrupoHabilidad: (state, action) => {
            const { idGrupoHabilidad, habilidad } = action.payload;
            Object.keys(state).forEach((key) => {
                const sector = state[key];
                if (sector.sectorGrupoHabilidad && Array.isArray(sector.sectorGrupoHabilidad)) {
                    const index = sector.sectorGrupoHabilidad.findIndex(
                        (grupo) => grupo.idGrupoHabilidad === idGrupoHabilidad
                    );
                    if (index !== -1) {
                        // Actualizamos solo la propiedad "habilidad" del grupo que coincide
                        sector.sectorGrupoHabilidad[index].habilidad = habilidad;
                    }
                }
            });
        },
        addSectorGrupoHabilidad: (state, action) => {
            const newGrupo = action.payload; // Objeto completo del grupo recibido
            const sectorId = newGrupo.sector?.idSector;
            if (!sectorId) return; // Si no viene idSector, no se hace nada
            // Recorremos cada sector del state
            Object.keys(state).forEach((key) => {
                const sector = state[key];
                if (sector.idSector === sectorId) {
                    // Si no existe el array, lo inicializamos
                    if (!sector.sectorGrupoHabilidad) {
                        sector.sectorGrupoHabilidad = [];
                    }
                    // Agregamos el nuevo grupo al final
                    sector.sectorGrupoHabilidad.push(newGrupo);
                }
            });
        },
        addSectorGrupoEstado: (state, action) => {
            const newGrupo = action.payload; // Objeto recibido con idGrupoEstado, grupoEstadoNombre, estado, sector, etc.
            const sectorId = newGrupo.sector?.idSector;
            if (!sectorId) return; // Si no viene un idSector, no hacemos nada
            // Recorremos cada sector del state (suponiendo que state es un objeto con claves numéricas o similares)
            Object.keys(state).forEach((key) => {
                const sector = state[key];
                if (sector.idSector === sectorId) {
                    // Si no existe el array sectorGrupoEstado, lo inicializamos
                    if (!sector.sectorGrupoEstado) {
                        sector.sectorGrupoEstado = [];
                    }
                    // Agregamos el nuevo grupo al final
                    sector.sectorGrupoEstado.push(newGrupo);
                }
            });
        },
        updateSectorCola: (state, action) => {
            const { idCola, idSector, ...resto } = action.payload;
            // Recorremos cada sector
            Object.keys(state).forEach((key) => {
                if (state[key].idSector === idSector) {
                    // Buscamos la cola que coincide
                    const index = state[key].sectorCola.findIndex((cola) => cola.idCola === idCola);
                    if (index !== -1) {
                        // Actualizamos la cola con los datos nuevos, haciendo merge para conservar las propiedades no modificadas
                        state[key].sectorCola[index] = { ...state[key].sectorCola[index], ...resto };
                    }
                }
            });
        },
        addSectorCola: (state, action) => {
            const newCola = action.payload; // Debe incluir idSector y demás datos de la cola
            Object.keys(state).forEach((key) => {
                if (state[key].idSector === newCola.idSector) {
                    // Si no existe el array sectorCola, lo inicializamos
                    if (!state[key].sectorCola) {
                        state[key].sectorCola = [];
                    }
                    state[key].sectorCola.push(newCola);
                }
            });
        },
        updateSectorUsuario: (state, action) => {
            const { idUsuario, usuarioSector, ...userData } = action.payload;
            // Extraer los idSector a los que debe pertenecer el usuario
            const sectoresAActualizar = usuarioSector.map(s => s.idSector);
            Object.keys(state).forEach(key => {
                const sector = state[key];
                if (!Array.isArray(sector.sectorUsuario)) return;
                if (sectoresAActualizar.includes(sector.idSector)) {
                    // Si el sector debe contener al usuario, lo actualizamos o lo agregamos si no existe.
                    const index = sector.sectorUsuario.findIndex(u => u.idUsuario === idUsuario);
                    if (index !== -1) {
                        sector.sectorUsuario[index] = { ...sector.sectorUsuario[index], ...userData };
                    } else {
                        sector.sectorUsuario.push({ idUsuario, ...userData });
                    }
                } else {
                    // En sectores que no están en el arreglo, eliminamos el usuario
                    sector.sectorUsuario = sector.sectorUsuario.filter(u => u.idUsuario !== idUsuario);
                }
            });
        },
        addSectorUsuario: (state, action) => {
            // Se separa el arreglo de sectores y el resto de los datos del usuario.
            const { usuarioSector, ...userData } = action.payload;
            // Extraemos los idSector en los que se debe agregar el usuario.
            const sectoresAAgregar = usuarioSector.map(s => s.idSector);
            // Recorremos cada sector del state.
            Object.keys(state).forEach(key => {
                const sector = state[key];
                // Si este sector está incluido en los sectores a agregar:
                if (sectoresAAgregar.includes(sector.idSector)) {
                    // Inicializamos sectorUsuario si no existe.
                    if (!Array.isArray(sector.sectorUsuario)) {
                        sector.sectorUsuario = [];
                    }
                    // Agregamos el usuario solo si aún no existe en ese sector.
                    if (!sector.sectorUsuario.some(u => u.idUsuario === userData.idUsuario)) {
                        sector.sectorUsuario.push(userData);
                    }
                }
            });
        },
        updateSector: (state, action) => {
            const newSector = action.payload;
            Object.keys(state).forEach((key) => {
                if (state[key].idSector === newSector.idSector) {
                    state[key] = { ...state[key], ...newSector };
                }
            });
        }
    }
});

export const {
    updateSectorData,
    updateSector,
    updateSectorCola,
    updateSectorUsuario,
    updateSectorUsuarioHabilidad,
    updateSectorUsuarioEstado,
    updateSectorUsuarioPermisoOperacion,
    updateSectorUsuarioPermisoSupervision,
    updateSectorGrupoEstado,
    updateSectorGrupoHabilidad,
    addSectorGrupoHabilidad,
    addSectorGrupoEstado,
    addSectorCola,
    addSectorUsuario
} = sectorSlice.actions;
export default sectorSlice.reducer;