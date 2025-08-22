import React from 'react';
import { Box } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { TableUniversal } from '../../../../components';
import TipoHoraCard from './TipoHoraCard';

function TiposHoraTable({ data, onView, onEdit, onDelete }) {
  return (
    <Box>
      <TableUniversal
        data={data}
        columns={[
          { id: 'tipo', label: 'Tipo', render: (_, row) => (
            <TipoHoraCard tipo={row.tipo} denominacion={row.denominacion} valor={row.valor} />
          ) },
          { id: 'denominacion', label: 'Denominación' },
          { id: 'valor', label: 'Valor' },
          { id: 'recargo', label: 'Recargo', render: (_, row) => {
            const valor = Number(row.valor);
            const color = valor > 1.5 ? '#ff9800' : valor > 1.25 ? '#2196f3' : '#4caf50';
            return (
              <Box sx={{ display: 'inline-block', px: 2, py: 0.5, borderRadius: 2, background: color, color: 'white', fontWeight: 700 }}>
                {((valor - 1) * 100).toFixed(0)}%
              </Box>
            );
          } }
        ]}
        title="Tipos de Hora"
        subtitle={`Mostrando ${data.length} tipos`}
        icon={AccessTimeIcon}
        iconColor="#1976d2"
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </Box>
  );
}

export default TiposHoraTable;


