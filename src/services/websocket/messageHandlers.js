import {
    updateUsuarioData,
    updateUsuarioHabilidad,
    updateUsuarioEstado,
    updateUsuarioEstadoActual,
    updateUsuarioPermisoOperacion
} from '../../store/usuarioSlice';
import {
    updateSectorData,
    updateSectorUsuarioHabilidad,
    updateSectorUsuarioEstado,
    updateSectorUsuarioPermisoOperacion,
    updateSectorCola,
    updateSectorGrupoEstado,
    updateSectorGrupoHabilidad,
    addSectorGrupoHabilidad,
    addSectorGrupoEstado
} from '../../store/sectorSlice';
import {
    updateGrupoData,
    updateGrupoEstados,
    updateGrupoHabilidades,
    addGrupoHabilidades,
    addGrupoEstados
} from '../../store/grupoSlice';
import { updatePermisosData } from '../../store/permisosSlice';
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

    usuariologinestrategiasDB: (dispatch, message) => {
        //const parsedMessage = JSON.parse(message);
        dispatch(updateEstrategiasData(message));
    },

    usuarioHabilidadesDB: (dispatch, message) => {
        dispatch(updateUsuarioHabilidad(message));
        dispatch(updateSectorUsuarioHabilidad(message));
    },

    usuarioEstadosDB: (dispatch, message) => {
        dispatch(updateUsuarioEstado(message));
        dispatch(updateSectorUsuarioEstado(message));
    },

    usuarioPermisosOperacionDB: (dispatch, message) => {
        dispatch(updateUsuarioPermisoOperacion(message));
        dispatch(updateSectorUsuarioPermisoOperacion(message));
    },

    sectorColaDB: (dispatch, message) => {
        dispatch(updateSectorCola(message));
    },

    actualizaGrupoEstadosDB: (dispatch, message) => {
        dispatch(updateSectorGrupoEstado(message));
        dispatch(updateGrupoEstados(message));
    },

    agregaGrupoEstadosDB: (dispatch, message) => {
        dispatch(addSectorGrupoEstado(message));
        dispatch(addGrupoEstados(message));
    },

    actualizaGrupoHabilidadesDB: (dispatch, message) => {
        dispatch(updateSectorGrupoHabilidad(message));
        dispatch(updateGrupoHabilidades(message));
    },

    agregaGrupoHabilidadesDB: (dispatch, message) => {
        dispatch(addSectorGrupoHabilidad(message));
        dispatch(addGrupoHabilidades(message));
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