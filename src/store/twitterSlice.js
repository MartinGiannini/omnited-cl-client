import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    vistaActiva: 'default', // Nueva propiedad para gestionar la vista activa
    connectionStatus: 1, // Conectado
};

const twitterSlice = createSlice({
    name: 'twitter',
    initialState,
    reducers: {
        setVistaActiva: (state, action) => { // Nuevo reducer para vista activa
            state.vistaActiva = action.payload;
        },
    },
});

export const { setVistaActiva } = twitterSlice.actions;

export default twitterSlice.reducer;