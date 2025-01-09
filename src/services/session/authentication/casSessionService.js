const casSessionService = () => {

  const storeCasToken = (casToken) => {
    sessionStorage.setItem('casToken', casToken);
  };

  const storeCasUsuario = (casUsuario) => {
    sessionStorage.setItem('casUsuario', casUsuario);
  };

  const storeCasRol = (casRol) => {
    sessionStorage.setItem('casRol', casRol);
  };

  const getCasToken = () => {
    return sessionStorage.getItem('casToken');
  };

  const getCasUsuario = () => {
    return sessionStorage.getItem('casUsuario');
  };

  const getCasRol = () => {
    return sessionStorage.getItem('casRol');
  };

  const clearCasAuthentication = () => {
    sessionStorage.removeItem('casToken');
    sessionStorage.removeItem('casUsuario');
    sessionStorage.removeItem('casRol');
  }

  return {
    storeCasToken,
    storeCasUsuario,
    storeCasRol,
    getCasToken,
    getCasUsuario,
    getCasRol,
    clearCasAuthentication,
  };
};

export default casSessionService;