import {
    updateUsuarioData,
    updateUsuarioHabilidad,
    updateUsuarioEstado,
    updateUsuarioPermisoOperacion,
    updateUsuarioPermisoSupervision
} from '../../store/usuarioSlice';
import {
    updateSectorData,
    updateSectorUsuarioHabilidad,
    updateSectorUsuarioEstado,
    updateSectorUsuarioPermisoOperacion,
    updateSectorUsuarioPermisoSupervision,
    updateSectorGrupoEstado,
    updateSectorGrupoHabilidad,
    updateSector,
    updateSectorCola,
    updateSectorUsuario,
    addSectorGrupoHabilidad,
    addSectorGrupoEstado,
    addSectorCola,
    addSectorUsuario
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
import { addOrUpdateOperador } from '../../store/realTimeSlice';
import { 
    updateUsuarioEstadoActual
} from '../../store/localSlice';

export const messageHandlers = {

    ping: () => {
        //Do nothing, es solo la respuesta del ping
    },

    usuariologinDB: (dispatch, message) => {
        dispatch(updateUsuarioData(message));
        dispatch(updateUsuarioEstadoActual(1));
    },

    usuariologinsectoresDB: (dispatch, message) => {
        dispatch(updateSectorData(message));
    },

    usuariologingruposDB: (dispatch, message) => {
        dispatch(updateGrupoData(message));
    },

    usuariologinpermisosDB: (dispatch, message) => {
        dispatch(updatePermisosData(message));
    },

    usuariologinestrategiasDB: (dispatch, message) => {
        dispatch(updateEstrategiasData(message));
    },

    usuarioHabilidadesSectorDB: (dispatch, message) => {
        dispatch(updateSectorUsuarioHabilidad(message));
    },

    usuarioHabilidadesUsuarioDB: (dispatch, message) => {
        dispatch(updateUsuarioHabilidad(message));
    },

    usuarioEstadosSectorDB: (dispatch, message) => {
        dispatch(updateSectorUsuarioEstado(message));
    },

    usuarioEstadosUsuarioDB: (dispatch, message) => {
        dispatch(updateUsuarioEstado(message));
    },

    usuarioPermisosOperacionSectorDB: (dispatch, message) => {
        dispatch(updateSectorUsuarioPermisoOperacion(message));
    },

    usuarioPermisosOperacionUsuarioDB: (dispatch, message) => {
        dispatch(updateUsuarioPermisoOperacion(message));
    },

    usuarioPermisosSupervisionSectorDB: (dispatch, message) => {
        dispatch(updateSectorUsuarioPermisoSupervision(message));
    },

    usuarioPermisosSupervisionUsuarioDB: (dispatch, message) => {
        dispatch(updateUsuarioPermisoSupervision(message));
    },

    sectorActualizarDB: (dispatch, message) => {
        dispatch(updateSector(message));
    },

    colaActualizarDB: (dispatch, message) => {
        dispatch(updateSectorCola(message));
    },

    colaAgregarDB: (dispatch, message) => {
        dispatch(addSectorCola(message));
    },

    usuarioActualizarDB: (dispatch, message) => {
        dispatch(updateSectorUsuario(message));
    },

    usuarioAgregarDB: (dispatch, message) => {
        dispatch(addSectorUsuario(message));
    },

    grupoEstadosModificaDB: (dispatch, message) => {
        dispatch(updateSectorGrupoEstado(message));
        dispatch(updateGrupoEstados(message));
    },

    grupoEstadosAgregaDB: (dispatch, message) => {
        dispatch(addSectorGrupoEstado(message));
        dispatch(addGrupoEstados(message));
    },

    grupoHabilidadesModificaDB: (dispatch, message) => {
        dispatch(updateSectorGrupoHabilidad(message));
        dispatch(updateGrupoHabilidades(message));
    },

    grupoHabilidadesAgregaDB: (dispatch, message) => {
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

    operadorRealTimeLIST: (dispatch, message) => {
        dispatch(addOrUpdateOperador(message));
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