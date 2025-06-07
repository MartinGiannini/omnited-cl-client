import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import App from './App';
import CasComponent from './api/cas/cas.component';
import WebSocketService from './services/websocket/websocket.service';
import GlobalDialog from './components/GlobalDialog';
import { closeDialog } from './store/dialogSlice';
import '@xyflow/react/dist/style.css';

export default function LoaderManager() {
  const casLogged = useSelector((state) => state.storeCas.casLogged);
  const dialogState = useSelector((state) => state.storeDialog);
  const dispatch = useDispatch();

  // Definir la función handleClose
  const handleClose = () => {
    dispatch(closeDialog()); // Despacha la acción para cerrar el diálogo
  };

  if (!casLogged) {
    return (
      <CasComponent />
    )
  }

  return (
    <>
      <WebSocketService />
      <GlobalDialog
        open={dialogState.open}
        title={dialogState.title}
        message={dialogState.message}
        onClose={handleClose}
      />
      {!casLogged ? <CasComponent /> : <App />}
    </>
  );
}