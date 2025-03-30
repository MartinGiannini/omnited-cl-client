import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    usuarioEstadoActual: '0',
    extensionConnectionStatus: 0 // Desconectado
};

/*
extensionConnectionStatus:

0 => Desconectado
1 => Conectado
2 => Llamada Ringueando
3 => Llamada Establecida
4 => Llamada Holdeada
5 => ¿?
*/

const localSlice = createSlice({
    name: 'local',
    initialState,
    reducers: {
        updateUsuarioEstadoActual: (state, action) => {
            state.usuarioEstadoActual = action.payload;
        },
        updateExtensionConnectionStatus: (state, action) => {
            state.extensionConnectionStatus = action.payload;
        }
    }
});

export const {
    updateUsuarioEstadoActual,
    updateExtensionConnectionStatus
} = localSlice.actions;
export default localSlice.reducer;