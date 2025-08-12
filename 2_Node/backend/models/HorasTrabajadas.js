const { DataTypes } = require('sequelize');
const { sequelize } = require('../configDb/db');

const HorasTrabajadas = sequelize.define('HorasTrabajadas', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  horaEntrada: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  horaSalida: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  horasTrabajadas: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
    comment: 'Total de horas trabajadas en el día'
  },
  horasExtra: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
    comment: 'Horas extra calculadas (más de 8 horas)'
  },
  tipoHoraExtra: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Ninguna',
    comment: 'Tipo de hora extra: Normal, Nocturna, Festiva, etc.'
  },
  estado: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'pendiente',
    validate: {
      isIn: [['pendiente', 'aprobado', 'rechazado']]
    },
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  timestamps: true,
  tableName: 'horas_trabajadas'
});

module.exports = HorasTrabajadas; 