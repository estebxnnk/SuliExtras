const { sequelize } = require('../configDb/db');
const Registro = require('../models/Registro');

async function limpiarRegistros() {
  try {
    console.log('🔍 Verificando registros sin usuarioId...');
    
    // Obtener todos los registros
    const registros = await Registro.findAll();
    console.log(`📊 Total de registros encontrados: ${registros.length}`);
    
    // Mostrar registros que no tienen usuarioId
    const registrosSinUsuarioId = registros.filter(reg => !reg.usuarioId);
    console.log(`⚠️  Registros sin usuarioId: ${registrosSinUsuarioId.length}`);
    
    if (registrosSinUsuarioId.length > 0) {
      console.log('🗑️  Eliminando registros sin usuarioId...');
      
      // Eliminar registros sin usuarioId
      for (const registro of registrosSinUsuarioId) {
        console.log(`Eliminando registro ID: ${registro.id}, Usuario: ${registro.usuario}`);
        await registro.destroy();
      }
      
      console.log('✅ Registros sin usuarioId eliminados correctamente');
    } else {
      console.log('✅ No hay registros sin usuarioId');
    }
    
    // Verificar registros restantes
    const registrosRestantes = await Registro.findAll();
    console.log(`📊 Registros restantes: ${registrosRestantes.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

limpiarRegistros(); 