import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    comtotal: {
        isLoss: true,
        comtotal: '150',
        percent: 25,
        month: [76, 85, 101, 98, 87, 105, 91, 114, 0, 0, 0, 0],
        weekly: [31, 40, 28, 51, 42],
        weeklytotal: 20
    },
    comphone: {
        isLoss: false,
        comtotal: '100',
        percent: 10,
        month: [76, 85, 101, 98, 87, 105, 91, 114, 0, 0, 0, 0],
        weekly: [31, 40, 28, 51, 42],
    },
    comwhatsapp: {
        isLoss: true,
        comtotal: '50',
        percent: 4,
        month: [110, 60, 150, 35, 60, 36, 26, 45, 65, 52, 0, 0],
        weekly: [11, 32, 45, 32, 34],
    },
};

const userStatsSlice = createSlice({
    name: 'userstatistics',
    initialState,
    reducers: {
        updateComTotal: (state, action) => {
            state.comtotal.isLoss = action.payload.isLoss;
            state.comtotal.comtotal = action.payload.comtotal;
            state.comtotal.percent = action.payload.percent;
            state.comtotal.month = action.payload.month;
            state.comtotal.weekly = action.payload.weekly;
        },
        updatePhone: (state, action) => {
            state.comphone.isLoss = action.payload.isLoss;
            state.comphone.comtotal = action.payload.comtotal;
            state.comphone.percent = action.payload.percent;
            state.comphone.month = action.payload.month;
            state.comphone.weekly = action.payload.weekly;
        },
        updateWhastApp: (state, action) => {
            state.comwhatsapp.isLoss = action.payload.isLoss;
            state.comwhatsapp.comtotal = action.payload.comtotal;
            state.comwhatsapp.percent = action.payload.percent;
            state.comwhatsapp.month = action.payload.month;
            state.comwhatsapp.weekly = action.payload.weekly;
        },
    },
});

export const { updateComTotal, updatePhone, updateWhastApp } = userStatsSlice.actions;

export default userStatsSlice.reducer;