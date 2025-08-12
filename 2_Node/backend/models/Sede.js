const { DataTypes } = require('sequelize');
const { sequelize } = require('../configDb/db');

const Sede = sequelize.define('Sede', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Nombre de la sede'
  },
  direccion: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Dirección completa de la sede'
  },
  ciudad: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Ciudad donde se encuentra la sede'
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Teléfono de contacto de la sede'
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: { isEmail: true },
    comment: 'Email de contacto de la sede'
  },
  estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Estado activo/inactivo de la sede'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Descripción adicional de la sede'
  }
}, {
  timestamps: true,
  tableName: 'sedes',
  indexes: [
    {
      unique: true,
      fields: ['nombre']
    }
  ]
});

module.exports = Sede; 