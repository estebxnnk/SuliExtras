const { DataTypes } = require('sequelize');
const { sequelize } = require('../configDb/db');
const Persona = require('./Persona');

const Administrador = sequelize.define('Administrador', {
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
});

Administrador.belongsTo(Persona, { foreignKey: 'personaId', as: 'persona' });

module.exports = Administrador; 