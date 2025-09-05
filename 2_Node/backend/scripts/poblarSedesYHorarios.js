const { sequelize } = require('../configDb/db');
const Sede = require('../models/Sede');
const HorarioSede = require('../models/HorarioSede');
const horarioSedeLogic = require('../logic/HorarioSedeLogic');

// Datos de prueba para sedes
const SEDES_PRUEBA = [
  {
    nombre: 'Sede Principal',
    direccion: 'Calle 123 #45-67, Centro Comercial Plaza Mayor',
    ciudad: 'Bogotá',
    telefono: '3001234567',
    email: 'sede.principal@empresa.com',
    descripcion: 'Sede principal de la empresa en Bogotá'
  },
  {
    nombre: 'Sede Norte',
    direccion: 'Carrera 15 #93-45, Centro Empresarial',
    ciudad: 'Bogotá',
    telefono: '3001234568',
    email: 'sede.norte@empresa.com',
    descripcion: 'Sede ubicada en el norte de Bogotá'
  },
  {
    nombre: 'Sede Medellín',
    direccion: 'Calle 10 #42-15, Zona Rosa',
    ciudad: 'Medellín',
    telefono: '3001234569',
    email: 'sede.medellin@empresa.com',
    descripcion: 'Sede en Medellín, Antioquia'
  },
  {
    nombre: 'Sede Cali',
    direccion: 'Avenida 4 Norte #6N-67, Centro',
    ciudad: 'Cali',
    telefono: '3001234570',
    email: 'sede.cali@empresa.com',
    descripcion: 'Sede en Cali, Valle del Cauca'
  }
];

// Configuraciones de horarios por defecto
const CONFIGURACIONES_HORARIOS = [
  {
    nombre: 'Horario Estándar',
    horaEntrada: '08:00',
    horaSalida: '17:00',
    horasJornada: 8,
    toleranciaEntrada: 15,
    toleranciaSalida: 15
  },
  {
    nombre: 'Horario Extendido',
    horaEntrada: '07:00',
    horaSalida: '18:00',
    horasJornada: 10,
    toleranciaEntrada: 20,
    toleranciaSalida: 20
  },
  {
    nombre: 'Horario Nocturno',
    horaEntrada: '22:00',
    horaSalida: '06:00',
    horasJornada: 8,
    toleranciaEntrada: 10,
    toleranciaSalida: 10
  }
];

async function poblarSedesYHorarios() {
  try {
    console.log('🔗 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa');
    
    // Sincronizar modelos
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados');
    
    // Limpiar datos existentes
    await HorarioSede.destroy({ where: {} });
    await Sede.destroy({ where: {} });
    console.log('🧹 Datos anteriores eliminados');
    
    // Crear sedes
    const sedesCreadas = [];
    for (const sedeData of SEDES_PRUEBA) {
      const sede = await Sede.create(sedeData);
      sedesCreadas.push(sede);
      console.log(`✅ Sede creada: ${sede.nombre} (${sede.ciudad})`);
    }
    
    console.log(`\n📊 Total de sedes creadas: ${sedesCreadas.length}`);
    
    // Crear horarios para cada sede
    let totalHorariosCreados = 0;
    
    for (let i = 0; i < sedesCreadas.length; i++) {
      const sede = sedesCreadas[i];
      const config = CONFIGURACIONES_HORARIOS[i % CONFIGURACIONES_HORARIOS.length];
      
      console.log(`\n🕐 Creando horarios para: ${sede.nombre}`);
      
      try {
        // Crear horarios por defecto (lunes a viernes)
        const horariosCreados = await horarioSedeLogic.crearHorariosPorDefecto(sede.id, config);
        
        // Crear horario especial para sábado (si es la sede principal)
        if (i === 0) {
          await horarioSedeLogic.crearHorario({
            sedeId: sede.id,
            nombre: 'Horario Sábado',
            tipo: 'especial',
            diaSemana: 6, // Sábado
            horaEntrada: '08:00',
            horaSalida: '13:00',
            horasJornada: 5,
            toleranciaEntrada: 15,
            toleranciaSalida: 15,
            descripcion: 'Horario reducido para sábados'
          });
          console.log('✅ Horario de sábado creado');
        }
        
        // Crear horario nocturno para la sede de Medellín
        if (sede.ciudad === 'Medellín') {
          await horarioSedeLogic.crearHorario({
            sedeId: sede.id,
            nombre: 'Horario Nocturno',
            tipo: 'nocturno',
            diaSemana: 1, // Lunes
            horaEntrada: '22:00',
            horaSalida: '06:00',
            horasJornada: 8,
            toleranciaEntrada: 10,
            toleranciaSalida: 10,
            descripcion: 'Turno nocturno especial'
          });
          console.log('✅ Horario nocturno creado');
        }
        
        totalHorariosCreados += horariosCreados.length;
        console.log(`✅ ${horariosCreados.length} horarios creados para ${sede.nombre}`);
        
      } catch (error) {
        console.error(`❌ Error creando horarios para ${sede.nombre}:`, error.message);
      }
    }
    
    console.log(`\n🎉 ¡Proceso completado exitosamente!`);
    console.log(`📊 Resumen:`);
    console.log(`   Sedes creadas: ${sedesCreadas.length}`);
    console.log(`   Horarios creados: ${totalHorariosCreados}`);
    
    // Mostrar información detallada
    console.log(`\n📋 Detalles de las sedes:`);
    for (const sede of sedesCreadas) {
      const horarios = await HorarioSede.count({ where: { sedeId: sede.id } });
      console.log(`   ${sede.nombre} (${sede.ciudad}): ${horarios} horarios`);
    }
    
    // Mostrar ejemplo de horario semanal
    if (sedesCreadas.length > 0) {
      console.log(`\n📅 Ejemplo de horario semanal para ${sedesCreadas[0].nombre}:`);
      const horarioSemanal = await horarioSedeLogic.obtenerHorarioSemanal(sedesCreadas[0].id);
      
      Object.entries(horarioSemanal).forEach(([dia, info]) => {
        if (info.horarios.length > 0) {
          const horario = info.horarios[0];
          console.log(`   ${dia}: ${horario.horaEntrada} - ${horario.horaSalida} (${horario.horasJornada}h)`);
        }
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al poblar sedes y horarios:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  poblarSedesYHorarios();
}

module.exports = poblarSedesYHorarios; 