const { sequelize } = require('../configDb/db');
const Sede = require('../models/Sede');
const sedeLogic = require('../logic/SedeLogic');

// Semillas de sedes con horarios embebidos (campo JSON `horarios`)
const SEDES_CON_HORARIOS = [
  {
    nombre: 'Sede Principal',
    direccion: 'Calle 123 #45-67, Centro Comercial Plaza Mayor',
    ciudad: 'Bogotá',
    telefono: '3001234567',
    email: 'sede.principal@empresa.com',
    descripcion: 'Sede principal de la empresa en Bogotá',
    horarios: [
      { nombre: 'Horario Estándar', tipo: 'normal', horaEntrada: '08:00', horaSalida: '17:00', tiempoAlmuerzo: 60, diasTrabajados: 5, activo: true },
      { nombre: 'Horario Sábado', tipo: 'especial', horaEntrada: '08:00', horaSalida: '13:00', tiempoAlmuerzo: 0, diasTrabajados: 1, activo: true }
    ]
  },
  {
    nombre: 'Sede Norte',
    direccion: 'Carrera 15 #93-45, Centro Empresarial',
    ciudad: 'Bogotá',
    telefono: '3001234568',
    email: 'sede.norte@empresa.com',
    descripcion: 'Sede ubicada en el norte de Bogotá',
    horarios: [
      { nombre: 'Turno Largo', tipo: 'especial', horaEntrada: '07:00', horaSalida: '18:00', tiempoAlmuerzo: 60, diasTrabajados: 5, activo: true }
    ]
  },
  {
    nombre: 'Sede Medellín',
    direccion: 'Calle 10 #42-15, Zona Rosa',
    ciudad: 'Medellín',
    telefono: '3001234569',
    email: 'sede.medellin@empresa.com',
    descripcion: 'Sede en Medellín, Antioquia',
    horarios: [
      { nombre: 'Horario Estándar', tipo: 'normal', horaEntrada: '09:00', horaSalida: '18:00', tiempoAlmuerzo: 60, diasTrabajados: 5, activo: true },
      { nombre: 'Horario Nocturno', tipo: 'nocturno', horaEntrada: '22:00', horaSalida: '06:00', tiempoAlmuerzo: 30, diasTrabajados: 5, activo: false }
    ]
  },
  {
    nombre: 'Sede Cali',
    direccion: 'Avenida 4 Norte #6N-67, Centro',
    ciudad: 'Cali',
    telefono: '3001234570',
    email: 'sede.cali@empresa.com',
    descripcion: 'Sede en Cali, Valle del Cauca',
    horarios: [
      { nombre: 'Horario Estándar', tipo: 'normal', horaEntrada: '08:30', horaSalida: '17:30', tiempoAlmuerzo: 60, diasTrabajados: 5, activo: true }
    ]
  }
];

async function sembrarSedesConHorariosJSON() {
  try {
    console.log('🔗 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa');

    // Mantener el esquema actualizado (no borrar tablas)
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados');

    // Limpiar solo sedes para este seed (opcional: comenta para no borrar)
    await Sede.destroy({ where: {} });
    console.log('🧹 Sedes anteriores eliminadas');

    const sedesCreadas = [];

    for (const sedeData of SEDES_CON_HORARIOS) {
      const { horarios, ...datosSede } = sedeData;
      // Crear sede con `crearSede` para validar nombre único y estructura
      const sede = await sedeLogic.crearSede({ ...datosSede, horarios: [] });
      console.log(`✅ Sede creada: ${sede.nombre} (${sede.ciudad})`);

      // Agregar horarios con la lógica que calcula y valida
      for (const horario of horarios) {
        await sedeLogic.agregarHorario(sede.id, horario);
        console.log(`   ➕ Horario agregado: ${horario.nombre} (${horario.tipo})`);
      }

      sedesCreadas.push(await Sede.findByPk(sede.id));
    }

    console.log('\n📊 Resumen de sedes:');
    for (const sede of sedesCreadas) {
      console.log(`   ${sede.nombre} - horarios: ${Array.isArray(sede.horarios) ? sede.horarios.length : 0}`);
    }

    console.log('\n🎉 Siembra de sedes con horarios JSON completada.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al sembrar sedes con horarios JSON:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  sembrarSedesConHorariosJSON();
}

module.exports = sembrarSedesConHorariosJSON;


