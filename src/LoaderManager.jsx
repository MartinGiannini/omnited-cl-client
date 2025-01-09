import React from 'react';
import { useSelector } from 'react-redux';
import App from './App';
import CasComponent from './api/cas/cas.component';
import WebSocketService from './services/websocket/websocket.service';

export default function LoaderManager() {
  const casLogged = useSelector((state) => state.storeCas.casLogged);

  if (!casLogged) {
    return (
      <CasComponent />
    )
  }

  return (
    <>
      <WebSocketService />
      {!casLogged ? <CasComponent /> : <App />}
    </>
  );
}