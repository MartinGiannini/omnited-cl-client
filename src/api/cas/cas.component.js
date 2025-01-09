import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { casLoginSuccess, casLogoutSuccess } from '../../store/casSlice';
import { jwtDecode } from 'jwt-decode';
import casSessionService from '../../services/session/authentication/casSessionService';
import useCasService from '../../services/cas/cas.service';

const CasComponent = () => {
  const dispatch = useDispatch();

  const { getCasUsuario, getCasToken, storeCasToken, storeCasUsuario, storeCasRol, getCasRol, clearCasAuthentication } = casSessionService();
  const { login, logout } = useCasService();

  const token = getCasToken();
  const usuario = getCasUsuario();

  useEffect(() => {
    let params = new URLSearchParams(window.location.search);
    let ticket = params.get('ticket');

    if (!token && !usuario) {
      login(ticket)

        .then((response) => {

          const decoded = jwtDecode(response.data.token);

          storeCasUsuario(JSON.stringify(decoded['sub']).replace(/['"]+/g, ''));
          storeCasRol(JSON.stringify(decoded['role']).replace(/['"]+/g, ''));
          storeCasToken(response.data.token);

          dispatch(casLoginSuccess({
            casUsuario: decoded['sub'],
            casToken: response.data.token,
            casRol: decoded['role'].replace(/['"]+/g, ''),
          }));
        })
        .catch((err) => {
          console.error('ERROR: ', err);
          logout()
            .then((response) => {
              clearCasAuthentication();
              dispatch(casLogoutSuccess());
              window.location.href = response;
            })
            .catch((err) => {
              console.error('ERROR: ', err);
            });
        });
    } else {
      console.log('Usuario Logueado! Token correcto!');
            
      dispatch(casLoginSuccess({
        casUsuario: getCasUsuario().replace(/['"]+/g, ''),
        casToken: getCasToken(),
        casRol: getCasRol(),
      }));
    }
  }, []);
};

export default CasComponent;