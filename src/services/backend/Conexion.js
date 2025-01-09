import { v4 as uuidv4 } from 'uuid';
import { getSendMessageFn } from '../../utils/websocketHelper';

function generateUniqueId() {
    return uuidv4();
}

export const sendMessageThroughWebSocket = (action, payload) => {


    console.log("El payload que estoy enviando es: ",payload)
    const saliente = JSON.stringify({
        id: generateUniqueId(),
        type: action,
        jsonPayload: payload
    })
    const sendMessage = getSendMessageFn();
    if (sendMessage) {
        sendMessage(saliente);
        console.log(`Mensaje enviado: ${saliente}`);
    } else {
        console.error('WebSocket no está listo para enviar mensajes.');
    }
};
