import React from 'react';
import { SubAdminTableUniversal } from '../../../../components';

const TablaUsuarios = ({
  data,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  customActions
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
      id: 'ubicacion', 
      label: 'Ubicación'
    },
    { 
      id: 'fechaCreacion', 
      label: 'Fecha de Creación', 
      render: (value, row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString('es-ES') : 'N/A' 
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
