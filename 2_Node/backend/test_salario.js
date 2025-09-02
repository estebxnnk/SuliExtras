const { sequelize } = require('./configDb/db');
const Persona = require('./models/Persona');
const User = require('./models/User');

async function testSalario() {
  try {
    console.log('🔍 Probando el campo salario...');
    
    // Buscar una persona existente
    const persona = await Persona.findOne();
    if (!persona) {
      console.log('❌ No se encontraron personas en la base de datos');
      return;
    }
    
    console.log('👤 Persona encontrada:', {
      id: persona.id,
      nombres: persona.nombres,
      apellidos: persona.apellidos,
      salario_actual: persona.salario
    });
    
    // Actualizar el salario
    const nuevoSalario = 2500000.50;
    console.log(`💰 Actualizando salario a: ${nuevoSalario}`);
    
    await persona.update({ salario: nuevoSalario });
    
    // Verificar que se guardó
    await persona.reload();
    console.log('✅ Salario actualizado:', {
      id: persona.id,
      salario: persona.salario,
      tipo: typeof persona.salario
    });
    
    // Probar con diferentes valores
    const valoresPrueba = [1500000, 3000000.75, 0.01, 99999999.99];
    
    for (const valor of valoresPrueba) {
      await persona.update({ salario: valor });
      await persona.reload();
      console.log(`✅ Valor ${valor} guardado como: ${persona.salario} (tipo: ${typeof persona.salario})`);
    }
    
    console.log('🎉 Prueba completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await sequelize.close();
  }
}

testSalario();

