import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Importa useSelector y useDispatch
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { Invitation, Inviter, Referral, Registerer, Session, SessionState, UserAgent } from 'sip.js';
import { updateExtensionConnectionStatus } from '../../store/localSlice'; // Importa la acción


const WebRTCContext = createContext();

export const useWebRTC = () => useContext(WebRTCContext);

export const WebRTCProvider = ({ children }) => {
  const dispatch = useDispatch(); // Crea el dispatch para actualizar el estado
  const usuarioExtension = useSelector((state) => state.storeUsuario.usuarioExtension);
  const {extensionUri, extensionServer, extensionDominio, extensionUsername, extensionPassword} = usuarioExtension;

  const [session, setSession] = useState(null); // Mantendra el estado de session de la llamada
  const [incomingSession, setIncomingSession] = useState(null);
  const [open, setOpen] = useState(false); // Para el diálogo de llamadas entrantes

  const userAgenteRef = useRef(null); // Usar useRef para mantener la referencia del UserAgent

  useEffect(() => {

    // Conectar automáticamente al cargar el contexto
    const connect = () => {
      const uri = extensionUri;
      const server = extensionServer;

      const agente = new UserAgent({
        uri: UserAgent.makeURI(uri),
        transportOptions: {
          server,
          traceSip: true,
        },
        authorizationUsername: extensionUsername,
        authorizationPassword: extensionPassword,
        logLevel: 'warn', // Nivel de verbosidad
        sessionDescriptionHandlerFactoryOptions: {
          constraints: {
            audio: true,
            video: false
          },
          sipExtension100rel: 'required', // Extensión SIP 100rel
          keepAliveInterval: 60, // Intervalo de keep-alive en segundos
        },
      });

      // Asignar userAgente a la referencia
      userAgenteRef.current = agente;

      agente.start()
        .then(() => {

          const registro = new Registerer(agente);

          // Registro el User Agent
          registro.register();

          // Monitoreo el estado del registro
          registro.stateChange.addListener((newState) => {
            console.log("El nuevo estado del User Agent es: ", newState)
            switch (newState) {
              case 'Registered':
                dispatch(updateExtensionConnectionStatus(1)); // Actualiza en Redux
                break;
              case 'Unregistered':
                dispatch(updateExtensionConnectionStatus(0)); // Actualiza en Redux
                break;
              default:
                console.log("NO MAPEADO (agent.start) => El estado es: ", newState)
                break;
            }
          });

          // Manejo eventos SIP entrantes
          agente.delegate = {
            onInvite: handleInvite,
          };

          // Inicio envío de keep-alive
          const keepAliveInterval = setInterval(() => {
            agente.transport.sendKeepAlive();
          }, 60000); // Cada 60 segundos

          // Limpio intervalo al desmontar
          return () => clearInterval(keepAliveInterval);
        })
        .catch((error) => console.error('Error al conectar:', error));
      dispatch(updateExtensionConnectionStatus(0)); // Actualiza en Redux si hay un error
    };

    connect();
  }, [extensionUri, extensionServer, extensionUsername, extensionPassword, dispatch]); // Vuelve a conectar si cambian uri o server

  // Manejador para llamadas entrantes
  const handleInvite = (incomingSession) => {
    console.log('Llamada entrante detectada');

    setIncomingSession(incomingSession); // Establecer la sesión entrante

    incomingSession.stateChange.addListener((newState) => {
      switch (newState) {
        case SessionState.Establishing:
          dispatch(updateExtensionConnectionStatus(2)); // Actualiza Redux Llamando
          break;
        case SessionState.Established:
          dispatch(updateExtensionConnectionStatus(3)); // Actualiza Redux Llamada establecida
          configureSession(incomingSession); // Configura la sesión al establecerse la llamda saliente
          break;
        case SessionState.Terminated:
          dispatch(updateExtensionConnectionStatus(1)); // Actualiza Redux Llamada terminada
          break;
        default:
          console.log("NO MAPEADO (Funcion Incoming). El estado de la llamada es: ", newState)
          break;
      }
    });
    setOpen(true); // Mostrar el modal para aceptar o rechazar
  };

  const handleAcceptCall = () => {
    if (incomingSession) {
      incomingSession.accept();
      setSession(incomingSession); // Establecer la sesión activa
    }
    setOpen(false); // Cerrar el diálogo
  };

  const handleRejectCall = () => {
    if (incomingSession) {
      incomingSession.reject();
    }
    setOpen(false); // Cerrar el diálogo
  };

  // Nueva función para iniciar llamadas
  const startCall = (targetUri) => {
    const userAgente = userAgenteRef.current; // Acceder a userAgente desde la referencia

    const target = UserAgent.makeURI(`sip:${targetUri}@${extensionDominio}`);
    if (!target) {
      alert('URI de destino no válida');
      return;
    }

    const inviter = new Inviter(userAgente, target);

    inviter.invite()
      .then(() => {
        //configureSession(inviter);
        inviter.stateChange.addListener((newState) => {
          console.log("La sesion se está haciendo: ", newState)
          setSession(inviter)
          switch (newState) {
            case SessionState.Establishing:
              dispatch(updateExtensionConnectionStatus(2)); // Actualiza Redux Llamando
              break;
            case SessionState.Established:
              dispatch(updateExtensionConnectionStatus(3)); // Actualiza Redux Llamada establecida
              configureSession(inviter); // Configura la sesión al establecerse la llamda saliente
              break;
            case SessionState.Terminated:
              dispatch(updateExtensionConnectionStatus(1)); // Actualiza Redux Llamada terminada
              break;
            default:
              console.log("NO MAPEADO (Funcion Inviter). El estado de la llamada es: ", newState)
              break;
          }
        });
      })
      .catch((error) => console.error('Error al iniciar llamada:', error));
  };

  // Función para colgar la llamada
  const handleHangup = () => {
    console.log("HANGUP, el session state es: ", session.state)
    switch (session.state) {
      case "Established":
        console.log("La session está establecida, se hara bye")
        session.bye()
        break;
      default:
        console.log("NO MAPEADO (Funcion HANGUP). El estado de la session es: ", session.state)
        break;
    }
  };

  const configureSession = (session) => {
    let audioElement = document.getElementById('remoteAudio');
    const remoteStream = new MediaStream();

    session.sessionDescriptionHandler.peerConnection.getReceivers().forEach((receiver) => {
      if (receiver.track) {
        remoteStream.addTrack(receiver.track);
      }
    })
    audioElement.srcObject = remoteStream;
    audioElement.play();
  };

  return (
    <WebRTCContext.Provider
      value={{
        startCall,
        handleHangup,
      }}
    >
      {children}
      {/* Diálogo para llamadas entrantes */}
      <Dialog open={open} onClose={handleRejectCall}>
        <DialogTitle>Llamada Entrante</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Está entrando una llamada. ¿Deseas atenderla?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRejectCall} color="error" variant="contained">
            Rechazar
          </Button>
          <Button onClick={handleAcceptCall} color="primary" variant="contained" autoFocus>
            Atender
          </Button>
        </DialogActions>
      </Dialog>
      {/* Componente de audio */}
      <audio id="remoteAudio" autoPlay style={{ display: 'none' }}></audio>
    </WebRTCContext.Provider>
  );
};