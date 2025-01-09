import { createSlice } from '@reduxjs/toolkit';

const initialState = [];
 
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    // Agregar una nueva notificación
    addNotification: (state, action) => {
      state.push({
        id: Date.now(), // Generar un id único
        message: action.payload.message,
        timestamp: new Date().toISOString(),
        isRead: false
      });
    },

    // Marcar una notificación como leída
    markAsRead: (state, action) => {
      const notification = state.find(n => n.id === action.payload.id);
      console.log("Voy a marcar el id: ",notification)
      if (notification) {
        notification.isRead = true;
      }
    },

    markAllAsRead: (state) => {
      // Marcar todas las notificaciones como leídas
      state.forEach(notification => {
        
        notification.isRead = true;
      });
    },

    // Eliminar una notificación
    removeNotification: (state, action) => {
      return state.filter(n => n.id !== action.payload.id);
    }
  }
});

export const { addNotification, markAsRead, markAllAsRead, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;