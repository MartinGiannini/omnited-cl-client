import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  casLogged: false,
  casUsuario: null,
  casToken: null,
  casRol: null,
};

const casSlice = createSlice({
  name: 'casAuthentication',
  initialState,
  reducers: {

    casLoginSuccess: (state, action) => {
      state.casLogged = true;
      state.casUsuario = action.payload.casUsuario;
      state.casToken = action.payload.casToken;
      state.casRol = action.payload.casRol
    },

    casLogoutSuccess: (state) => {
      state.casLogged = false;
      state.casUsuario = null;
      state.casToken = null;
      state.casRol = null;
    },
  },
});

export const { casLogged, casLoginSuccess, casLogoutSuccess } = casSlice.actions;

export default casSlice.reducer;