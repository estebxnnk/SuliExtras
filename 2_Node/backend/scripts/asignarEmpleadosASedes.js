const { sequelize } = require('../configDb/db');
const User = require('../models/User');
const Sede = require('../models/Sede');
const Rol = require('../models/Roles');
const Persona = require('../models/Persona');

async function asignarEmpleadosASedes() {
  try {
    console.log('🔗 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa');
    
    // Obtener todas las sedes
    const sedes = await Sede.findAll({ where: { estado: true } });
    if (sedes.length === 0) {
      console.log('⚠️  No se encontraron sedes activas');
      console.log('💡 Ejecuta primero el script de poblar sedes');
      process.exit(1);
    }
    
    console.log(`📋 Sedes disponibles: ${sedes.length}`);
    sedes.forEach(sede => {
      console.log(`   - ${sede.nombre} (${sede.ciudad})`);
    });
    
    // Obtener empleados sin sede asignada
    const empleados = await User.findAll({
      include: [
        { model: Rol, as: 'rol', where: { nombre: 'Empleado' } },
        { model: Persona, as: 'persona' }
      ],
      where: {
        sedeId: null
      }
    });
    
    if (empleados.length === 0) {
      console.log('⚠️  No se encontraron empleados sin sede asignada');
      process.exit(0);
    }
    
    console.log(`\n👥 Empleados sin sede asignada: ${empleados.length}`);
    
    // Asignar empleados a sedes de forma distribuida
    let empleadosAsignados = 0;
    
    for (let i = 0; i < empleados.length; i++) {
      const empleado = empleados[i];
      const sedeIndex = i % sedes.length; // Distribuir entre las sedes
      const sede = sedes[sedeIndex];
      
      try {
        await empleado.update({ sedeId: sede.id });
        empleadosAsignados++;
        console.log(`✅ ${empleado.persona.nombres} ${empleado.persona.apellidos} → ${sede.nombre}`);
      } catch (error) {
        console.error(`❌ Error asignando empleado ${empleado.persona.nombres}:`, error.message);
      }
    }
    
    console.log(`\n🎉 ¡Proceso completado exitosamente!`);
    console.log(`📊 Empleados asignados: ${empleadosAsignados}`);
    
    // Mostrar estadísticas por sede
    console.log(`\n📈 Distribución por sede:`);
    for (const sede of sedes) {
      const count = await User.count({
        where: { sedeId: sede.id },
        include: [{ model: Rol, as: 'rol', where: { nombre: 'Empleado' } }]
      });
      console.log(`   ${sede.nombre}: ${count} empleados`);
    }
    
    // Mostrar empleados que aún no tienen sede
    const empleadosSinSede = await User.count({
      include: [
        { model: Rol, as: 'rol', where: { nombre: 'Empleado' } }
      ],
      where: {
        sedeId: null
      }
    });
    
    if (empleadosSinSede > 0) {
      console.log(`\n⚠️  Empleados sin sede asignada: ${empleadosSinSede}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al asignar empleados a sedes:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  asignarEmpleadosASedes();
}

module.exports = asignarEmpleadosASedes; 