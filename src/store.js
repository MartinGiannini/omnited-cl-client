import { configureStore } from '@reduxjs/toolkit';

import casSlice from './store/casSlice';
import notificationSlice from 'store/notificationSlice';
import wbsSlice from 'store/wbsSlice';
import userMessagesSlice from 'store/userMessagesSlice';
import userStatisticsSlice from 'store/userStatistics';
import whatsAppSlice from 'store/whatsAppSlice';
import twitterSlice from 'store/twitterSlice';
import usuarioSlice from 'store/usuarioSlice';
import sectorSlice from 'store/sectorSlice';
import grupoSlice from 'store/grupoSlice';
import permisosSlice from 'store/permisosSlice';
import dialogSlice from 'store/dialogSlice';
import estrategiasSlice from 'store/estrategiasSlice';
import realTimeSlice from 'store/realTimeSlice';
import botWhatsAppSlice from 'store/botWhatsAppSlice';
import localSlice from 'store/localSlice';

import loggerMiddleware from './middleware/loggerMiddleware';

export const store = configureStore({
  reducer: {
    storeCas: casSlice,
    storeNotification: notificationSlice,
    storeWbs: wbsSlice,
    storeUserStatistics: userStatisticsSlice,
    storeUserMessages: userMessagesSlice,
    storeWhatsApp: whatsAppSlice,
    storeTwitter: twitterSlice,
    storeUsuario: usuarioSlice,
    storeSector: sectorSlice,
    storeGrupos: grupoSlice,
    storePermisos: permisosSlice,
    storeDialog: dialogSlice,
    storeEstrategias: estrategiasSlice,
    storeRealTime: realTimeSlice,
    storeBotWhatsApp: botWhatsAppSlice,
    storeLocal: localSlice
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loggerMiddleware),
});