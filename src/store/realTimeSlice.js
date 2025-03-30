import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const realTimeSlice = createSlice({
  name: 'operadoresConectados',
  initialState,
  reducers: {
    // Agrega o actualiza el operador según idOperador
    addOrUpdateOperador: (state, action) => {
      const newOperador = action.payload;
      const index = state.findIndex(op => op.idOperador === newOperador.idOperador);
      if (index !== -1) {
        state[index] = newOperador;
      } else {
        state.push(newOperador);
      }
    },
    removeOperador: (state, action) => {
      return state.filter(op => op.idOperador !== action.payload);
    },
    clearOperadores: () => {
      return [];
    }
  }
});

export const { addOrUpdateOperador, removeOperador, clearOperadores } = realTimeSlice.actions;
export default realTimeSlice.reducer;