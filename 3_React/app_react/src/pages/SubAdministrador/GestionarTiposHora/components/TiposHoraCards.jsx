import React from 'react';
import { Grid, Box, Typography, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TipoHoraCard from './TipoHoraCard';

function TiposHoraCards({ data, onView, onEdit, onDelete }) {
  return (
    <Grid container spacing={3} justifyContent="center" sx={{ mt: 1 }}>
      {data.map((row) => (
        <Grid key={row.id || row.tipo} item xs={12} sm={6} md={6} lg={4} xl={3}>
          <Box
            sx={{
              p: 2.25,
              borderRadius: 3,
              background: 'rgba(255,255,255,0.9)',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 10px 26px rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              height: '100%',
              minHeight: 160
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <TipoHoraCard tipo={row.tipo} denominacion={row.denominacion} valor={row.valor} />
            </Box>

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 'auto' }}>
              <Tooltip title="Ver">
                <IconButton onClick={() => onView?.(row)} sx={{ color: 'success.main' }}>
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Editar">
                <IconButton onClick={() => onEdit?.(row)} sx={{ color: 'primary.main' }}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar">
                <IconButton onClick={() => onDelete?.(row)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Grid>
      ))}

      {data.length === 0 && (
        <Grid item xs={12}>
          <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
            <Typography>No hay tipos de hora registrados.</Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  );
}

export default TiposHoraCards;


