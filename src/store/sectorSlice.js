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
        updateSectorCola: (state, action) => {
            const newCola = action.payload; // Objeto con idCola y sus propiedades
            Object.keys(state).forEach((key) => {
                const sector = state[key];
                if (sector.sectorCola && Array.isArray(sector.sectorCola)) {
                    const index = sector.sectorCola.findIndex((cola) => cola.idCola === newCola.idCola);
                    if (index !== -1) {
                        sector.sectorCola[index] = newCola;
                    }
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
        }
    }
});

export const {
    updateSectorData,
    updateSectorUsuarioHabilidad,
    updateSectorUsuarioEstado,
    updateSectorUsuarioPermisoOperacion,
    updateSectorCola,
    updateSectorGrupoEstado,
    updateSectorGrupoHabilidad,
    addSectorGrupoHabilidad,
    addSectorGrupoEstado 
} = sectorSlice.actions;
export default sectorSlice.reducer;