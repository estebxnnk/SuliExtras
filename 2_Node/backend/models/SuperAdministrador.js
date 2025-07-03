const { DataTypes } = require('sequelize');
const { sequelize } = require('../configDb/db');
const Persona = require('./Persona');

const SuperAdministrador = sequelize.define('SuperAdministrador', {
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
});

SuperAdministrador.belongsTo(Persona, { foreignKey: 'personaId', as: 'persona' });

module.exports = SuperAdministrador; 