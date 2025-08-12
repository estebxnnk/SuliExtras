import { Box, TextField, MenuItem, InputAdornment, Paper, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

function Filtros({ search, setSearch, filtroEstado, setFiltroEstado }) {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 3, 
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,248,255,0.95) 100%)',
        border: '1px solid rgba(25, 118, 210, 0.2)',
        borderRadius: 3
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <FilterListIcon sx={{ color: '#1976d2', fontSize: 28 }} />
        <Typography variant="h6" fontWeight={600} color="#1976d2">
          Filtros de Búsqueda
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Buscar por usuario, número de registro o ubicación"
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ 
            flex: 1, 
            minWidth: 300,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              background: 'rgba(255,255,255,0.9)',
              '&:hover': {
                background: 'rgba(255,255,255,1)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1976d2',
                  borderWidth: 2
                }
              },
              '&.Mui-focused': {
                background: 'rgba(255,255,255,1)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1976d2',
                  borderWidth: 2
                }
              }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#1976d2' }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          label="Filtrar por estado"
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
          sx={{ 
            minWidth: 200,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              background: 'rgba(255,255,255,0.9)',
              '&:hover': {
                background: 'rgba(255,255,255,1)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1976d2',
                  borderWidth: 2
                }
              },
              '&.Mui-focused': {
                background: 'rgba(255,255,255,1)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1976d2',
                  borderWidth: 2
                }
              }
            }
          }}
        >
          <MenuItem value="todos">Todos los estados</MenuItem>
          <MenuItem value="pendiente">Pendiente</MenuItem>
          <MenuItem value="aprobado">Aprobado</MenuItem>
          <MenuItem value="rechazado">Rechazado</MenuItem>
        </TextField>
      </Box>
    </Paper>
  );
}

export default Filtros; 