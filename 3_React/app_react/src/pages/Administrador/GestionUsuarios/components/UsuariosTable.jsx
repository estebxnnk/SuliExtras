import React from 'react';
import { Box, Typography } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import PersonIcon from '@mui/icons-material/Person';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import BusinessIcon from '@mui/icons-material/Business';
import { TableUniversal } from '../../../../components';

function UsuariosTable({
  data = [],
  page = 0,
  rowsPerPage = 10,
  totalCount = 0,
  onPageChange,
  onRowsPerPageChange,
  onVer,
  onEditar,
  onEliminar,
  onCambiarRol,
  onCambiarSede,
  isMobile = false
}) {
  const start = totalCount === 0 ? 0 : page * rowsPerPage + 1;
  const end = Math.min((page + 1) * rowsPerPage, totalCount);

  return (
    <TableUniversal
      data={data}
      columns={[
        {
          id: 'usuario',
          label: 'Usuario'
        },
        {
          id: 'documento',
          label: 'Documento', 
        },
        {
          id: 'salario',
          label: 'Salario'
        },
        {
          id: 'sede',
          label: 'Sede'
        },
        {
          id: 'rol',
          label: 'Rol'
        }
      ]}
      page={page}
      rowsPerPage={rowsPerPage}
      totalCount={totalCount}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      onView={(row) => onVer?.(row)}
      onEdit={(row) => onEditar?.(row)}
      onDelete={(row) => onEliminar?.(row)}
      customActions={[
        {
          icon: <SwapHorizIcon />,
          tooltip: 'Cambiar rol',
          color: '#ff9800',
          onClick: (row) => onCambiarRol?.(row)
        },
        {
          icon: <BusinessIcon />,
          tooltip: 'Cambiar sede',
          color: '#4caf50',
          onClick: (row) => onCambiarSede?.(row)
        }
      ]}
      title="Usuarios del Sistema"
      subtitle={`Mostrando ${start}-${end} de ${totalCount}`}
      icon={PersonIcon}
      iconColor={deepPurple[500]}
      gradientColors={["#f3e5f5", "#e1bee7"]}
    />
  );
}

export default UsuariosTable;
