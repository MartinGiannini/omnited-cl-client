import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    wrapupTime: 10,
    estadoActual: "",
    permissions: ['util-color', 'util-shadow','util-test-notificaciones'],
};

const userOptionsSlice = createSlice({
    name: 'useroptions',
    initialState,
    reducers: {
        updateStates: (state, action) => {
            state.estadosStore = action.payload;
        },
        updateWrapup: (state, action) => {
            state.wrapupTime = action.payload;
        },
        updateEstadoActual: (state, action) => {
            state.estadoActual = action.payload;
        },
        updatePermissions: (state, action) => {
            state.permissions = action.payload;
        }
    },
});

export const { updateStates, updateWrapup, updateEstadoActual, updatePermissions } = userOptionsSlice.actions;

export default userOptionsSlice.reducer;