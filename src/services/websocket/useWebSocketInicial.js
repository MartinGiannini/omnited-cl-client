import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendMessageThroughWebSocket } from '../../services/backend/Conexion';
import { wbsReceiveMsg } from '../../store/wbsSlice'

export const useWebSocketInicial = () => {
    const dispatch = useDispatch();
    const casUsuario = useSelector((state) => state.storeCas.casUsuario);
    const wbsConnStatus = useSelector((state) => state.storeWbs.wbsConnStatus);
    const idUsuario = useSelector((state) => state.storeUsuario.idUsuario);
    const sectores = useSelector((state) => state.storeUsuario.sectores);
    const [userDataLoaded, setUserDataLoaded] = useState(false);

    useEffect(() => {
        // Cuando el WebSocket está listo, enviamos el mensaje inicial
        if (wbsConnStatus === 2) {
            sendMessageThroughWebSocket('usuariologinWS', {
                UsuarioDatos: {
                    usuario: casUsuario,
                },
            });
        }
    }, [wbsConnStatus, casUsuario]);

    /**
     * Cuando el id del Slice Usuario recibe un cambio, envía la solicitud del resto de información. 
     * Esto debería pasar solo cuando el usuario tiene perfil Administrador o Supervisor
     */
    useEffect(() => {
        if (wbsConnStatus === 2) {
            sendMessageThroughWebSocket('usuariologinsectoresWS', {
                sectoresDatos: {
                    usuario: casUsuario,
                    sectores: sectores
                },
            });
            sendMessageThroughWebSocket('usuariologingruposWS', {
                sectoresDatos: {
                    usuario: casUsuario,
                    sectores: sectores
                },
            });
            setUserDataLoaded(true);
        }
    }, [idUsuario]);

    return userDataLoaded;
};