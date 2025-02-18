import { createSlice } from '@reduxjs/toolkit';

const initialState = {

};

const grupoSlice = createSlice({
    name: 'grupo',
    initialState,
    reducers: {
        updateGrupoData: (state, action) => {
            return { ...state, ...action.payload };
        },
        updateGrupoEstados: (state, action) => {
            const { idGrupoEstado, estado } = action.payload;
            const grupo = state.grupoEstado.find(g => g.idGrupoEstado === idGrupoEstado);
            if (grupo) {
                grupo.estado = estado;
            }
        },
        updateGrupoHabilidades: (state, action) => {
            const { idGrupoHabilidad, habilidad } = action.payload;
            const grupo = state.grupoHabilidad.find(g => g.idGrupoHabilidad === idGrupoHabilidad);
            if (grupo) {
                grupo.habilidad = habilidad;
            }
        },
        addGrupoHabilidades: (state, action) => {
            const newGrupo = action.payload; // Objeto completo del grupo
            // Si el array aún no existe, lo inicializamos
            if (!state.grupoHabilidad) {
                state.grupoHabilidad = [];
            }
            // Agregamos el nuevo grupo
            state.grupoHabilidad.push(newGrupo);
        },
        addGrupoEstados: (state, action) => {
            const newGrupo = action.payload; // Objeto recibido
            // Si el array grupoEstado no existe, lo inicializamos
            if (!state.grupoEstado) {
                state.grupoEstado = [];
            }
            // Agregamos el nuevo grupo de estados
            state.grupoEstado.push(newGrupo);
        }
    }
});

export const {
    updateGrupoData,
    updateGrupoEstados,
    updateGrupoHabilidades,
    addGrupoHabilidades,
    addGrupoEstados
} = grupoSlice.actions;
export default grupoSlice.reducer;