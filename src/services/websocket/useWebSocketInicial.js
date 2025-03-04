import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendMessageThroughWebSocket } from '../../services/backend/Conexion';

export const useWebSocketInicial = () => {
    const casUsuario = useSelector((state) => state.storeCas.casUsuario);
    const wbsConnStatus = useSelector((state) => state.storeWbs.wbsConnStatus);
    const idUsuario = useSelector((state) => state.storeUsuario.idUsuario);
    const [userDataLoaded, setUserDataLoaded] = useState(false);

    useEffect(() => {
        // Cuando el WebSocket está listo, enviamos el mensaje inicial
        if (wbsConnStatus === 2) {

            let fullData = {
                usuarioUsuario: casUsuario
            }

            sendMessageThroughWebSocket('usuariologinWS', {
                ingresoDatos: {
                    idSector: '',
                    usuario: fullData
                },
            });
        }
    }, [wbsConnStatus, casUsuario]);

    /**
     * Cuando el idUsuario recibe un cambio, envía la solicitud del resto de información. 
     * Esto debería pasar solo cuando el usuario tiene perfil Administrador o Supervisor
     * sectores -> es lo que está esperando el back para identificar "usuarioSector"
     */

    useEffect(() => {
        if (wbsConnStatus === 2) {
            setUserDataLoaded(true);
        }
    }, [idUsuario]);

    return userDataLoaded;
};