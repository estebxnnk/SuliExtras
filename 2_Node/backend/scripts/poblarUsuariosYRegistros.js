const sequelize = require('../configDb/db').sequelize;
const User = require('../models/User');
const Registro = require('../models/Registro');
const Rol = require('../models/Roles');
const Persona = require('../models/Persona');
const Hora = require('../models/Hora');

async function poblar() {
  try {
    const rolEmpleado = await Rol.create({ nombre: 'Empleado' });
    const rolAdmin = await Rol.create({ nombre: 'Administrador' });

    // Crear personas de ejemplo
    const persona1 = await Persona.create({
      tipoDocumento: 'CC',
      numeroDocumento: '12345678',
      nombres: 'Juan',
      apellidos: 'Pérez',
      correo: 'juan.perez@example.com',
      fechaNacimiento: '1990-01-01',
    });
    const persona2 = await Persona.create({
      tipoDocumento: 'CC',
      numeroDocumento: '87654321',
      nombres: 'Ana',
      apellidos: 'García',
      correo: 'ana.garcia@example.com',
      fechaNacimiento: '1992-05-10',
    });
    const persona3 = await Persona.create({
      tipoDocumento: 'CC',
      numeroDocumento: '87654300',
      nombres: 'Ana',
      apellidos: 'García',
      correo: 'ana.garcia@example.com',
      fechaNacimiento: '1992-05-10',
    });

    // Crear usuarios de ejemplo
    const user1 = await User.create({
      email: 'juan@example.com',
      password: '123456', // Recuerda hashear en producción
      rolId: rolEmpleado.id,
      personaId: persona1.id,
    });
    const user2 = await User.create({
      email: 'ana@example.com',
      password: 'abcdef',
      rolId: rolAdmin.id,
      personaId: persona2.id,
    });

    // Crear tipos de horas extra
    const horaDiurna = await Hora.create({
      tipo: 'HED',
      denominacion: 'Hora extra diurna',
      valor: 1.25,
    });
    const horaNocturna = await Hora.create({
      tipo: 'HEN',
      denominacion: 'Hora extra nocturna',
      valor: 1.75,
    });

    // Crear registros asociados a los usuarios
    const registro1 = await Registro.create({
      fecha: '2024-06-01',
      horaIngreso: '08:00',
      horaSalida: '17:00',
      ubicacion: 'Oficina Central',
      usuario: user1.email,
      usuarioId: user1.id,
      numRegistro: 'REG001',
      cantidadHorasExtra: 2.5,
      justificacionHoraExtra: 'Trabajo urgente',
      estado: 'pendiente',
    });
    const registro2 = await Registro.create({
      fecha: '2024-06-02',
      horaIngreso: '09:00',
      horaSalida: '18:00',
      ubicacion: 'Sucursal Norte',
      usuario: user2.email,
      usuarioId: user2.id,
      numRegistro: 'REG002',
      cantidadHorasExtra: 1.0,
      justificacionHoraExtra: 'Reunión extendida',
      estado: 'aprobado',
    });

    // Asociar horas extra a los registros (tabla intermedia)
    await registro1.addHora(horaDiurna, { through: { cantidad: 2 } });
    await registro1.addHora(horaNocturna, { through: { cantidad: 0.5 } });
    await registro2.addHora(horaNocturna, { through: { cantidad: 1 } });

    console.log('Datos de ejemplo insertados correctamente.');
    process.exit(0);
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
    process.exit(1);
  }
}

poblar(); 