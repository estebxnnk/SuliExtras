import React, { useContext, useState } from 'react';
import { SalarioMinimoContext } from './providers/SalarioMinimoProvider';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';

function SalarioMinimoEditor({ onClose }) {
  const { salarioMinimo, setSalarioMinimo } = useContext(SalarioMinimoContext);
  const [valor, setValor] = useState(salarioMinimo);
  const [mensaje, setMensaje] = useState('');

  const handleGuardar = () => {
    if (valor < 1) {
      setMensaje('El salario mínimo debe ser mayor a 0');
      return;
    }
    setSalarioMinimo(valor);
    setMensaje('¡Salario mínimo actualizado!');
    if (onClose) setTimeout(onClose, 700); // Cierra el diálogo tras un breve mensaje
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 400, margin: '32px auto', textAlign: 'center' }}>
      <Typography variant="h6" fontWeight={700} mb={2}>Editar Salario Mínimo</Typography>
      <TextField
        label="Salario mínimo (COP)"
        type="number"
        value={valor}
        onChange={e => setValor(Number(e.target.value))}
        fullWidth
        sx={{ mb: 2 }}
        inputProps={{ min: 1, step: 1000 }}
      />
      <Button variant="contained" color="primary" onClick={handleGuardar} fullWidth>
        Guardar
      </Button>
      {mensaje && <Typography color="success.main" mt={2}>{mensaje}</Typography>}
    </Paper>
  );
}

export default SalarioMinimoEditor; 