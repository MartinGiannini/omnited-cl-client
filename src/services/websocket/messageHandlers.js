import { updateUsuarioData } from '../../store/usuarioSlice';
import { updateSectorData } from '../../store/sectorSlice';
import { updateGrupoData } from '../../store/grupoSlice';
import { updatePermisosData } from '../../store/permisosSlice';
import { updateUsuarioEstadoActual } from '../../store/usuarioSlice';
import { showDialog } from '../../store/dialogSlice';
import { updateEstrategiasData } from '../../store/estrategiasSlice';

export const messageHandlers = {

    ping: () => {
        //Do nothing, es solo la respuesta del ping
    },

    usuariologinDB: (dispatch, message) => {
        //const parsedMessage = JSON.parse(message);
        dispatch(updateUsuarioData(message));
        dispatch(updateUsuarioEstadoActual(1));
    },

    usuariologinsectoresDB: (dispatch, message) => {
        //const parsedMessage = JSON.parse(message);
        dispatch(updateSectorData(message));
    },

    usuariologingruposDB: (dispatch, message) => {
        //const parsedMessage = JSON.parse(message);
        dispatch(updateGrupoData(message));
    },

    usuariologinpermisosDB: (dispatch, message) => {
        //const parsedMessage = JSON.parse(message);
        dispatch(updatePermisosData(message));
    },

    cambiosRealizadosDB: (dispatch, message) => {
        // Despachar la acción para mostrar el diálogo
        dispatch(
            showDialog({
                title: message.title || 'Título por defecto',
                message: message.message || 'Mensaje por defecto'
            })
        );
    },

    estrategiasDB: (dispatch, message) => {
        //const parsedMessage = JSON.parse(message);
        dispatch(updateEstrategiasData(message));
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