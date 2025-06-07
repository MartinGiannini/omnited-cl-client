// src/pages/component-overview/boteditor/nodes/NodoIn.jsx

import React, { useContext } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { VariablesContext } from '../VariablesContext';
import { Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function NodoIn({ id, data, selected }) {
  const { setNodes, getNodes, getEdges } = useReactFlow();
  const variables = useContext(VariablesContext); // arreglo de strings

  // Nos aseguramos de que data.selectedVars exista como arreglo
  const selectedVars = Array.isArray(data.selectedVars)
    ? data.selectedVars
    : [];

  // data.numeroIntentos, valor por defecto 1
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

  // Cuando el modo cambia, reiniciamos selectedVars si pasa a Texto
  const onModeChange = (e) => {
    const nuevoModo = e.target.value;
    if (nuevoModo === 'Texto') {
      patchData({ mode: 'Texto', selectedVars: [], dtype: 'String' });
    } else {
      patchData({ mode: 'Opciones', selectedVars: [''], dtype: 'Integer' });
    }
  };

  // Cambia el valor de una línea (select) en index
  const handleVarChange = (index) => (e) => {
    const nuevaVar = e.target.value;
    const nuevos = [...selectedVars];
    nuevos[index] = nuevaVar;
    patchData({ selectedVars: nuevos });
  };

  // Agrega un nuevo select vacío al final
  const handleAddSelect = () => {
    patchData({ selectedVars: [...selectedVars, ''] });
  };

  // Cambia el número de intentos (1–5)
  const handleAttemptsChange = (e) => {
    const val = Number(e.target.value);
    patchData({ numeroIntentos: val });
  };

  return (
    <div className={`node in-node ${selected ? 'selected' : ''}`}>
      {/* Handle de entrada */}
      <Handle type="target" position={Position.Top} />

      {/* Etiqueta del nodo */}
      <strong style={{ display: 'block', textAlign: 'center', marginBottom: 4 }}>
        NodoIn
      </strong>

      {/* Selector nativo de Modo */}
      {selected && (
        <div style={{ marginBottom: 8 }}>
          <label
            htmlFor={`mode-${id}`}
            style={{
              display: 'block',
              fontSize: 10,
              marginBottom: 4,
            }}
          >
            Modo
          </label>
          <select
            id={`mode-${id}`}
            value={data.mode}
            onChange={onModeChange}
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
            <option value="Opciones">Opciones</option>
            <option value="Texto">Texto</option>
          </select>
        </div>
      )}

      {/* Modo “Opciones”: mostramos selects para variables */}
      {data.mode === 'Opciones' && (
        <Box>
          {selectedVars.map((varName, idx) => {
            // Filtrar las opciones disponibles para este select:
            // permitimos la propia variable (varName) y todas las que no estén en selectedVars
            const opciones = variables.filter(
              (v) => v === varName || !selectedVars.includes(v)
            );

            return (
              <Box key={idx} sx={{ mb: 1 }}>
                <label
                  htmlFor={`var-${id}-${idx}`}
                  style={{ fontSize: 10, display: 'block', marginBottom: 4 }}
                >
                  Variable #{idx + 1}
                </label>
                <select
                  id={`var-${id}-${idx}`}
                  value={varName}
                  onChange={handleVarChange(idx)}
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
                  {opciones.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </Box>
            );
          })}

          {/* Botón “+” para agregar otro select */}
          {selected && (
            <IconButton size="small" onClick={handleAddSelect} sx={{ mt: 0.5 }}>
              <AddIcon fontSize="small" />
            </IconButton>
          )}

          {/* Mostrar lista cuando NO está seleccionado */}
          {/*
          {!selected && (
            <div style={{ fontSize: 12, whiteSpace: 'pre-wrap' }}>
              {selectedVars.filter((v) => v).length > 0
                ? selectedVars.filter((v) => v).join('\n')
                : '- Sin variables -'}
            </div>
          )}
          */}
        </Box>
      )}

      {/* Modo “Texto”: solo indicamos que espera texto */}
      {data.mode === 'Texto' && (
        <div style={{ marginTop: 4, fontSize: 12, color: '#6b7280' }}>
          {selected
            ? 'Este nodo espera un texto; no ingrese variables'
            : 'Texto libre'}
        </div>
      )}

      {/* “Número de intentos” como select 1–5 al final del nodo */}
      {selected && (
        <div style={{ marginTop: 8, marginBottom: 8 }}>
          <label
            htmlFor={`intentos-${id}`}
            style={{ display: 'block', fontSize: 10, marginBottom: 4 }}
          >
            Número de intentos
          </label>
          <select
            id={`intentos-${id}`}
            value={numeroIntentos}
            onChange={handleAttemptsChange}
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

      {/* Handle de salida “OK” (izquierda) */}
      <Handle
        id="ok"
        type="source"
        position={Position.Left}
        style={{ top: '50%', background: '#60a5fa' }}
      />
      <div
        style={{
          position: 'absolute',
          left: -36,
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 10,
          color: '#2563eb',
        }}
      >
        OK
      </div>

      {/* En modo “Opciones” mostramos el Handle “ERROR” */}
      {data.mode === 'Opciones' && (
        <>
          <Handle
            id="error"
            type="source"
            position={Position.Right}
            style={{ top: '50%', background: '#f87171' }}
          />
          <div
            style={{
              position: 'absolute',
              right: -42,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 10,
              color: '#b91c1c',
            }}
          >
            ERROR
          </div>
        </>
      )}
    </div>
  );
}