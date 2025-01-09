import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wbsConnStatus: 0,
  wbsLastMessage: null,
  wbsMsgHistory: [],
  wbsSendMessage: ''
};

const wbsSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    wbsUpdateConnStatus: (state, action) => {
      state.wbsConnStatus = action.payload;
    },
    wbsReceiveMsg: (state, action) => {
      state.wbsLastMessage = action.payload;
      state.wbsMsgHistory.push(action.payload);
    },
    wbsSendMsgToStore: (state, action) => {
      state.wbsMsgHistory.push({ type: 'sent', message: action.payload });
    },
    wbsClearMsgHistory: (state) => {
      state.wbsMsgHistory = [];
    },
  },
});

export const { wbsUpdateConnStatus, wbsReceiveMsg, wbsSendMsgToStore, wbsClearMsgHistory } = wbsSlice.actions;

export default wbsSlice.reducer;