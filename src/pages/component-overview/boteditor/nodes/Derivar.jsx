// src/pages/component-overview/boteditor/nodes/Derivar.jsx

import React from 'react';
import { useSelector } from 'react-redux';
import { Handle, Position, useReactFlow } from '@xyflow/react';

export default function Derivar({ id, data, selected }) {
  const { setNodes } = useReactFlow();
  const habilidades = useSelector((state) => state.storeUsuario.usuarioHabilidad || []);

  const update = (field) => (e) => {
    const val = e.target.value === '' ? null : Number(e.target.value);
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? { ...n, data: { ...n.data, [field]: val } }
          : n
      )
    );
  };

  return (
    <div className={`node drv-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} />

      <div style={{ textAlign: 'center', fontWeight: 500, marginBottom: 8 }}>
        Derivar
      </div>

      {/* Habilidad primaria usando <select> nativo */}
      <div style={{ marginBottom: 8 }}>
        <label
          htmlFor={`primary-${id}`}
          style={{ fontSize: 10, display: 'block', marginBottom: 4 }}
        >
          Habilidad primaria
        </label>
        <select
          id={`primary-${id}`}
          value={data.primary ?? ''}
          onChange={update('primary')}
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            padding: '4px',
            fontSize: 12,
            borderRadius: 4,
            border: '1px solid #d1d5db',
            background: '#fff',
            boxSizing: 'border-box',
          }}
        >
          <option value="">-- Ninguna --</option>
          {habilidades.length === 0 && (
            <option value="" disabled>
              Sin habilidades disponibles
            </option>
          )}
          {habilidades.map((h) => (
            <option key={h.idHabilidad} value={h.idHabilidad}>
              {h.habilidadNombre}
            </option>
          ))}
        </select>
      </div>

      {/* Habilidad secundaria usando <select> nativo */}
      <div style={{ marginBottom: 8 }}>
        <label
          htmlFor={`secondary-${id}`}
          style={{ fontSize: 10, display: 'block', marginBottom: 4 }}
        >
          Habilidad secundaria
        </label>
        <select
          id={`secondary-${id}`}
          value={data.secondary ?? ''}
          onChange={update('secondary')}
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            padding: '4px',
            fontSize: 12,
            borderRadius: 4,
            border: '1px solid #d1d5db',
            background: '#fff',
            boxSizing: 'border-box',
          }}
        >
          <option value="">-- Ninguna --</option>
          {habilidades.length === 0 && (
            <option value="" disabled>
              Sin habilidades disponibles
            </option>
          )}
          {habilidades.map((h) => (
            <option key={h.idHabilidad} value={h.idHabilidad}>
              {h.habilidadNombre}
            </option>
          ))}
        </select>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}