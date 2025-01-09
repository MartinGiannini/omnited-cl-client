import { createSlice } from '@reduxjs/toolkit';

// Estado inicial con destinatarios de prueba
const initialState = {
  recipients: ['jperez', 'jdoe', 'jndoe'],
  history: []
}

const userMessagesSlice = createSlice({
  name: 'userMessages',
  initialState,
  reducers: {
    setRecipients: (state, action) => {
      // Establecer una nueva lista de destinatarios
      state.recipients = action.payload;
    },
    sendMessage: (state, action) => {
      state.history.push({ type: 'sent', message: action.payload });
    },
  },
});

// Exportar las acciones
export const { setRecipients, sendMessage } = userMessagesSlice.actions;

// Exportar el reducer
export default userMessagesSlice.reducer;