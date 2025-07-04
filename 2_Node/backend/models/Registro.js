const { DataTypes } = require('sequelize');
const sequelize = require('../configDb/db').sequelize;

// Importar modelo Hora
const Hora = require('./Hora');

// Tabla principal
const Registro = sequelize.define('Registro', {
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  horaIngreso: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  horaSalida: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  ubicacion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  usuario: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numRegistro: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  cantidadHorasExtra: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  justificacionHoraExtra: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  estado: {
    type: DataTypes.STRING,
    defaultValue: 'pendiente',
    allowNull: false,
  },
});

// Tabla intermedia
const RegistroHora = sequelize.define('RegistroHora', {
  cantidad: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

// Asociaciones
Registro.belongsToMany(Hora, {
  through: RegistroHora,
  foreignKey: 'registroId',
});

Hora.belongsToMany(Registro, {
  through: RegistroHora,
  foreignKey: 'horaId',
});

module.exports = Registro;
