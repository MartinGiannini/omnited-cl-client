// src/pages/component-overview/boteditor/Sidebar.jsx

import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Button, TextField, Typography, Divider, Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import './boteditor.css';

const Item = ({ type, label }) => (
  <div
    className={`sidebar-item ${type}-item`}
    draggable
    onDragStart={(e) => {
      e.dataTransfer.setData('application/reactflow', type);
      e.dataTransfer.effectAllowed = 'move';
    }}
  >
    {label}
  </div>
);

export default function Sidebar({
  bots,
  botSel,
  onBotSelect,
  onLoad,
  onSave,
  onNew,
  botName,
  onChangeName,
  isLoading,
  variablesText,
  onChangeVariablesText,   // ← nueva prop
}) {

  // 1) Transformar el texto completo en un arreglo DE LÍNEAS (sin filtrar nada)
  const variablesLines = variablesText.split('\n');

  // 2) Handler para cambiar el contenido de una línea específica (sin filtrar)
  const handleLineChange = (index) => (e) => {
    const rawLines = [...variablesLines];
    // Filtrar caracteres no permitidos (solo A–Z, a–z, 0–9 y _)
    rawLines[index] = e.target.value.replace(/[^A-Za-z0-9_]/g, '');
    onChangeVariablesText(rawLines.join('\n'));
  };

  // 3) Handler para añadir una nueva línea vacía (sin filtrar)
  const handleAddLine = () => {
    const rawLines = [...variablesLines, ''];
    onChangeVariablesText(rawLines.join('\n'));
  };

  return (
    <aside className="sidebar" onDragOver={(e) => e.preventDefault()}>
      {/* Ítems “arrastrables” para nodos */}
      <Item type="out" label="➕ NodoOut" />
      <Item type="in" label="➕ NodoIn" />
      <Item type="cond" label="➕ Condición" />
      <Item type="drv" label="➕ Derivar" />
      <Item type="svc" label="➕ Servicio" />
      <Item type="inVar" label="➕ NodoIn Link" />

      <hr />

      {/* Botones “Nuevo Bot” y selección de existente */}
      <div className="sidebar-section">
        <Button variant="text" size="small" fullWidth onClick={onNew}>
          Nuevo Bot
        </Button>
      </div>

      <div className="sidebar-section">
        <FormControl size="small" fullWidth>
          <InputLabel>Bot existente</InputLabel>
          <Select
            label="Bot existente"
            value={botSel}
            onChange={(e) => onBotSelect(e.target.value)}
          >
            {Object.values(bots).map((b) => (
              <MenuItem key={b.idBotWhatsApp} value={b.idBotWhatsApp}>
                {b.botWhatsAppNombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          size="small"
          fullWidth
          onClick={onLoad}
          disabled={!botSel || isLoading}
          sx={{ mt: 1 }}
        >
          {isLoading ? 'Cargando…' : 'Cargar'}
        </Button>
      </div>

      <hr />

      {/* Formulario de nombre y botón Guardar */}
      <div className="sidebar-section">
        <TextField
          size="small"
          fullWidth
          label="Bot Actual"
          value={botName}
          onChange={(e) => onChangeName(e.target.value)}
        />

        <Button
          variant="outlined"
          size="small"
          fullWidth
          onClick={onSave}
          disabled={!botName.trim()}
          sx={{ mt: 1 }}
        >
          Guardar
        </Button>
      </div>

      <hr />

      {/* ZONA DE VARIABLES */}
      {/* ZONA DE VARIABLES */}
      <div className="sidebar-section">
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="subtitle2">Variables</Typography>
          <IconButton size="small" onClick={handleAddLine}>
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>

        {variablesLines.map((lineValue, idx) => (
          <Box key={idx}>
            <TextField
              size="small"
              fullWidth
              placeholder={`Variable #${idx + 1}`}
              value={lineValue}
              onChange={handleLineChange(idx)}
              sx={{ mb: 0 }}
            />
            {idx < variablesLines.length - 1 && <Divider sx={{ my: 1 }} />}
          </Box>
        ))}

        {/* Si no hay líneas (variablesText === ''), variablesLines = [''], así mostramos un único campo vacio */}
        {variablesLines.length === 0 && (
          <TextField
            size="small"
            fullWidth
            placeholder="Variable #1"
            value=""
            onChange={(e) => {
              const sanitized = e.target.value.replace(/[^A-Za-z0-9_]/g, '');
              onChangeVariablesText(sanitized);
            }}
          />
        )}
      </div>
    </aside>
  );
}