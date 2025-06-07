// src/pages/component-overview/boteditor/nodes/Servicio.jsx

import React from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';

export default function Servicio({ id, data, selected }) {
  const { setNodes } = useReactFlow();

  const patch = (partial) =>
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? { ...n, data: { ...n.data, ...partial } }
          : n
      )
    );

  return (
    <div className={`node svc-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} />

      {!selected && (
        <div style={{ fontSize: 12 }}>
          <div>
            <strong>{data.method}</strong> {data.url}
          </div>
        </div>
      )}

      {selected && (
        <>
          <input
            className="node-content"
            value={data.url}
            onChange={(e) => patch({ url: e.target.value })}
            placeholder="https://..."
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              fontSize: 12,
              borderRadius: 4,
              border: '1px solid #d1d5db',
              padding: '4px',
              boxSizing: 'border-box',
              marginBottom: 8,
            }}
          />

          {/* Método HTTP con <select> nativo */}
          <label
            htmlFor={`method-${id}`}
            style={{
              display: 'block',
              fontSize: 10,
              marginBottom: 4,
            }}
          >
            Método
          </label>
          <select
            id={`method-${id}`}
            value={data.method}
            onChange={(e) => patch({ method: e.target.value })}
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
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}