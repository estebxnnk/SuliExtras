// c:\RepositorioEsteban\SuliExtras\2_Node\backend\config\config.js
require('dotenv').config();

const common = {
  dialect: 'postgres', // Igual a configDb/db.js
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
};

module.exports = {
  development: { ...common },
  test: {
    ...common,
    database: process.env.DB_NAME_TEST || `${process.env.DB_NAME || 'suli_extras'}_test`,
  },
  production: { ...common },
};