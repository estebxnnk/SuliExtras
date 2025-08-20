import React from 'react';
import { SubAdminTableUniversal } from '../../components';
import {
  Visibility as VisibilityIcon,
  ListAlt as ListAltIcon,
  ReceiptLong as ReceiptLongIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';




const TablaUsuarios = ({
  data,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  onVerDetalles,
  onVerRegistros,
  onVerReporte
}) => {
  const columns = [
    { 
      id: 'usuario', 
      label: 'Usuario'
    },
    { 
      id: 'documento', 
      label: 'Documento'
    },
    { 
      id: 'rol', 
      label: 'Rol'
    },
    { 
      id: 'estado', 
      label: 'Estado'
    },
    { 
      id: 'fechaCreacion', 
      label: 'Fecha de Creación', 
      render: (value, row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString('es-ES') : 'N/A' 
    }
  ];

  const customActions = [
    {
      icon: <VisibilityIcon />,
      tooltip: 'Ver detalles',
      color: '#1976d2',
      onClick: (row) => onVerDetalles(row)
    },
    {
      icon: <ListAltIcon />,
      tooltip: 'Ver registros de horas extra',
      color: '#388e3c',
      onClick: (row) => onVerRegistros(row)
    },
    {
      icon: <ReceiptLongIcon />,
      tooltip: 'Ver reporte general',
      color: '#ff9800',
      onClick: (row) => onVerReporte(row)
    }
  ];

  return (
    <SubAdminTableUniversal
      data={data}
      columns={columns}
      title="Usuarios del Sistema"
      subtitle="Lista de usuarios para generar reportes de horas extra"
      page={page}
      rowsPerPage={rowsPerPage}
      totalCount={totalCount}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      showPagination={true}
      emptyMessage="No se encontraron usuarios"
      customActions={customActions}
      headerColor="#9c27b0"
      isUserTable={true}
      isMobile={false}
    />
  );
};

export default TablaUsuarios;
