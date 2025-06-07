// src/pages/component-overview/BotEditor.jsx

import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ReactFlowProvider } from '@xyflow/react';
import Sidebar from './boteditor/Sidebar';
import FlowCanvas from './boteditor/FlowCanvas';
import { sendMessageThroughWebSocket } from '../../services/backend/Conexion';
import { VariablesContext } from './boteditor/VariablesContext';
import './boteditor/boteditor.css';

export default function BotEditor() {
  const saveRef = useRef(null);
  const loadRef = useRef(null);

  const bots = useSelector((state) => state.storeBotWhatsApp || []);
  const usuario = useSelector((state) => state.storeUsuario || []);

  const [botSel, setBotSel] = useState('');
  const [currentId, setCurrentId] = useState(null);
  const [botName, setBotName] = useState('');
  const [botNameOriginal, setBotNameOriginal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [variablesText, setVariablesText] = useState('');

  // Cada línea representa una variable; formamos un array de strings
  const variablesArray = variablesText
    .split('\n')
    .map((v) => v.trim())
    .filter((v) => v.length);

  const handleSave = () => {
    const flow = saveRef.current?.();
    if (!flow) return alert('Nada para guardar');
    if (!botName.trim()) return alert('Ponle un nombre al bot');
    if (!/^[\w\-\s]{3,50}$/.test(botName.trim())) {
      return alert(
        'El nombre sólo puede tener letras, números, guiones y espacios (3–50 caracteres).'
      );
    }

    // ───── VALIDACIONES ANTES DE PRE-PROCESAR ─────

    // Recorremos cada nodo del flow para chequear NodoIn
    for (const n of flow.nodes) {
      if (n.type === 'in' && n.data.mode === 'Opciones') {
        // 1) Cuenta cuántas variables definió el usuario
        const varsCount = Array.isArray(n.data.selectedVars)
          ? n.data.selectedVars.filter((v) => v).length
          : 0;

        // 2) Cuenta cuántos enlaces salientes desde handle "ok"
        //    (en flow.edges, filtramos por source === n.id y sourceHandle === "ok")
        const outgoingOk = flow.edges.filter(
          (e) => e.source === n.id && e.sourceHandle === 'ok'
        ).length;

        // Validación A: Debe haber al menos una variable
        if (varsCount === 0) {
          return alert(
            `❌ NodoIn "${n.id}" debe definir al menos una variable.`
          );
        }

        // Validación B: El número de enlaces OK debe coincidir con varsCount
        if (outgoingOk !== varsCount) {
          return alert(
            `❌ NodoIn "${n.id}" tiene ${varsCount} variable(s) pero ${outgoingOk} vínculo(s) OK. Deben coincidir.`
          );
        }
      }
    }

    // ───── PRE-PROCESAR NodoIn (Construir optionsList, etc.) ─────
    const flowClean = {
      ...flow,
      nodes: flow.nodes.map((n) => {
        if (n.type !== 'in') return n;

        // Si es modo "Texto", no hay lista de opciones
        if (n.data.mode === 'Texto') {
          return {
            ...n,
            data: {
              ...n.data,
              optionsList: [],
            },
          };
        }

        // Para NodoInVariable, mantenés selectedVar, text y numeroIntentos tal cual
        if (n.type === 'inVar') {
          return {
            ...n,
            data: {
              selectedVar: n.data.selectedVar,
              text: n.data.text,
              numeroIntentos: n.data.numeroIntentos,
            },
          };
        }

        // En modo "Opciones", transformamos selectedVars [{id,nombre}]
        const lines = Array.isArray(n.data.selectedVars)
          ? n.data.selectedVars.filter((v) => v)
          : [];
        const list = lines.map((txt, i) => ({ id: i + 1, text: txt }));

        return {
          ...n,
          data: {
            ...n.data,
            optionsList: list,
          },
        };
      }),
    };

    // ───── VALIDAR NODO RAÍZ ─────
    const { nodes, edges } = flow;
    if (!nodes?.length) return alert('El diagrama está vacío');

    // ─── NUEVO: asegurar que no haya nodos sin conexiones (sueltos) ───
    const unlinked = nodes.filter(
      (n) => !edges.some((e) => e.source === n.id || e.target === n.id)
    );
    if (unlinked.length) {
      return alert(
        '❌ Hay nodos sin vincular: ' +
        unlinked.map((n) => n.type.toUpperCase()).join(', ') +
        '. Conéctalos antes de guardar.'
      );
    }

    // ── Construimos objeto ingreso, incluyendo las variables
    const variablesObjects = variablesArray.map((nombreVar, idx) => ({
      id: idx + 1,
      nombre: nombreVar,
    }));

    const ingreso = {
      botWhatsAppNombre: botName.trim(),
      botWhatsAppPayload: flowClean,
      botWhatsAppVariables: variablesObjects,
      usuario,
    };

    let messageType;
    if (currentId === null || botNameOriginal !== botName) {
      messageType = 'botWhatsAppNuevoWS';
    } else {
      messageType = 'botWhatsAppActualizarWS';
      // ingreso.idBot = currentId; 
    }
    
    sendMessageThroughWebSocket(messageType, { ingresoDatos: ingreso }, (error) => {
      if (error) {
        alert('Error al guardar: ' + error.message);
      }
    });
    
  };

  const handleLoad = () => {
    if (!botSel) return;
    const bot = Object.values(bots).find((b) => b.idBotWhatsApp === botSel);
    if (!bot) return;
    setIsLoading(true);
    try {
      const flow = JSON.parse(bot.botWhatsAppPayload); // ajusta según campo real
      loadRef.current?.(flow);
      setCurrentId(bot.idBotWhatsApp);
      setBotName(bot.botWhatsAppNombre);
      setBotNameOriginal(bot.botWhatsAppNombre);

      // ── Cargar variables; primero JSON.parse de la cadena (o array ya en JS)
      let varsArray = [];
      if (bot.botWhatsAppVariables) {
        // Si viene como string JSON, parseamos; si ya es array, lo usamos directamente
        if (typeof bot.botWhatsAppVariables === 'string') {
          try {
            varsArray = JSON.parse(bot.botWhatsAppVariables);
          } catch {
            varsArray = [];
          }
        } else if (Array.isArray(bot.botWhatsAppVariables)) {
          varsArray = bot.botWhatsAppVariables;
        }
      }
      // Ahora varsArray es algo como [{id:1,nombre:"aa"}, {id:2,nombre:"bb"}, …]
      // Extraemos sólo los nombres para mostrar en el TextField multiline
      const nombresSolo = varsArray.map((v) => v.nombre);
      setVariablesText(nombresSolo.join('\n'));

    } catch {
      alert('JSON corrupto');
    } finally {
      setIsLoading(false);
    }
  };

  const newBot = () => {
    if (
      window.confirm(
        '¿Descartar cambios sin guardar? Se perderán las modificaciones actuales.'
      ) === false
    )
      return;

    setCurrentId(null);
    setBotName('');
    setBotSel('');
    loadRef.current?.({
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    });
    // Al crear un nuevo bot, limpiamos el listado de variables
    setVariablesText('');
  };

  return (
    <VariablesContext.Provider value={variablesArray}>
      <ReactFlowProvider>
        <div className="bot-builder-layout">
          <Sidebar
            bots={bots}
            botSel={botSel}
            onBotSelect={setBotSel}
            onLoad={handleLoad}
            onSave={handleSave}
            onNew={newBot}
            botName={botName}
            onChangeName={setBotName}
            isLoading={isLoading}
            variablesText={variablesText}
            onChangeVariablesText={setVariablesText}
          />
          <FlowCanvas
            registerSave={(fn) => (saveRef.current = fn)}
            registerLoad={(fn) => (loadRef.current = fn)}
          />
        </div>
      </ReactFlowProvider>
    </VariablesContext.Provider>
  );
}