import React, { forwardRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  MenuItem,
  InputAdornment,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  Card,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  AddCircle as AddCircleIcon,
  Person as PersonIcon,
  CalendarToday as CalendarTodayIcon,
  Schedule as ScheduleIcon,
  Work as WorkIcon,
  AccessTime as AccessTimeIcon,
  Save as SaveIcon,
  ContentCopy as DuplicateIcon,
  Delete as DeleteIcon,
  PlaylistAdd as PlaylistAddIcon,
  ViewWeek as ViewWeekIcon
} from '@mui/icons-material';

import { FixedSizeList as List } from 'react-window';
import useCrearRegistroSemanal from '../hooks/useCrearRegistroSemanal';

const CrearRegistroSemanalUniversal = ({
  open,
  onClose,
  tiposHora = [],
  usuarios = [],
  onCrearRegistrosBulk,
  loading: loadingProp = false,
  isMobile
}) => {
  const {
    usuarioSeleccionado,
    rows,
    mensaje,
    loading,
    vistaSemanal,
    fechaLunes,
    weekRows,
    weekInclude,
    tableContainerRef,
    containerWidth,
    usuarioId,
    derivedRows,
    derivedWeekRows,
    totalHoras,
    validCount,
    invalidCount,
    shouldVirtualize,
    dayNames,
    setVistaSemanal,
    setFechaLunes,
    handleUsuarioChange,
    updateRow,
    addRow,
    removeRow,
    duplicateRow,
    handleSubmit,
    handleClose,
    updateWeekCell,
    toggleWeekInclude,
    toggleAllWeekInclude,
    setMensaje
  } = useCrearRegistroSemanal({ usuarios, onCrearRegistrosBulk, onClose, loadingProp });

  const TBody = React.useMemo(() => forwardRef(function TBody(props, ref) { return <tbody ref={ref} {...props} />; }), []);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xl"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #4caf50, #45a049)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}>
          <PlaylistAddIcon />
        </Avatar>
        <Box>
          <Typography variant="h6">
            Crear Registros de Horas Extra (Múltiples)
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Carga y edita varios registros a la vez para un empleado
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {mensaje && (
          <Alert 
            severity={mensaje.includes('exitosamente') ? 'success' : 'error'} 
            sx={{ mb: 3 }}
            onClose={() => setMensaje('')}
          >
            {mensaje}
          </Alert>
        )}

        {/* Resumen */}
        <Card sx={{ p: 2, mb: 2, background: 'linear-gradient(135deg, #eef2ff 0%, #e3f2fd 100%)', border: '1px solid #bbdefb' }}>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon color="primary" />
              <Typography variant="body1"><b>Total horas:</b> {totalHoras.toFixed(2)}</Typography>
            </Box>
            <Typography variant="body1"><b>Válidos:</b> {validCount}</Typography>
            <Typography variant="body1"><b>Inválidos:</b> {invalidCount}</Typography>
          </Box>
        </Card>

        {/* Sección: Empleado */}
        <Card sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', border: '1px solid #dee2e6' }}>
          <Typography variant="h6" fontWeight={700} color="#495057" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon sx={{ color: '#6c757d' }} />
            Empleado
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Empleado</InputLabel>
                <Select
                  value={usuarioSeleccionado?.id || ''}
                  onChange={(e) => handleUsuarioChange(e.target.value)}
                  label="Empleado"
                  startAdornment={
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  }
                >
                  {usuarios.map(usuario => (
                    <MenuItem key={usuario.id} value={usuario.id}>
                      {usuario.persona?.nombres} {usuario.persona?.apellidos} - {usuario.persona?.tipoDocumento}: {usuario.persona?.numeroDocumento}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {usuarioSeleccionado && (
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, background: '#e3f2fd', border: '1px solid #bbdefb' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#0d47a1' }}>{usuarioSeleccionado.persona?.nombres?.[0]}</Avatar>
                    <Box>
                      <Typography fontWeight={700} sx={{ fontSize: 16, color: '#0d47a1' }}>
                        Empleado seleccionado:
                      </Typography>
                      <Typography fontWeight={700} sx={{ fontSize: 17 }}>
                        {usuarioSeleccionado.persona?.nombres} {usuarioSeleccionado.persona?.apellidos}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 15 }}>
                        {usuarioSeleccionado.email}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            )}
          </Grid>
        </Card>

        {/* Eliminado: Generación semanal de filas */}

        {/* Vista semanal (7 días) */}
        <Card sx={{ p: 2, mb: 3, background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)', border: '1px solid #e1bee7' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6" fontWeight={700} color="#6a1b9a" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ViewWeekIcon /> Semana (Lunes a Domingo)
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Fecha Lunes"
                type="date"
                value={fechaLunes}
                onChange={(e) => setFechaLunes(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
              <FormControl size="small">
                <InputLabel>Modo</InputLabel>
                <Select value={vistaSemanal ? 'semanal' : 'lista'} label="Modo" onChange={(e) => setVistaSemanal(e.target.value === 'semanal')}>
                  <MenuItem value="semanal">Semanal</MenuItem>
                  <MenuItem value="lista">Lista</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {vistaSemanal && (
            <TableContainer component={Paper} sx={{ maxHeight: 520 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <input type="checkbox" checked={weekInclude.every(Boolean)} onChange={(e) => toggleAllWeekInclude(e.target.checked)} />
                    </TableCell>
                    <TableCell>Día</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Inicio</TableCell>
                    <TableCell>Fin</TableCell>
                    <TableCell>Ubicación</TableCell>
                    <TableCell>Tipo Hora</TableCell>
                    <TableCell>Justificación</TableCell>
                    <TableCell align="right">Horas Extra</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {derivedWeekRows.map((r, i) => (
                    <TableRow key={`dayrow-${i}`}>
                      <TableCell align="center">
                        <input type="checkbox" checked={weekInclude[i]} onChange={(e) => toggleWeekInclude(i, e.target.checked)} />
                      </TableCell>
                      <TableCell>{dayNames[i]}</TableCell>
                      <TableCell sx={{ minWidth: 140 }}>
                        <TextField value={r.fecha || ''} size="small" fullWidth disabled />
                      </TableCell>
                      <TableCell sx={{ minWidth: 120 }}>
                        <TextField
                          type="time"
                          value={r.horaIngreso}
                          onChange={(e) => updateWeekCell(i, 'horaIngreso', e.target.value)}
                          size="small"
                          fullWidth
                          InputProps={{ startAdornment: (<InputAdornment position="start"><ScheduleIcon /></InputAdornment>) }}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 120 }}>
                        <TextField
                          type="time"
                          value={r.horaSalida}
                          onChange={(e) => updateWeekCell(i, 'horaSalida', e.target.value)}
                          size="small"
                          fullWidth
                          InputProps={{ startAdornment: (<InputAdornment position="start"><ScheduleIcon /></InputAdornment>) }}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 160 }}>
                        <TextField
                          value={r.ubicacion}
                          onChange={(e) => updateWeekCell(i, 'ubicacion', e.target.value)}
                          size="small"
                          fullWidth
                          InputProps={{ startAdornment: (<InputAdornment position="start"><WorkIcon /></InputAdornment>) }}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 190 }}>
                        <FormControl fullWidth size="small">
                          <Select value={r.tipoHoraId} onChange={(e) => updateWeekCell(i, 'tipoHoraId', e.target.value)} displayEmpty>
                            <MenuItem value=""><em>Selecciona</em></MenuItem>
                            {tiposHora.map(tipo => (
                              <MenuItem key={tipo.id} value={tipo.id}>{tipo.tipo} - {tipo.denominacion}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell sx={{ minWidth: 220 }}>
                        <TextField
                          value={r.justificacionHoraExtra}
                          onChange={(e) => updateWeekCell(i, 'justificacionHoraExtra', e.target.value)}
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ minWidth: 140 }}>
                        <TextField
                          type="number"
                          value={r.cantidadHorasExtra}
                          onChange={(e) => updateWeekCell(i, 'cantidadHorasExtra', e.target.value)}
                          size="small"
                          fullWidth
                          inputProps={{ min: 0.5, step: 0.5, max: 24 }}
                          InputProps={{
                            startAdornment: (<InputAdornment position="start"><AccessTimeIcon /></InputAdornment>),
                            endAdornment: <InputAdornment position="end">h</InputAdornment>
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>

        {/* Sección: Tabla editable (lista) */}
        {!vistaSemanal && (
          <Card sx={{ p: 2, background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)', border: '1px solid #ffeaa7' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6" fontWeight={700} color="#856404" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WorkIcon sx={{ color: '#28a745' }} /> Registros
              </Typography>
              <Button variant="outlined" startIcon={<AddCircleIcon />} onClick={addRow}>
                Agregar fila
              </Button>
            </Box>

            <TableContainer component={Paper} sx={{ maxHeight: 480 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Inicio</TableCell>
                    <TableCell>Fin</TableCell>
                    <TableCell>Ubicación</TableCell>
                    <TableCell>Tipo Hora</TableCell>
                    <TableCell align="right">Horas Extra</TableCell>
                    <TableCell>Justificación</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody ref={tableContainerRef}>
                  {(!shouldVirtualize ? derivedRows : []).map((row, index) => (
                    <TableRow key={index} hover>
                      <TableCell sx={{ minWidth: 140 }}>
                        <TextField
                          type="date"
                          value={row.fecha}
                          onChange={(e) => updateRow(index, 'fecha', e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarTodayIcon />
                              </InputAdornment>
                            ),
                            inputProps: { max: new Date().toISOString().split('T')[0] }
                          }}
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 120 }}>
                        <TextField
                          type="time"
                          value={row.horaIngreso}
                          onChange={(e) => updateRow(index, 'horaIngreso', e.target.value)}
                          onBlur={() => updateRow(index, 'cantidadHorasExtra', calcularHorasExtraRow(row))}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <ScheduleIcon />
                              </InputAdornment>
                            )
                          }}
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 120 }}>
                        <TextField
                          type="time"
                          value={row.horaSalida}
                          onChange={(e) => updateRow(index, 'horaSalida', e.target.value)}
                          onBlur={() => updateRow(index, 'cantidadHorasExtra', calcularHorasExtraRow(row))}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <ScheduleIcon />
                              </InputAdornment>
                            )
                          }}
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 160 }}>
                        <TextField
                          value={row.ubicacion}
                          onChange={(e) => updateRow(index, 'ubicacion', e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <WorkIcon />
                              </InputAdornment>
                            )
                          }}
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 190 }}>
                        <FormControl fullWidth size="small">
                          <Select
                            value={row.tipoHoraId}
                            onChange={(e) => updateRow(index, 'tipoHoraId', e.target.value)}
                            displayEmpty
                          >
                            <MenuItem value="">
                              <em>Selecciona</em>
                            </MenuItem>
                            {tiposHora.map(tipo => (
                              <MenuItem key={tipo.id} value={tipo.id}>
                                {tipo.tipo} - {tipo.denominacion}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell align="right" sx={{ minWidth: 140 }}>
                        <TextField
                          type="number"
                          value={row.cantidadHorasExtra}
                          onChange={(e) => updateRow(index, 'cantidadHorasExtra', e.target.value)}
                          inputProps={{ min: 0.5, step: 0.5, max: 24 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <AccessTimeIcon />
                              </InputAdornment>
                            ),
                            endAdornment: <InputAdornment position="end">horas</InputAdornment>
                          }}
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 220 }}>
                        <TextField
                          value={row.justificacionHoraExtra}
                          onChange={(e) => updateRow(index, 'justificacionHoraExtra', e.target.value)}
                          size="small"
                          fullWidth
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 140 }}>
                        <Tooltip title="Duplicar fila">
                          <IconButton color="primary" onClick={() => duplicateRow(index)}>
                            <DuplicateIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar fila">
                          <IconButton color="error" onClick={() => removeRow(index)} disabled={rows.length === 1}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {shouldVirtualize && (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ p: 0 }}>
                        <div style={{ width: '100%' }}>
                          <List
                            height={480}
                            itemCount={derivedRows.length}
                            itemSize={64}
                            width={containerWidth}
                          >
                            {({ index, style }) => {
                              const row = derivedRows[index];
                              return (
                                <div style={style}>
                                  <Table size="small">
                                    <TableBody>
                                      <TableRow hover>
                                        <TableCell sx={{ minWidth: 140 }}>
                                          <TextField
                                            type="date"
                                            value={row.fecha}
                                            onChange={(e) => updateRow(index, 'fecha', e.target.value)}
                                            InputProps={{
                                              startAdornment: (
                                                <InputAdornment position="start">
                                                  <CalendarTodayIcon />
                                                </InputAdornment>
                                              ),
                                              inputProps: { max: new Date().toISOString().split('T')[0] }
                                            }}
                                            size="small"
                                            fullWidth
                                          />
                                        </TableCell>
                                        <TableCell sx={{ minWidth: 120 }}>
                                          <TextField
                                            type="time"
                                            value={row.horaIngreso}
                                            onChange={(e) => updateRow(index, 'horaIngreso', e.target.value)}
                                            onBlur={() => updateRow(index, 'cantidadHorasExtra', calcularHorasExtraRow(row))}
                                            InputProps={{ startAdornment: (<InputAdornment position="start"><ScheduleIcon /></InputAdornment>) }}
                                            size="small"
                                            fullWidth
                                          />
                                        </TableCell>
                                        <TableCell sx={{ minWidth: 120 }}>
                                          <TextField
                                            type="time"
                                            value={row.horaSalida}
                                            onChange={(e) => updateRow(index, 'horaSalida', e.target.value)}
                                            onBlur={() => updateRow(index, 'cantidadHorasExtra', calcularHorasExtraRow(row))}
                                            InputProps={{ startAdornment: (<InputAdornment position="start"><ScheduleIcon /></InputAdornment>) }}
                                            size="small"
                                            fullWidth
                                          />
                                        </TableCell>
                                        <TableCell sx={{ minWidth: 160 }}>
                                          <TextField
                                            value={row.ubicacion}
                                            onChange={(e) => updateRow(index, 'ubicacion', e.target.value)}
                                            InputProps={{ startAdornment: (<InputAdornment position="start"><WorkIcon /></InputAdornment>) }}
                                            size="small"
                                            fullWidth
                                          />
                                        </TableCell>
                                        <TableCell sx={{ minWidth: 190 }}>
                                          <FormControl fullWidth size="small">
                                            <Select value={row.tipoHoraId} onChange={(e) => updateRow(index, 'tipoHoraId', e.target.value)} displayEmpty>
                                              <MenuItem value=""><em>Selecciona</em></MenuItem>
                                              {tiposHora.map(tipo => (<MenuItem key={tipo.id} value={tipo.id}>{tipo.tipo} - {tipo.denominacion}</MenuItem>))}
                                            </Select>
                                          </FormControl>
                                        </TableCell>
                                        <TableCell align="right" sx={{ minWidth: 140 }}>
                                          <TextField
                                            type="number"
                                            value={row.cantidadHorasExtra}
                                            onChange={(e) => updateRow(index, 'cantidadHorasExtra', e.target.value)}
                                            inputProps={{ min: 0.5, step: 0.5, max: 24 }}
                                            InputProps={{
                                              startAdornment: (<InputAdornment position="start"><AccessTimeIcon /></InputAdornment>),
                                              endAdornment: <InputAdornment position="end">horas</InputAdornment>
                                            }}
                                            size="small"
                                            fullWidth
                                          />
                                        </TableCell>
                                        <TableCell sx={{ minWidth: 220 }}>
                                          <TextField
                                            value={row.justificacionHoraExtra}
                                            onChange={(e) => updateRow(index, 'justificacionHoraExtra', e.target.value)}
                                            size="small"
                                            fullWidth
                                          />
                                        </TableCell>
                                        <TableCell align="center" sx={{ minWidth: 140 }}>
                                          <Tooltip title="Duplicar fila"><IconButton color="primary" onClick={() => duplicateRow(index)}><DuplicateIcon /></IconButton></Tooltip>
                                          <Tooltip title="Eliminar fila"><IconButton color="error" onClick={() => removeRow(index)} disabled={rows.length === 1}><DeleteIcon /></IconButton></Tooltip>
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                              );
                            }}
                          </List>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button variant="outlined" startIcon={<AddCircleIcon />} onClick={addRow}>
                Agregar fila
              </Button>
            </Box>
          </Card>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: 'background.default' }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{ px: 4, py: 1.5, fontWeight: 600 }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={loading || loadingProp}
          sx={{ 
            px: 4, 
            py: 1.5, 
            fontWeight: 600,
            background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
            '&:hover': { background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)' }
          }}
        >
          {loading || loadingProp ? 'Creando...' : 'Crear Registros'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CrearRegistroSemanalUniversal;


