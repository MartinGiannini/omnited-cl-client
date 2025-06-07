// src/pages/component-overview/boteditor/nodeTypes.js

import NodoOut from './nodes/NodoOut';
import NodoIn from './nodes/NodoIn';
import Condicion from './nodes/Condicion';
import Derivar from './nodes/Derivar';
import Servicio from './nodes/Servicio';
import NodoInVariable from './nodes/NodoInVariable';
import { v4 as uuid } from 'uuid';

export const NODE_TYPES = {
  out: NodoOut,
  in: NodoIn,
  cond: Condicion,
  drv: Derivar,
  svc: Servicio,
  inVar: NodoInVariable, // <— nueva clave
};

export function createDefaultNode(type, position) {
  const base = { id: uuid(), type, position };

  switch (type) {
    case 'out':
      return { ...base, data: { text: 'Mensaje…' } };

    case 'in':
      return {
        ...base,
        data: {
          mode: 'Opciones',
          dtype: 'Integer',
          selectedVars: [''], // inicializamos un select vacío
          text: '',
        },
      };

    case 'inVar':
      return {
        ...base,
        data: {
          selectedVar: '',
          text: '',
          numeroIntentos: 1,   // ← inicializamos en 1
        },
      };

    case 'drv':
      return { ...base, data: { primary: null, secondary: null } };

    case 'svc':
      return {
        ...base,
        data: { url: 'https://api.ejemplo.com', method: 'GET' },
      };

    case 'cond':
    default:
      return { ...base, data: {} };
  }
}