import { updateUsuarioData } from '../../store/usuarioSlice';
import { updateSectorData } from '../../store/sectorSlice';
import { updateGrupoData } from '../../store/grupoSlice';
import { updateEstadoActual } from '../../store/usersOptionsSlice';

export const messageHandlers = {
    ping: () => {
        //Do nothing, es solo la respuesta del ping
    },
    usuariologinDB: (dispatch, message) => {
        //const parsedMessage = JSON.parse(message);
        dispatch(updateUsuarioData(message));
        dispatch(updateEstadoActual(1));
    },

    usuariologinsectoresDB: (dispatch, message) => {
        //const parsedMessage = JSON.parse(message);
        dispatch(updateSectorData(message));
    },

    usuariologingruposDB: (dispatch, message) => {
        //const parsedMessage = JSON.parse(message);
        dispatch(updateGrupoData(message));
    },

    /*
    otherTreatment: (dispatch, message) => {
        const parsedMessage = JSON.parse(message);
        dispatch(updateOtherState(parsedMessage));
    },
    */

    
    default: (dispatch, message) => {
        console.warn("Unrecognized message type:", message);
    }
};