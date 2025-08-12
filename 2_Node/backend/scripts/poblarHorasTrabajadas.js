const { sequelize } = require('../configDb/db');
const HorasTrabajadas = require('../models/HorasTrabajadas');
const User = require('../models/User');
const Rol = require('../models/Roles');
const Persona = require('../models/Persona');

// Datos de prueba para horas trabajadas
const REGISTROS_PRUEBA = [
  {
    usuarioId: 1, // Asumiendo que existe un usuario con ID 1
    fecha: '2024-01-15',
    horaEntrada: '08:00',
    horaSalida: '18:00',
    horasTrabajadas: 10.0,
    horasExtra: 2.0,
    tipoHoraExtra: 'Normal',
    estado: 'aprobado',
    observaciones: 'Trabajo extra por proyecto urgente'
  },
  {
    usuarioId: 1,
    fecha: '2024-01-16',
    horaEntrada: '08:00',
    horaSalida: '20:00',
    horasTrabajadas: 12.0,
    horasExtra: 4.0,
    tipoHoraExtra: 'Normal',
    estado: 'pendiente',
    observaciones: 'Reunión con cliente'
  },
  {
    usuarioId: 1,
    fecha: '2024-01-17',
    horaEntrada: '22:00',
    horaSalida: '06:00',
    horasTrabajadas: 8.0,
    horasExtra: 0.0,
    tipoHoraExtra: 'Ninguna',
    estado: 'aprobado',
    observaciones: 'Turno nocturno'
  },
  {
    usuarioId: 1,
    fecha: '2024-01-18',
    horaEntrada: '08:00',
    horaSalida: '19:30',
    horasTrabajadas: 11.5,
    horasExtra: 3.5,
    tipoHoraExtra: 'Normal',
    estado: 'rechazado',
    observaciones: 'Rechazado por falta de justificación'
  },
  {
    usuarioId: 1,
    fecha: '2024-01-19',
    horaEntrada: '08:00',
    horaSalida: '17:00',
    horasTrabajadas: 9.0,
    horasExtra: 1.0,
    tipoHoraExtra: 'Normal',
    estado: 'aprobado',
    observaciones: 'Trabajo extra menor'
  }
];

async function poblarHorasTrabajadas() {
  try {
    console.log('🔗 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa');
    
    // Sincronizar modelos
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados');
    
    // Verificar si existe al menos un usuario empleado
    const empleado = await User.findOne({
      include: [
        { model: Rol, as: 'rol', where: { nombre: 'Empleado' } },
        { model: Persona, as: 'persona' }
      ]
    });
    
    if (!empleado) {
      console.log('⚠️  No se encontró ningún usuario con rol Empleado');
      console.log('💡 Ejecuta primero el script de poblar usuarios');
      process.exit(1);
    }
    
    console.log(`👤 Usuario empleado encontrado: ${empleado.persona.nombres} ${empleado.persona.apellidos}`);
    
    // Limpiar registros existentes
    await HorasTrabajadas.destroy({ where: {} });
    console.log('🧹 Registros anteriores eliminados');
    
    // Crear registros de prueba
    let registrosCreados = 0;
    for (const registro of REGISTROS_PRUEBA) {
      // Usar el ID del empleado encontrado
      registro.usuarioId = empleado.id;
      
      await HorasTrabajadas.create(registro);
      registrosCreados++;
      console.log(`✅ Registro creado: ${registro.fecha} - ${registro.horaEntrada} a ${registro.horaSalida}`);
    }
    
    console.log(`\n🎉 ¡Proceso completado exitosamente!`);
    console.log(`📊 Total de registros creados: ${registrosCreados}`);
    console.log(`👤 Usuario: ${empleado.persona.nombres} ${empleado.persona.apellidos} (ID: ${empleado.id})`);
    
    // Mostrar estadísticas
    const totalRegistros = await HorasTrabajadas.count();
    const registrosAprobados = await HorasTrabajadas.count({ where: { estado: 'aprobado' } });
    const registrosPendientes = await HorasTrabajadas.count({ where: { estado: 'pendiente' } });
    const registrosRechazados = await HorasTrabajadas.count({ where: { estado: 'rechazado' } });
    
    console.log('\n📈 Estadísticas:');
    console.log(`   Total: ${totalRegistros}`);
    console.log(`   Aprobados: ${registrosAprobados}`);
    console.log(`   Pendientes: ${registrosPendientes}`);
    console.log(`   Rechazados: ${registrosRechazados}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al poblar horas trabajadas:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  poblarHorasTrabajadas();
}

module.exports = poblarHorasTrabajadas; 