import { getSendMessageFn } from '../../utils/websocketHelper';

export const sendMessageThroughWebSocket = (message) => {
    const sendMessage = getSendMessageFn();
    if (sendMessage) {
        sendMessage(message);
        console.log(`Mensaje enviado: ${message}`);
    } else {
        console.error('WebSocket no está listo para enviar mensajes.');
    }
};