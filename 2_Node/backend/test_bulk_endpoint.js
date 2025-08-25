// Archivo de prueba para el endpoint bulk de registros
// Ejecuta este archivo para probar la funcionalidad

const testBulkEndpoint = async () => {
  const registrosSemana = [
    {
      fecha: "2024-01-15",
      horaIngreso: "18:00",
      horaSalida: "20:00",
      ubicacion: "Oficina Principal",
      cantidadHorasExtra: 2.0,
      justificacionHoraExtra: "Proyecto A - Fase crítica"
    },
    {
      fecha: "2024-01-16",
      horaIngreso: "17:30",
      horaSalida: "19:30",
      ubicacion: "Oficina Principal",
      cantidadHorasExtra: 2.0,
      justificacionHoraExtra: "Proyecto A - Revisión"
    },
    {
      fecha: "2024-01-17",
      horaIngreso: "18:00",
      horaSalida: "21:00",
      ubicacion: "Oficina Principal",
      cantidadHorasExtra: 3.0,
      justificacionHoraExtra: "Proyecto A - Implementación"
    },
    {
      fecha: "2024-01-18",
      horaIngreso: "19:00",
      horaSalida: "22:00",
      ubicacion: "Oficina Principal",
      cantidadHorasExtra: 3.0,
      justificacionHoraExtra: "Proyecto A - Testing"
    }
  ];

  try {
    console.log('🚀 Probando endpoint bulk...');
    console.log('📊 Enviando', registrosSemana.length, 'registros');
    
    const response = await fetch('http://localhost:3000/api/registros/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        registros: registrosSemana,
        usuarioId: 1  // Cambia este ID por uno válido de tu base de datos
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Éxito!');
      console.log('📝 Mensaje:', result.message);
      console.log('🔢 Total creados:', result.total);
      console.log('📋 Registros:', JSON.stringify(result.registros, null, 2));
    } else {
      console.log('❌ Error:', result.error);
    }
    
  } catch (error) {
    console.error('💥 Error de conexión:', error.message);
  }
};

// Ejecutar la prueba
console.log('🧪 Iniciando prueba del endpoint bulk...');
testBulkEndpoint();

// También puedes usar curl desde la terminal:
console.log('\n📋 Comando curl equivalente:');
console.log('curl -X POST http://localhost:3000/api/registros/bulk \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"registros":[{"fecha":"2024-01-15","horaIngreso":"18:00","horaSalida":"20:00","ubicacion":"Oficina","cantidadHorasExtra":2.0,"justificacionHoraExtra":"Test"}],"usuarioId":1}\'');
