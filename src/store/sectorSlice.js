import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    
};

const sectorSlice = createSlice({
    name: 'sector',
    initialState,
    reducers: {
        updateSectorData: (state, action) => {
            return { ...state, ...action.payload };
        }
    }
});

export const { updateSectorData } = sectorSlice.actions;
export default sectorSlice.reducer;