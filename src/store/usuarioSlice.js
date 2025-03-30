import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    idUsuario: null,
    usuarioPerfil: '',
    usuarioNombre: '',
    usuarioApellido: '',
    usuarioUsuario: '',
    usuarioCorreo: '',
    usuarioExtension: [],
    usuarioEstado: [],
    usuarioHabilidad: [],
    usuarioPermisoOperacion: [],
    usuarioPermisoSupervision: [],
    usuarioPermisoAdministracion: [],
    usuarioSector: []
};

const usuarioSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUsuarioData: (state, action) => {
            const payload = action.payload;
            return {
                ...state,
                ...payload
            };
        },
        updateUsuarioHabilidad: (state, action) => {
            const { idUsuario, usuarioHabilidad } = action.payload;
            if (state.idUsuario && idUsuario && state.idUsuario === idUsuario) {
                state.usuarioHabilidad = usuarioHabilidad;
            }
        },
        updateUsuarioEstado: (state, action) => {
            const { idUsuario, usuarioEstado } = action.payload;
            if (state.idUsuario && idUsuario && state.idUsuario === idUsuario) {
                state.usuarioEstado = usuarioEstado;
            }
        },
        updateUsuarioPermisoOperacion: (state, action) => {
            const { idUsuario, usuarioPermisoOperacion } = action.payload;
            if (state.idUsuario && idUsuario && state.idUsuario === idUsuario) {
                state.usuarioPermisoOperacion = usuarioPermisoOperacion;
            }
        },
        updateUsuarioPermisoSupervision: (state, action) => {
            const { idUsuario, usuarioPermisoSupervision } = action.payload;
            if (state.idUsuario && idUsuario && state.idUsuario === idUsuario) {
                state.usuarioPermisoSupervision = usuarioPermisoSupervision;
            }
        }
    }
});

export const {
    updateUsuarioData,
    updateUsuarioHabilidad,
    updateUsuarioEstado,
    updateUsuarioPermisoOperacion,
    updateUsuarioPermisoSupervision
} = usuarioSlice.actions;
export default usuarioSlice.reducer;