import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  uriStore: 'sip:mgiannini@localhost',
  serverStore: 'ws://localhost:8088/ws',
  dominioStore: 'localhost',
  connectionStatus: 0, //Desconectado
  usuarioStore: 'mgiannini',
  password: 'mgiannini'
};

/*
0 => Desconectado
1 => Conectado
2 => Llamada Ringueando
3 => Llamada Establecida
4 => Llamada Holdeada
5 => ¿?
*/

const webrtcSlice = createSlice({
  name: 'webrtc',
  initialState,
  reducers: {
    updateConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;
    },
    updateUriStore: (state, action) => {
      state.uriStore = action.payload;
    },
    updateServerStore: (state, action) => {
      state.serverStore = action.payload;
    },
    updateDominioStore: (state, action) => {
      state.dominioStore = action.payload;
    },
    updateUsuarioStore: (state, action) => {
      state.usuarioStore = action.payload;
    },
    updatePasswordStore: (state, action) => {
      state.passwordStore = action.payload;
    },
  },
});

export const { updateConnectionStatus, updateUriStore, updateServerStore, updateDominioStore, updateUsuarioStore, updatePasswordStore } = webrtcSlice.actions;

export default webrtcSlice.reducer;