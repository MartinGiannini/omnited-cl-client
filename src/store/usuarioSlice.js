import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    idUsuario: null,
    nombre: '',
    apellido: '',
    usuario: '',
    correo: '',
    estados: [],
    habilidades: [],
    permisosOperacion: [],
    permisosSupervision: [],
    permisosAdministracion: [],
    sectores: []
};

const usuarioSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUsuarioData: (state, action) => {
            return { ...state, ...action.payload };
        }
    }
});

export const { updateUsuarioData } = usuarioSlice.actions;
export default usuarioSlice.reducer;