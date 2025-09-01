const axios = require('axios');

// Configuración
const BASE_URL = 'http://localhost:3000';
const FECHA_TEST = '2024-01-15'; // Cambia esta fecha según tus datos

async function testRegistrosPorFecha() {
  try {
    console.log(`🧪 Probando endpoint: GET /api/registros/fecha/${FECHA_TEST}`);
    console.log('=' .repeat(60));
    
    const response = await axios.get(`${BASE_URL}/api/registros/fecha/${FECHA_TEST}`);
    
    console.log('✅ Respuesta exitosa:');
    console.log(`📅 Fecha consultada: ${response.data.fecha}`);
    console.log(`👥 Total usuarios: ${response.data.totalesGenerales.totalUsuarios}`);
    console.log(`📊 Total registros: ${response.data.totalesGenerales.totalRegistros}`);
    console.log(`⏰ Total horas extra: ${response.data.totalesGenerales.totalHorasExtra}`);
    console.log(`💰 Total bono salarial: ${response.data.totalesGenerales.totalBonoSalarial}`);
    
    console.log('\n👤 Registros por usuario:');
    Object.entries(response.data.registrosPorUsuario).forEach(([usuarioId, usuario]) => {
      console.log(`\n  Usuario ID: ${usuarioId}`);
      console.log(`  📧 Email: ${usuario.email}`);
      console.log(`  👤 Nombre: ${usuario.nombre} ${usuario.apellido}`);
      console.log(`  📊 Total registros: ${usuario.totales.totalRegistros}`);
      console.log(`  ⏰ Total horas extra: ${usuario.totales.totalHorasExtra}`);
      console.log(`  💰 Total bono: ${usuario.totales.totalBonoSalarial}`);
      
      if (usuario.registros.length > 0) {
        console.log(`  📝 Registros:`);
        usuario.registros.forEach((registro, index) => {
          console.log(`    ${index + 1}. ${registro.horaIngreso} - ${registro.horaSalida} | ${registro.ubicacion} | ${registro.cantidadHorasExtra}h`);
        });
      }
    });
    
    console.log('\n📋 Lista completa de registros:');
    response.data.registros.forEach((registro, index) => {
      console.log(`  ${index + 1}. [${registro.usuarioId}] ${registro.fecha} | ${registro.horaIngreso}-${registro.horaSalida} | ${registro.ubicacion} | ${registro.cantidadHorasExtra}h | ${registro.estado}`);
    });
    
  } catch (error) {
    console.error('❌ Error en la prueba:');
    if (error.response) {
      console.error(`  Status: ${error.response.status}`);
      console.error(`  Data:`, error.response.data);
    } else {
      console.error(`  Error: ${error.message}`);
    }
  }
}

// Ejecutar prueba
testRegistrosPorFecha();
