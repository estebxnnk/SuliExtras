const { DataTypes } = require('sequelize');
const { sequelize } = require('../configDb/db');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sedeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'sedes',
      key: 'id'
    },
    comment: 'ID de la sede asignada al usuario'
  },
}, {
  timestamps: true,
});

module.exports = User; 