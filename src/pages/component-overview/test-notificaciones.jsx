import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { markAsRead, removeNotification, addNotification } from '../../store/notificationSlice';
import { getSendMessageFn } from '../../utils/websocketHelper';
import { wbsSendMsgToStore } from '../../store/wbsSlice';

export default function ComponentTestNotifications() {
  const dispatch = useDispatch();
  const notification = useSelector(state => state.storeNotification);
  const [input, setInput] = useState('');
  const sendMessage = getSendMessageFn();
  const wbsConnStatus = useSelector((state) => state.storeWbs.wbsConnStatus);

  /*  INICIA NOTIFICACIONES */
  const [newNotification, setNewNotification] = useState('');

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead({ id }));
  };

  const handleRemoveNotification = (id) => {
    dispatch(removeNotification({ id }));
  };

  const handleAddNotification = () => {
    if (newNotification.trim()) {
      dispatch(addNotification({ message: newNotification }));
      setNewNotification(''); // Limpiar el campo después de agregar
    }
  };
  /*  FIN NOTIFICACIONES */
  const handleSend = () => {
    console.log("El status de la conexion es: ", wbsConnStatus)
    console.log("sendMessage es: ", sendMessage)
    if (wbsConnStatus === 2) {
      console.log("se envia el mensaje")
      dispatch(wbsSendMsgToStore(input));
      sendMessage(input); // Enviar mensaje a través del WebSocket
      setInput(''); // Limpiar el input después de enviar el mensaje
    }
  };
  /* FIN WEBSOCKET */

  return (
    <div>
      <h2>Notificaciones</h2>

      <div>
        <input
          type="text"
          placeholder="Nueva notificación"
          value={newNotification}
          onChange={(e) => setNewNotification(e.target.value)}
        />
        <button onClick={handleAddNotification}>Agregar Notificación</button>
      </div>


      <ul>
        {notification.map(notification => (
          <li key={notification.id}>
            <p>{notification.message}</p>
            <p>{notification.isRead ? 'Leído' : 'No leído'}</p>
            <button onClick={() => handleMarkAsRead(notification.id)}>Marcar como leído</button>
            <button onClick={() => handleRemoveNotification(notification.id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      <h2>WEBSOCKET</h2>

      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
        <button onClick={handleSend} >
          Enviar mensaje
        </button>
      </div>

    </div>

  );
}