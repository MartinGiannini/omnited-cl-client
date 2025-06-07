// src/pages/component-overview/boteditor/nodes/Condicion.jsx

import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function Condicion({ selected }) {
  return (
    <div className={`node cond-node ${selected ? 'selected' : ''}`}>
      {/* Entrada */}
      <Handle type="target" position={Position.Top} />

      <strong className="cond-text">¿Es correcto?</strong>
      {/* Etiquetas “SI” / “NO” */}
      <div className="cond-labels">
        <span>SI</span>
        <span>NO</span>
      </div>
      {/* Salidas: SI a la izquierda, NO a la derecha */}
      <Handle
        id="true"
        type="source"
        position={Position.Left}
        style={{ top: 'calc(100% - 12px)' }}
      />
      <Handle
        id="false"
        type="source"
        position={Position.Right}
        style={{ top: 'calc(100% - 12px)' }}
      />
    </div>
  );
}