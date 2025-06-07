import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    
};

const botsWhatsAppSlice = createSlice({
    name: 'botsWhatsApp',
    initialState,
    reducers: {
        updateBotsWhatsAppData: (state, action) => {
            return { ...state, ...action.payload };
        }
    }
});

export const { updateBotsWhatsAppData } = botsWhatsAppSlice.actions;
export default botsWhatsAppSlice.reducer;