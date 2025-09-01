import React, { useMemo } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ListAltIcon from '@mui/icons-material/ListAlt';

const RegistrosUsuarioDialog = ({
  open,
  onClose,
  usuario,
  registros,
  loading,
  filtros,
  onChangeFiltro
}) => {
  const ubicaciones = useMemo(() => {
    const setU = new Set((registros || []).map(r => r.ubicacion).filter(Boolean));
    return Array.from(setU).sort();
  }, [registros]);

  const registrosFiltrados = useMemo(() => {
    return (registros || []).filter(reg => {
      const ubicMatch = filtros.ubicacion === 'todos' || reg.ubicacion === filtros.ubicacion;
      const fechaOk = (() => {
        if (!filtros.fechaInicio && !filtros.fechaFin) return true;
        const d = reg.fecha ? new Date(reg.fecha) : null;
        if (!d) return false;
        const startOk = !filtros.fechaInicio || d >= new Date(filtros.fechaInicio);
        const endOk = !filtros.fechaFin || d <= new Date(filtros.fechaFin);
        return startOk && endOk;
      })();
      const tipoOk = (() => {
        if (filtros.tipoHora === 'todos') return true;
        if (!Array.isArray(reg.Horas)) return true;
        return reg.Horas.some(h => String(h.id ?? h.tipoHoraId) === String(filtros.tipoHora));
      })();
      return ubicMatch && fechaOk && tipoOk;
    });
  }, [registros, filtros]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, background: 'linear-gradient(135deg, #388e3c, #2e7d32)', color: 'white' }}>
        <ListAltIcon />
        Registros de Horas Extra
        <IconButton onClick={onClose} sx={{ ml: 'auto', color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3, maxHeight: '80vh', overflow: 'auto' }}>
        <Box sx={{ mb: 2, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Tipo de Hora</Typography>
            <select value={filtros.tipoHora} onChange={(e) => onChangeFiltro('tipoHora', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #e0e0e0' }}>
              <option value="todos">Todos</option>
              {(filtros.tiposHora || []).map(t => (
                <option key={t.id} value={t.id}>{t.tipo} {t.denominacion ? `- ${t.denominacion}` : ''}</option>
              ))}
            </select>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Ubicación</Typography>
            <select value={filtros.ubicacion} onChange={(e) => onChangeFiltro('ubicacion', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #e0e0e0' }}>
              <option value="todos">Todas</option>
              {ubicaciones.map(u => (<option key={u} value={u}>{u}</option>))}
            </select>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Fecha inicio</Typography>
            <input type="date" value={filtros.fechaInicio} onChange={(e) => onChangeFiltro('fechaInicio', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #e0e0e0' }} />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Fecha fin</Typography>
            <input type="date" value={filtros.fechaFin} onChange={(e) => onChangeFiltro('fechaFin', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #e0e0e0' }} />
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">Cargando registros...</Typography>
          </Box>
        ) : (
          <>
            {usuario && (
              <Box sx={{ mb: 3, p: 2, background: 'rgba(56, 142, 60, 0.1)', borderRadius: 2, border: '1px solid rgba(56, 142, 60, 0.2)' }}>
                <Typography variant="h6" fontWeight={600} color="#388e3c">{usuario.persona?.nombres} {usuario.persona?.apellidos}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Email:</strong> {usuario.email}</Typography>
              </Box>
            )}

            {registrosFiltrados.length > 0 ? (
              <Box sx={{ background: '#f8f9fa', borderRadius: 2, overflow: 'hidden', border: '1px solid #dee2e6' }}>
                <Box sx={{ p: 2, background: 'linear-gradient(135deg, #388e3c, #2e7d32)', color: 'white' }}>
                  <Typography variant="subtitle1" fontWeight={600}>Registros de Horas Extra ({registrosFiltrados.length})</Typography>
                </Box>
                <Box sx={{ maxHeight: 500, overflow: 'auto', p: 2 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
                    {registrosFiltrados.map(registro => (
                      <Box key={registro.id} sx={{ p: 2, background: 'white', borderRadius: 1, border: '1px solid #dee2e6', '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.1)' } }}>
                        <Typography variant="subtitle2" fontWeight={600} color="#388e3c" sx={{ mb: 1 }}>{registro.fecha}</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1 }}>
                          <Typography variant="body2"><strong>Horario:</strong> {registro.horaIngreso} - {registro.horaSalida}</Typography>
                          <Typography variant="body2"><strong>Ubicación:</strong> {registro.ubicacion}</Typography>
                          <Typography variant="body2"><strong>Horas Extra:</strong> {registro.cantidadHorasExtra}</Typography>
                          <Typography variant="body2"><strong>Estado:</strong> {registro.estado}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>No hay registros de horas extra para este usuario</Typography>
                {usuario && (
                  <Typography variant="body2" color="text.secondary">Usuario: <strong>{usuario.persona?.nombres} {usuario.persona?.apellidos}</strong> ({usuario.email})</Typography>
                )}
              </Box>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RegistrosUsuarioDialog;


