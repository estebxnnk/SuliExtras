  cantidadHorasExtra: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  horas_reales: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
  horas_extra: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
  bono_salarial: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
  justificacionHoraExtra: {
// ... existing code ...
} 