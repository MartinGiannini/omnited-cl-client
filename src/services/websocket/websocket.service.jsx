import React, { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { wbsUpdateConnStatus, wbsReceiveMsg } from '../../store/wbsSlice';
import { setSendMessageFn } from '../../utils/websocketHelper';
import { sendMessageThroughWebSocket } from '../backend/Conexion';
import { messageHandlers } from './messageHandlers';

const WS_URL = 'ws://localhost:8080/ws';

export default function WebSocketService() {

    const dispatch = useDispatch();

    // Configurar la conexión WebSocket
    const { sendMessage, lastMessage, readyState } = useWebSocket(WS_URL, {
        shouldReconnect: (closeEvent) => true,
        reconnectAttempts: 10,
        reconnectInterval: 3000,
    });

    useEffect(() => {
        console.log('WebSocketService mounted');
        return () => console.log('WebSocketService unmounted');
    }, []);

    // Almacenar sendMessage en el módulo auxiliar
    useEffect(() => {
        if (sendMessage) {
            setSendMessageFn(sendMessage);
        }
    }, [sendMessage]);

    // Heartbeat: enviar "ping" periódicamente para mantener la conexión activa
    useEffect(() => {
        const interval = setInterval(() => {
            if (readyState === ReadyState.OPEN) {
                //sendMessage('ping');
                sendMessageThroughWebSocket("ping", {});
            }
        }, 120000); // 120 segundos de intervalo

        return () => clearInterval(interval); // Limpiar el intervalo al desmontar
    }, [readyState, sendMessage]);

    // Actualizar el estado de la conexión en Redux
    useEffect(() => {
        const connectionStatus = {
            [ReadyState.CONNECTING]: 1,
            [ReadyState.OPEN]: 2,
            [ReadyState.CLOSING]: 3,
            [ReadyState.CLOSED]: 4,
            [ReadyState.UNINSTANTIATED]: 5,
        }[readyState];

        dispatch(wbsUpdateConnStatus(connectionStatus));
    }, [readyState, dispatch]);

    // Manejar los mensajes recibidos y actualizarlos en Redux
    useEffect(() => {
        if (lastMessage) {
            console.log("Mensaje recibido:", lastMessage.data); // Para depuración

            const rawMessage = lastMessage.data; // La cadena completa del mensaje
            const separatorIndex = rawMessage.indexOf(";"); // Buscamos el delimitador ";"

            if (separatorIndex !== -1) {
                const type = rawMessage.substring(0, separatorIndex); // Extraemos el tipo
                const payload = rawMessage.substring(separatorIndex + 1); // Extraemos el JSON

                try {
                    let parsedPayload;
                    if (typeof payload === "string") {
                        parsedPayload = JSON.parse(payload); // Si es una cadena, parsear a JSON
                        console.log("*****************************")
                        console.log("******** Es STRING **********")
                        console.log("*****************************")
                    } else {
                        parsedPayload = payload; // Si ya es un objeto, úsalo directamente
                        console.log("*****************************")
                        console.log("******** Es OBJETO **********")
                        console.log("*****************************")
                    }

                    const handler = messageHandlers[type] || messageHandlers.default;
                    handler(dispatch, parsedPayload);
                } catch (error) {
                    console.error("Error procesando el payload:", error);
                }
            } else {
                console.warn("Mensaje con formato inválido, falta separador ';':", rawMessage);
            }
        }
    }, [lastMessage, dispatch]);

    return <></>;
};