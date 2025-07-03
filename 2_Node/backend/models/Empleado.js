const { DataTypes } = require('sequelize');
const { sequelize } = require('../configDb/db');
const Persona = require('./Persona');

const Empleado = sequelize.define('Empleado', {
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
});

Empleado.belongsTo(Persona, { foreignKey: 'personaId', as: 'persona' });

module.exports = Empleado; 