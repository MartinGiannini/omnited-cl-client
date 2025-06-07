// src/pages/component-overview/boteditor/FlowCanvas.jsx

import React, { useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import { NODE_TYPES, createDefaultNode } from './nodeTypes';
import './boteditor.css';

export default function FlowCanvas({ registerSave, registerLoad }) {
  const wrapper = useRef(null);
  const rfInstance = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  /* ---------- validación de conexiones para NodoIn ---------- */
  const isValidConnection = (connection) => {
    const { source, sourceHandle } = connection;
    const srcNode = nodes.find((n) => n.id === source);
    if (!srcNode) return false;

    // Si no es NodoIn, aplicamos la regla general: cond ≤2, resto ≤1
    if (srcNode.type !== 'in') {
      const outgoingTotal = edges.filter((e) => e.source === source).length;
      return srcNode.type === 'cond' ? outgoingTotal < 2 : outgoingTotal < 1;
    }

    // Si es NodoIn y está en modo "Texto", ambos handles solo permiten 1 salida
    if (srcNode.data.mode === 'Texto') {
      if (sourceHandle === 'ok' || sourceHandle === 'error') {
        const count = edges.filter(
          (e) => e.source === source && e.sourceHandle === sourceHandle
        ).length;
        return count < 1;
      }
      return false;
    }

    // Handle "error": siempre 1 sola salida en modo Opciones
    if (sourceHandle === 'error') {
      const outgoingErr = edges.filter(
        (e) => e.source === source && e.sourceHandle === 'error'
      ).length;
      return outgoingErr < 1;
    }

    // Si es NodoIn, distinguimos entre "ok" (múltiples según variables) y "error" (1)
    const varsCount = Array.isArray(srcNode.data.selectedVars)
      ? srcNode.data.selectedVars.filter((v) => v).length
      : 0;

    // Y luego:
    if (sourceHandle === 'ok') {
      const outgoingOk = edges.filter(
        e => e.source === source && e.sourceHandle === 'ok'
      ).length;
      // Solo se permite conectar mientras outgoingOk < varsCount
      return outgoingOk < varsCount;
    }

    return false;
  };

  const onConnect = useCallback(
    (conn) => {
      if (!isValidConnection(conn)) return;
      const srcNode = nodes.find((n) => n.id === conn.source);
      let newEdge = conn;

      // Si el nodo es de tipo 'cond', aplicamos etiquetas "SI"/"NO"
      if (srcNode?.type === 'cond') {
        const label = conn.sourceHandle === 'true' ? 'SI' : 'NO';
        newEdge = { ...conn, label };
      }

      setEdges((eds) => addEdge(newEdge, eds));
    },
    [edges, nodes]
  );

  /* ---------- Drag & Drop para crear nodos ---------- */
  const onDragOver = useCallback((e) => {
    e.preventDefault();
    if (wrapper.current) wrapper.current.classList.add('drag-over');
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDragLeave = useCallback(() => {
    if (wrapper.current) wrapper.current.classList.remove('drag-over');
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      if (wrapper.current) wrapper.current.classList.remove('drag-over');

      const type = e.dataTransfer.getData('application/reactflow');
      if (!Object.keys(NODE_TYPES).includes(type)) return;

      const bounds = wrapper.current.getBoundingClientRect();
      const project =
        (rfInstance.project && rfInstance.project) ||
        (rfInstance.viewport && rfInstance.viewport.project) ||
        (({ x, y }) => ({ x, y }));
      const position = project({
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      });

      const newNode = createDefaultNode(type, position);
      setNodes((nds) => [...nds, newNode]);
    },
    [rfInstance, setNodes]
  );

  /* ---------- Borrar nodos/edges con tecla Delete ---------- */
  const handleKeyDown = useCallback(
    (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if ((e.key === 'Delete' || e.key === 'Backspace') && rfInstance) {
        const selectedNodes = rfInstance.getNodes().filter((n) => n.selected);
        const selectedEdges = rfInstance.getEdges().filter((ed) => ed.selected);
        rfInstance.deleteElements({ nodes: selectedNodes, edges: selectedEdges });
      }
    },
    [rfInstance]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  /* ---------- Cargar flujo (load) ---------- */
  const loadFlow = useCallback(
    (flow) => {
      if (!flow) return;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      if (flow.viewport) {
        rfInstance.setViewport(flow.viewport);
      }
      setTimeout(() => rfInstance.fitView({ padding: 0.1 }), 100);
    },
    [rfInstance, setNodes, setEdges]
  );

  useEffect(() => {
    registerLoad && registerLoad(loadFlow);
  }, [registerLoad, loadFlow]);

  /* ---------- Guardar referencia (save) ---------- */
  useEffect(() => {
    registerSave && registerSave(() => rfInstance.toObject());
  }, [rfInstance, registerSave]);

  return (
    <div
      ref={wrapper}
      className="canvas-wrapper"
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={NODE_TYPES}
        fitView
        minZoom={0.5}
        maxZoom={2}
      >
        <Background gap={16} color="#e5e7eb" variant="lines" />
        <MiniMap
          nodeStrokeColor={(n) => {
            switch (n.type) {
              case 'in':
                return '#fbbf24';
              case 'out':
                return '#60a5fa';
              case 'cond':
                return '#f59e0b';
              case 'drv':
                return '#2dd4bf';
              case 'svc':
                return '#6366f1';
              default:
                return '#eee';
            }
          }}
          nodeColor={(n) => {
            if (n.type === 'in') return '#fff4e5';
            if (n.type === 'out') return '#e0f2fe';
            if (n.type === 'cond') return '#fefaea';
            if (n.type === 'drv') return '#f0fdfa';
            if (n.type === 'svc') return '#eef2ff';
            return '#fff';
          }}
          nodeBorderRadius={4}
        />
        <Controls />
      </ReactFlow>
    </div>
  );
}