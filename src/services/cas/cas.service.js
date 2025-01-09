import { useState } from 'react';
import axios from 'axios';

const useCasService = () => {
  const [urlMx, setUrlMx] = useState('http://localhost:8080');
  const [collectionSize, setCollectionSize] = useState(0);
  const [page, setPage] = useState(1);
  const [dataMomento, setDataMomento] = useState([]);
  const [match, setMatch] = useState(false);

  // Encabezados HTTP
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
  };

  // Función para login con ticket
  const login = async (ticket) => {
    try {
      const response = await axios.post(`${urlMx}/login`, { ticket }, { headers });
      return response;
      
    } catch (error) {
      console.error('Error during CAS login:', error);
      throw error;
    }
  };

  // Función para logout
  const logout = async () => {
    try {
      const response = await axios.get(`${urlMx}/url`, {
        headers,
        responseType: 'text',
      });
      return response.data;
    } catch (error) {
      console.error('Error during CAS logout:', error);
      throw error;
    }
  };

  return {
    login,
    logout,
    collectionSize,
    page,
    dataMomento,
    match,
    setCollectionSize,
    setPage,
    setDataMomento,
    setMatch,
  };
};

export default useCasService;