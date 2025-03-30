import { createSlice } from '@reduxjs/toolkit';

const initialState = {

};

const permisosSlice = createSlice({
    name: 'permisos',
    initialState,
    reducers: {
        updatePermisosData: (state, action) => {
            return { ...state, ...action.payload };
        }
    }
});

export const { updatePermisosData } = permisosSlice.actions;
export default permisosSlice.reducer;