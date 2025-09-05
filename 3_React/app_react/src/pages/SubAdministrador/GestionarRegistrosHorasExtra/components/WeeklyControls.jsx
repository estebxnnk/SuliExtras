import React from 'react';
import { Box } from '@mui/material';

const WeeklyControls = ({ usuarios, usuarioSemanaId, setUsuarioSemanaId, fechaInicioSemana, setFechaInicioSemana, fechaSolo, setFechaSolo }) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: { xs: 2, md: 0 } }}>
      <span style={{ fontSize: 12, color: '#666' }}>Vista semanal:</span>
      <select value={usuarioSemanaId} onChange={(e) => setUsuarioSemanaId(e.target.value)} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc' }}>
        <option value="">Seleccione usuario</option>
        {usuarios.map(u => (
          <option key={u.id} value={u.id}>{u.persona?.nombres} {u.persona?.apellidos} - {u.email}</option>
        ))}
      </select>
      <input type="date" value={fechaInicioSemana} onChange={(e) => setFechaInicioSemana(e.target.value)} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc' }} />
      <span style={{ fontSize: 12, color: '#666' }}>o Fecha única:</span>
      <input type="date" value={fechaSolo} onChange={(e) => setFechaSolo(e.target.value)} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc' }} />
    </Box>
  );
};

export default WeeklyControls;


