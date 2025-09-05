const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const swaggerSetup = require('./swagger/swagger');

const { sequelize, testConnection } = require('./configDb/db');

// Importar todos los modelos
const User = require('./models/User');
const Persona = require('./models/Persona');
const Rol = require('./models/Roles');
const Hora = require('./models/Hora');
const Registro = require('./models/Registro');
const Sede = require('./models/Sede');
const Administrador = require('./models/Administrador');
const Empleado = require('./models/Empleado');
const JefeDirecto = require('./models/JefeDirecto');
const SuperAdministrador = require('./models/SuperAdministrador');

// Inicializar la aplicación Express
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const corsOptions = {
    origin: '*', // Cambia esto al dominio de tu frontend
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
const horaRoutes = require('./routes/hora');
const registroRoutes = require('./routes/registro');
const sedeRoutes = require('./routes/sede');

// Configurar asociaciones después de cargar todos los modelos
// Relaciones existentes
User.belongsTo(Persona, { foreignKey: 'personaId', as: 'persona' });
User.belongsTo(Rol, { foreignKey: 'rolId', as: 'rol' });
Rol.hasMany(User, { foreignKey: 'rolId', as: 'usuarios' });

// Relaciones con Sede
User.belongsTo(Sede, { foreignKey: 'sedeId', as: 'sede' });
Sede.hasMany(User, { foreignKey: 'sedeId', as: 'usuarios' });

app.use('/api/auth', authRoutes);
app.use('/api/roles', rolRoutes);
app.use('/api/auth/register', registerRoutes);
app.use('/api/horas', horaRoutes);
app.use('/api/registros', registroRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/sedes', sedeRoutes);


const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await testConnection();
    
    // Sincronizar todos los modelos con la base de datos
    await sequelize.sync({ alter: true });
    console.log('✅ Todas las tablas han sido sincronizadas correctamente');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log('📚 API REST ejecutándose correctamente...');
    });
  } catch (error) {
    console.error('❌ Error al inicializar la aplicación:', error);
    process.exit(1);
  }
})();