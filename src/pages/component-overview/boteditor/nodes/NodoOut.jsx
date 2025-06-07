// src/pages/component-overview/boteditor/nodes/NodoOut.jsx

import React from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';

export default function NodoOut({ id, data, selected }) {
  const { setNodes } = useReactFlow();

  const update = (val) =>
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? { ...n, data: { text: val } }
          : n
      )
    );

  return (
    <div className={`node out-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} />

      {!selected && (
        <div style={{ fontSize: 12, whiteSpace: 'pre-wrap' }}>{data.text}</div>
      )}

      {selected && (
        <textarea
          className="node-content"
          rows={4}
          value={data.text}
          onChange={(e) => update(e.target.value)}
          onPointerDown={(e) => e.stopPropagation()}
        />
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}