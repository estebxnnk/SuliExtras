const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Persona = require('./models/Persona');
const Rol = require('./models/Roles');
const horaRoutes = require('./routes/hora');
const registroRoutes = require('./routes/registro');

const { sequelize, testConnection } = require('./configDb/db');
const swaggerSetup = require('./swagger/swagger');

// Inicializar la aplicación Express
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const corsOptions = {
    origin: 'http://localhost:5050', // Cambia esto al dominio de tu frontend
    methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));

// Rutas de Swagger para documentación
swaggerSetup(app);

// Configurar rutas de API
const authRoutes = require('./routes/auth');
const rolRoutes = require('./routes/rol');
const registerRoutes = require('./routes/register');
const usuariosRoutes = require('./routes/usuarios');
app.use('/api/auth', authRoutes);
app.use('/api/roles', rolRoutes);
app.use('/api/auth/register', registerRoutes);
app.use('/api/horas', horaRoutes);
app.use('/api/registros', registroRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/horas', horaRoutes);
app.use('/api/registros', registroRoutes);

// Iniciar el servidor

const PORT = process.env.PORT || 3000;

(async () => {
  await testConnection();
  sequelize.sync({ alter: true })
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
        console.log('API REST ejecutándose correctamente...');
      });
    })
    .catch(err => {
      console.error('Error al sincronizar la base de datos:', err);
    });
})();

