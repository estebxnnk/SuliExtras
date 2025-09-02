import React from 'react';
import { TableUniversal } from '../../../../components';
import { Chip, Box, Typography } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const TablaSedes = ({
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
      id: 'nombre', 
      label: 'Sede',
      render: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            p: 1,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1976d2, #1565c0)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BusinessIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="body2" fontWeight={700} color="#1976d2">
              {row.nombre}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.ciudad}
            </Typography>
          </Box>
        </Box>
      )
    },
    { 
      id: 'direccion', 
      label: 'Dirección',
      render: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationOnIcon fontSize="small" color="action" />
          <Typography variant="body2" sx={{ maxWidth: 200 }}>
            {row.direccion}
          </Typography>
        </Box>
      )
    },
    { 
      id: 'contacto', 
      label: 'Contacto',
      render: (value, row) => (
        <Box>
          {row.telefono && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <PhoneIcon fontSize="small" color="action" />
              <Typography variant="caption">{row.telefono}</Typography>
            </Box>
          )}
          {row.email && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon fontSize="small" color="action" />
              <Typography variant="caption">{row.email}</Typography>
            </Box>
          )}
          {!row.telefono && !row.email && (
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Sin contacto
            </Typography>
          )}
        </Box>
      )
    },
    { 
      id: 'horarios', 
      label: 'Horarios',
      render: (value, row) => {
        const horariosCount = row.horarios ? row.horarios.length : 0;
        return (
          <Chip
            label={`${horariosCount} horario${horariosCount !== 1 ? 's' : ''}`}
            size="small"
            color={horariosCount > 0 ? 'success' : 'default'}
            variant="outlined"
            sx={{
              fontWeight: 600,
              fontSize: '0.75rem'
            }}
          />
        );
      }
    },
    { 
      id: 'estado', 
      label: 'Estado',
      render: (value, row) => (
        <Chip
          label={row.estado ? 'Activa' : 'Inactiva'}
          size="small"
          color={row.estado ? 'success' : 'error'}
          variant="filled"
          sx={{
            fontWeight: 600,
            fontSize: '0.75rem'
          }}
        />
      )
    },
    { 
      id: 'fechaCreacion', 
      label: 'Fecha de Creación', 
      render: (value, row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString('es-ES') : 'N/A' 
    }
  ];

  return (
    <TableUniversal
      data={data}
      columns={columns}
      title="Sedes del Sistema"
      subtitle="Lista de sedes y sus configuraciones"
      page={page}
      rowsPerPage={rowsPerPage}
      totalCount={totalCount}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      showPagination={true}
      emptyMessage="No se encontraron sedes"
      customActions={customActions}
      actions={[]}
      headerColor="#1976d2"
      isUserTable={false}
      isMobile={false}
    />
  );
};

export default TablaSedes;
