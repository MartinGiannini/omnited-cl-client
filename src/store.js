import { configureStore } from '@reduxjs/toolkit';

import casSlice from './store/casSlice';
import notificationSlice from 'store/notificationSlice';
import wbsSlice from 'store/wbsSlice';
import userMessagesSlice from 'store/userMessagesSlice';
import userStatisticsSlice from 'store/userStatistics';
import webrtcSlice from 'store/webrtcSlice';
import userOptionsSlice from 'store/usersOptionsSlice';
import whatsAppSlice from 'store/whatsAppSlice';
import twitterSlice from 'store/twitterSlice';
import usuarioSlice from 'store/usuarioSlice';
import sectorSlice from 'store/sectorSlice';
import grupoSlice from 'store/grupoSlice';

import loggerMiddleware from './middleware/loggerMiddleware';

export const store = configureStore({
  reducer: {
    storeCas: casSlice,
    storeNotification: notificationSlice,
    storeWbs: wbsSlice,
    storeWebrtc: webrtcSlice,
    storeUserStatistics: userStatisticsSlice,
    storeUserMessages: userMessagesSlice,
    storeUserOptions: userOptionsSlice,
    storeWhatsApp: whatsAppSlice,
    storeTwitter: twitterSlice,
    storeUsuario: usuarioSlice,
    storeSector: sectorSlice,
    storeGrupo: grupoSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loggerMiddleware),
});