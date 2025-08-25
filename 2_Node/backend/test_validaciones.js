// Archivo de prueba para las validaciones del endpoint bulk
// Este archivo demuestra diferentes escenarios de validación

const testValidaciones = async () => {
  const baseUrl = 'http://localhost:3000/api/registros/bulk';
  
  console.log('🧪 Probando validaciones del endpoint bulk...\n');

  // Test 1: Datos válidos
  console.log('✅ Test 1: Datos válidos');
  await testEndpoint(baseUrl, {
    usuarioId: 1,
    registros: [
      {
        fecha: "2024-01-15",
        horaIngreso: "18:00",
        horaSalida: "20:00",
        ubicacion: "Oficina Principal",
        cantidadHorasExtra: 2.0,
        justificacionHoraExtra: "Proyecto A"
      }
    ]
  });

  // Test 2: Fecha inválida
  console.log('\n❌ Test 2: Fecha inválida');
  await testEndpoint(baseUrl, {
    usuarioId: 1,
    registros: [
      {
        fecha: "15-01-2024", // Formato inválido
        horaIngreso: "18:00",
        horaSalida: "20:00",
        ubicacion: "Oficina",
        cantidadHorasExtra: 2.0
      }
    ]
  });

  // Test 3: Hora inválida
  console.log('\n❌ Test 3: Hora inválida');
  await testEndpoint(baseUrl, {
    usuarioId: 1,
    registros: [
      {
        fecha: "2024-01-15",
        horaIngreso: "25:00", // Hora inválida
        horaSalida: "20:00",
        ubicacion: "Oficina",
        cantidadHorasExtra: 2.0
      }
    ]
  });

  // Test 4: Hora de salida menor que entrada
  console.log('\n❌ Test 4: Hora de salida menor que entrada');
  await testEndpoint(baseUrl, {
    usuarioId: 1,
    registros: [
      {
        fecha: "2024-01-15",
        horaIngreso: "20:00",
        horaSalida: "18:00", // Hora de salida menor
        ubicacion: "Oficina",
        cantidadHorasExtra: 2.0
      }
    ]
  });

  // Test 5: Cantidad de horas extra inválida
  console.log('\n❌ Test 5: Cantidad de horas extra inválida');
  await testEndpoint(baseUrl, {
    usuarioId: 1,
    registros: [
      {
        fecha: "2024-01-15",
        horaIngreso: "18:00",
        horaSalida: "20:00",
        ubicacion: "Oficina",
        cantidadHorasExtra: -1 // Valor negativo
      }
    ]
  });

  // Test 6: Campo faltante
  console.log('\n❌ Test 6: Campo faltante');
  await testEndpoint(baseUrl, {
    usuarioId: 1,
    registros: [
      {
        fecha: "2024-01-15",
        horaIngreso: "18:00",
        // horaSalida faltante
        ubicacion: "Oficina",
        cantidadHorasExtra: 2.0
      }
    ]
  });

  // Test 7: Array vacío
  console.log('\n❌ Test 7: Array vacío');
  await testEndpoint(baseUrl, {
    usuarioId: 1,
    registros: []
  });

  // Test 8: Sin usuarioId
  console.log('\n❌ Test 8: Sin usuarioId');
  await testEndpoint(baseUrl, {
    registros: [
      {
        fecha: "2024-01-15",
        horaIngreso: "18:00",
        horaSalida: "20:00",
        ubicacion: "Oficina",
        cantidadHorasExtra: 2.0
      }
    ]
  });
};

const testEndpoint = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('   ✅ Éxito:', result.message);
    } else {
      console.log('   ❌ Error:', result.error);
      if (result.details) {
        console.log('   📋 Detalles:', result.details);
      }
    }
    
  } catch (error) {
    console.log('   💥 Error de conexión:', error.message);
  }
};

// Ejecutar las pruebas
console.log('🚀 Iniciando pruebas de validación...\n');
testValidaciones();
