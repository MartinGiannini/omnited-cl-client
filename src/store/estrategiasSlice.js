import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    
};

const estrategiasSlice = createSlice({
    name: 'estrategias',
    initialState,
    reducers: {
        updateEstrategiasData: (state, action) => {
            return { ...state, ...action.payload };
        }
    }
});

export const { updateEstrategiasData } = estrategiasSlice.actions;
export default estrategiasSlice.reducer;