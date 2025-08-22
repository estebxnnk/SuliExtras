import React from 'react';
import { Box, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

function TipoHoraCard({ tipo, denominacion, valor }) {
  const valorNumber = Number(valor);
  const recargoPct = isFinite(valorNumber) ? Math.round((valorNumber - 1) * 100) : 0;
  const recargoColor = valorNumber > 1.5 ? '#ff9800' : valorNumber > 1.25 ? '#2196f3' : '#4caf50';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 1.5,
        py: 1,
        borderRadius: 2,
        background: 'linear-gradient(135deg, rgba(25,118,210,0.06) 0%, rgba(25,118,210,0.02) 100%)',
        border: '1px solid rgba(25,118,210,0.25)',
        boxShadow: '0 4px 12px rgba(25,118,210,0.12)',
        transition: 'transform .15s ease, box-shadow .2s ease, background .2s',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 8px 18px rgba(25,118,210,0.18)',
          background: 'linear-gradient(135deg, rgba(25,118,210,0.08) 0%, rgba(25,118,210,0.04) 100%)'
        }
      }}
    >
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 16px rgba(25,118,210,0.35)'
        }}
      >
        <AccessTimeIcon sx={{ color: '#fff', fontSize: 18 }} />
      </Box>

      <Box sx={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body1" fontWeight={800} sx={{ lineHeight: 1.1 }}>
            {tipo}
          </Typography>
          {denominacion && (
            <Typography variant="caption" color="text.secondary" noWrap>
              {denominacion}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            ml: 1,
            display: 'inline-block',
            px: 1,
            py: 0.25,
            borderRadius: 1.5,
            fontSize: 12,
            fontWeight: 800,
            color: '#fff',
            background: `linear-gradient(135deg, ${recargoColor} 0%, ${recargoColor}cc 100%)`,
            boxShadow: `0 6px 16px ${recargoColor}44`,
            whiteSpace: 'nowrap'
          }}
          title={`Recargo ${recargoPct}%`}
        >
          {recargoPct}%
        </Box>
      </Box>
    </Box>
  );
}

export default TipoHoraCard;


