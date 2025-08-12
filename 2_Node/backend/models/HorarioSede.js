const { DataTypes } = require('sequelize');
const { sequelize } = require('../configDb/db');

const HorarioSede = sequelize.define('HorarioSede', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sedeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'sedes',
      key: 'id'
    },
    comment: 'ID de la sede a la que pertenece este horario'
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Nombre del horario (ej: Horario Normal, Horario Nocturno, etc.)'
  },
  tipo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'normal',
    validate: {
      isIn: [['normal', 'nocturno', 'especial', 'festivo']]
    },
    comment: 'Tipo de horario'
  },
  diaSemana: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 6
    },
    comment: 'Día de la semana (0=Domingo, 1=Lunes, ..., 6=Sábado)'
  },
  horaEntrada: {
    type: DataTypes.TIME,
    allowNull: false,
    comment: 'Hora de entrada para este día'
  },
  horaSalida: {
    type: DataTypes.TIME,
    allowNull: false,
    comment: 'Hora de salida para este día'
  },
  horasJornada: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'Horas de la jornada normal para este día'
  },
  toleranciaEntrada: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 15,
    comment: 'Tolerancia en minutos para la entrada'
  },
  toleranciaSalida: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 15,
    comment: 'Tolerancia en minutos para la salida'
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Si el horario está activo'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Descripción adicional del horario'
  }
}, {
  timestamps: true,
  tableName: 'horarios_sede',
  indexes: [
    {
      unique: true,
      fields: ['sedeId', 'diaSemana', 'tipo']
    }
  ]
});

module.exports = HorarioSede; 