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
      numeroDocumento: '12341333',
      nombres: 'Juan',
      apellidos: 'Pérez',
      correo: 'juan.perez@example.com',
      fechaNacimiento: '1990-01-01',
    });
    const persona2 = await Persona.create({
      tipoDocumento: 'CC',
      numeroDocumento: '87674321',
      nombres: 'Ana',
      apellidos: 'García',
      correo: 'ana.garcia@example.com',
      fechaNacimiento: '1992-05-10',
    });
    const persona3 = await Persona.create({
      tipoDocumento: 'CC',
      numeroDocumento: '87659300',
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

    // Obtener tipos de hora ya existentes
    const horaDiurna = await Hora.findByPk(1); // H.D.E
    const horaTarde = await Hora.findByPk(2);  // H.E.T
    const horaNocturna = await Hora.findByPk(3); // H.E.N

    // Crear registros asociados a los usuarios
    const registro1 = await Registro.create({
      fecha: '2024-06-01',
      horaIngreso: '08:00',
      horaSalida: '17:00',
      ubicacion: 'Oficina Central',
      usuario: user1.email,
      usuarioId: user1.id,
      numRegistro: 'REG001',
      cantidadHorasExtra: 10,
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
      cantidadHorasExtra: 5,
      justificacionHoraExtra: 'Reunión extendida',
      estado: 'aprobado',
    });

    // Asociar horas extra a los registros (tabla intermedia)
    await registro1.addHora(horaDiurna, { through: { cantidad: 6 } });
    await registro1.addHora(horaNocturna, { through: { cantidad: 4 } });
    await registro2.addHora(horaNocturna, { through: { cantidad: 5 } });
    await registro2.addHora(horaTarde, { through: { cantidad: 2 } });

    // Más personas y usuarios
    const persona4 = await Persona.create({
      tipoDocumento: 'CC',
      numeroDocumento: '11023344',
      nombres: 'Carlos',
      apellidos: 'Ramírez',
      correo: 'carlos.ramirez@example.com',
      fechaNacimiento: '1985-03-15',
    });
    const persona5 = await Persona.create({
      tipoDocumento: 'CC',
      numeroDocumento: '55668788',
      nombres: 'Laura',
      apellidos: 'Martínez',
      correo: 'laura.martinez@example.com',
      fechaNacimiento: '1995-07-22',
    });

    const user3 = await User.create({
      email: 'carlos@example.com',
      password: 'qwerty',
      rolId: rolEmpleado.id,
      personaId: persona4.id,
    });
    const user4 = await User.create({
      email: 'laura@example.com',
      password: 'asdfgh',
      rolId: rolEmpleado.id,
      personaId: persona5.id,
    });

    // Más registros
    const registro3 = await Registro.create({
      fecha: '2024-06-03',
      horaIngreso: '07:30',
      horaSalida: '16:30',
      ubicacion: 'Sucursal Sur',
      usuario: user3.email,
      usuarioId: user3.id,
      numRegistro: 'REG003',
      cantidadHorasExtra: 3.5,
      justificacionHoraExtra: 'Inventario mensual',
      estado: 'pendiente',
    });
    const registro4 = await Registro.create({
      fecha: '2024-06-04',
      horaIngreso: '10:00',
      horaSalida: '19:00',
      ubicacion: 'Sucursal Este',
      usuario: user4.email,
      usuarioId: user4.id,
      numRegistro: 'REG004',
      cantidadHorasExtra: 4.0,
      justificacionHoraExtra: 'Capacitación',
      estado: 'aprobado',
    });
    const registro5 = await Registro.create({
      fecha: '2024-06-05',
      horaIngreso: '08:15',
      horaSalida: '17:15',
      ubicacion: 'Sucursal Oeste',
      usuario: user1.email,
      usuarioId: user1.id,
      numRegistro: 'REG005',
      cantidadHorasExtra: 2.0,
      justificacionHoraExtra: 'Soporte técnico',
      estado: 'pendiente',
    });
    const registro6 = await Registro.create({
      fecha: '2024-06-06',
      horaIngreso: '09:30',
      horaSalida: '18:30',
      ubicacion: 'Oficina Central',
      usuario: user2.email,
      usuarioId: user2.id,
      numRegistro: 'REG006',
      cantidadHorasExtra: 5.0,
      justificacionHoraExtra: 'Auditoría',
      estado: 'aprobado',
    });

    // Asociar horas extra a los nuevos registros
    await registro3.addHora(horaDiurna, { through: { cantidad: 2 } });
    await registro3.addHora(horaTarde, { through: { cantidad: 1.5 } });
    await registro4.addHora(horaNocturna, { through: { cantidad: 4 } });
    await registro5.addHora(horaDiurna, { through: { cantidad: 2 } });
    await registro6.addHora(horaNocturna, { through: { cantidad: 5 } });

    console.log('Datos de ejemplo insertados correctamente.');
    process.exit(0);
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
    process.exit(1);
  }
}

poblar(); 