// src/pages/component-overview/boteditor/nodes/NodoInVariable.jsx

import React, { useContext } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { VariablesContext } from '../VariablesContext';

export default function NodoInVariable({ id, data, selected }) {
  const { setNodes } = useReactFlow();
  const variables = useContext(VariablesContext); // arreglo de strings

  // data.selectedVar (string) y data.text (string)
  const selectedVar = data.selectedVar || '';
  const textValue = data.text || '';
  const numeroIntentos = data.numeroIntentos ?? 1;

  const patchData = (partial) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? { ...n, data: { ...n.data, ...partial } }
          : n
      )
    );
  };

  const onVarChange = (e) => {
    patchData({ selectedVar: e.target.value });
  };

  const onTextChange = (e) => {
    patchData({ text: e.target.value });
  };

  const onAttemptsChange = (e) => {
    const val = Number(e.target.value);
    patchData({ numeroIntentos: val });
  };

  return (
    <div className={`node invar-node ${selected ? 'selected' : ''}`}>
      {/* Handle de entrada */}
      <Handle type="target" position={Position.Top} />

      {/* Etiqueta del nodo */}
      <strong style={{ display: 'block', textAlign: 'center', marginBottom: 6 }}>
        NodoInVariable
      </strong>

      {/* Select de variable */}
      {selected ? (
        <div style={{ marginBottom: 8 }}>
          <label
            htmlFor={`select-var-${id}`}
            style={{ display: 'block', fontSize: 10, marginBottom: 4 }}
          >
            Variable
          </label>
          <select
            id={`select-var-${id}`}
            value={selectedVar}
            onChange={onVarChange}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              padding: '4px',
              fontSize: 12,
              borderRadius: 4,
              border: '1px solid #d1d5db',
              background: '#fff',
              boxSizing: 'border-box',
              marginBottom: 8,
            }}
          >
            <option value="">-- Seleccionar --</option>
            {variables.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div style={{ fontSize: 12, marginBottom: 8 }}>
          {selectedVar ? <em>{selectedVar}</em> : <span style={{ color: '#6b7280' }}>– Sin variable –</span>}
        </div>
      )}

      {/* Textarea para texto */}
      {selected ? (
        <textarea
          className="node-content"
          rows={4}
          value={textValue}
          onChange={onTextChange}
          onPointerDown={(e) => e.stopPropagation()}
          placeholder="Escribe aquí..."
          style={{
            width: '100%',
            fontSize: 12,
            borderRadius: 4,
            border: '1px solid #d1d5db',
            padding: '4px',
            boxSizing: 'border-box',
            resize: 'vertical',
            marginBottom: 8,
          }}
        />
      ) : (
        <div style={{ fontSize: 12, whiteSpace: 'pre-wrap', marginBottom: 8 }}>
          {textValue || <span style={{ color: '#6b7280' }}>– Sin texto –</span>}
        </div>
      )}

      {/* “Número de intentos” como select 1–5 */}
      {selected && (
        <div style={{ marginBottom: 6 }}>
          <label
            htmlFor={`intentos-var-${id}`}
            style={{ display: 'block', fontSize: 10, marginBottom: 4 }}
          >
            Número de intentos
          </label>
          <select
            id={`intentos-var-${id}`}
            value={numeroIntentos}
            onChange={onAttemptsChange}
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
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>
      )}

      {!selected && (
        <div style={{ fontSize: 10, color: '#6b7280', marginBottom: 8 }}>
          Intentos: {numeroIntentos}
        </div>
      )}

      {/* Handle de salida */}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}