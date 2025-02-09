import { createSlice } from '@reduxjs/toolkit';

const dialogSlice = createSlice({
  name: 'dialog',
  initialState: {
    open: false,
    title: '',
    message: ''
  },
  reducers: {
    showDialog(state, action) {
      state.open = true;
      state.title = action.payload.title;
      state.message = action.payload.message;
    },
    closeDialog(state) {
      state.open = false;
      state.title = '';
      state.message = '';
    }
  }
});

export const { showDialog, closeDialog } = dialogSlice.actions;
export default dialogSlice.reducer;