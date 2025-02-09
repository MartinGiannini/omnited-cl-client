import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendMessageThroughWebSocket } from '../../services/backend/Conexion';
import { wbsReceiveMsg } from '../../store/wbsSlice'

export const useWebSocketInicial = () => {
    const dispatch = useDispatch();
    const casUsuario = useSelector((state) => state.storeCas.casUsuario);
    const wbsConnStatus = useSelector((state) => state.storeWbs.wbsConnStatus);
    const idUsuario = useSelector((state) => state.storeUsuario.idUsuario);
    const usuarioSector = useSelector((state) => state.storeUsuario.usuarioSector);
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
     * Cuando el id del Slice Usuario recibe un cambio, envía la solicitud del resto de información. 
     * Esto debería pasar solo cuando el usuario tiene perfil Administrador o Supervisor
     * sectores -> es lo que está esperando el back para identificar "usuarioSector"
     */
    useEffect(() => {
        if (wbsConnStatus === 2) {
            sendMessageThroughWebSocket('usuariologinsectoresWS', {
                sectoresDatos: {
                    usuario: casUsuario,
                    sectores: usuarioSector
                },
            });
            sendMessageThroughWebSocket('usuariologingruposWS', {
                sectoresDatos: {
                    usuario: casUsuario,
                    sectores: usuarioSector
                },
            });
            setUserDataLoaded(true);
        }
    }, [idUsuario]);

    return userDataLoaded;
};