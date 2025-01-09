import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    vistaActiva: 'default', // Nueva propiedad para gestionar la vista activa
    connectionStatus: 1, // Conectado
};

const whatsAppSlice = createSlice({
    name: 'whatsapp',
    initialState,
    reducers: {
        setVistaActiva: (state, action) => { // Nuevo reducer para vista activa
            state.vistaActiva = action.payload;
        },
    },
});

export const { setVistaActiva } = whatsAppSlice.actions;

export default whatsAppSlice.reducer;