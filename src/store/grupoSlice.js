import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    
};

const grupoSlice = createSlice({
    name: 'grupo',
    initialState,
    reducers: {
        updateGrupoData: (state, action) => {
            return { ...state, ...action.payload };
        }
    }
});

export const { updateGrupoData } = grupoSlice.actions;
export default grupoSlice.reducer;