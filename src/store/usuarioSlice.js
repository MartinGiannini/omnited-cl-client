import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    idUsuario: null,
    usuarioEstadoActual: '',
    usuarioNombre: '',
    usuarioApellido: '',
    usuarioUsuario: '',
    usuarioCorreo: '',
    usuarioExtension: {
        connectionStatus: 0 // Desconectado
    },
    usuarioEstado: [],
    usuarioHabilidad: [],
    usuarioPermisoOperacion: [],
    usuarioPermisoSupervision: [],
    usuarioPermisoAdministracion: [],
    usuarioSector: []
};

/*
connectionStatus:

0 => Desconectado
1 => Conectado
2 => Llamada Ringueando
3 => Llamada Establecida
4 => Llamada Holdeada
5 => ¿?
*/

const usuarioSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUsuarioData: (state, action) => {
            const payload = action.payload;
            return {
                ...state,
                ...payload,
                usuarioExtension: payload.usuarioExtension
                    ? { ...state.usuarioExtension, ...payload.usuarioExtension }
                    : state.usuarioExtension,
                usuarioEstadoActual: action.payload.hasOwnProperty('usuarioEstadoActual')
                    ? action.payload.usuarioEstadoActual
                    : state.usuarioEstadoActual
            };
        },
        updateUsuarioExtensionStatus: (state, action) => {
            state.usuarioExtension.connectionStatus = action.payload;
        },
        updateUsuarioEstadoActual: (state, action) => {
            state.usuarioEstadoActual = action.payload;
        }
    }
});

export const { updateUsuarioData, updateUsuarioExtensionStatus, updateUsuarioEstadoActual } = usuarioSlice.actions;
export default usuarioSlice.reducer;