const { DataTypes } = require('sequelize');
const { sequelize } = require('../configDb/db');

const Rol = sequelize.define('Rol', {
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  timestamps: true,
});

module.exports = Rol; 