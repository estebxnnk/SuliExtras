import React from 'react';
import { SubAdminTable } from '../../components';
import { AssessmentIcon } from '@mui/icons-material';
import { VisibilityIcon, ListAltIcon, ReceiptLongIcon } from '@mui/icons-material';

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
      id: 'nombres', 
      label: 'Nombres', 
      render: (value, row) => row.persona?.nombres || 'N/A' 
    },
    { 
      id: 'apellidos', 
      label: 'Apellidos', 
      render: (value, row) => row.persona?.apellidos || 'N/A' 
    },
    { 
      id: 'documento', 
      label: 'Documento', 
      render: (value, row) => `${row.persona?.tipoDocumento || 'N/A'}: ${row.persona?.numeroDocumento || 'N/A'}` 
    },
    { 
      id: 'email', 
      label: 'Email', 
      render: (value, row) => row.email || 'N/A' 
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
    <SubAdminTable
      data={data}
      columns={columns}
      title="Usuarios del Sistema"
      subtitle="Lista de usuarios para generar reportes de horas extra"
      icon={AssessmentIcon}
      iconColor="#9c27b0"
      gradientColors={["#f8f9fa", "#e9ecef"]}
      page={page}
      rowsPerPage={rowsPerPage}
      totalCount={totalCount}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      showPagination={true}
      emptyMessage="No se encontraron usuarios"
      customActions={customActions}
      showActions={false}
    />
  );
};

export default TablaUsuarios;
