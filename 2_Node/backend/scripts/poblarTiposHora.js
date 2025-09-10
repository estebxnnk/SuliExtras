const { sequelize } = require('../configDb/db');
const Hora = require('../models/Hora');

// Catálogo completo de tipos de hora basado en la imagen proporcionada
const TIPOS_HORA = [
  {
    tipo: 'H.E.D.',
    denominacion: 'Hora Extra Diurna',
    valor: 1.25,
    descripcion: 'Hora extra trabajada en horario diurno (06:00 - 22:00)'
  },
  {
    tipo: 'H.E.N.',
    denominacion: 'Hora Extra Nocturna',
    valor: 1.75,
    descripcion: 'Hora extra trabajada en horario nocturno (22:00 - 06:00)'
  },
  {
    tipo: 'H.E.F.D.',
    denominacion: 'Hora Extra Festiva Diurna',
    valor: 2.0,
    descripcion: 'Hora extra trabajada en día festivo durante horario diurno'
  },
  {
    tipo: 'H.E.F.N.',
    denominacion: 'Hora Extra Festiva Nocturna',
    valor: 2.5,
    descripcion: 'Hora extra trabajada en día festivo durante horario nocturno'
  },
  {
    tipo: 'R.NOC.',
    denominacion: 'Recargo Nocturno',
    valor: 1.35,
    descripcion: 'Recargo por trabajo en horario nocturno (22:00 - 06:00)'
  },
  {
    tipo: 'R.F.',
    denominacion: 'Recargo Festivo',
    valor: 1.75,
    descripcion: 'Recargo por trabajo en día festivo durante horario diurno'
  },
  {
    tipo: 'R.F.NOC.',
    denominacion: 'Recargo Festivo Nocturno',
    valor: 2.1,
    descripcion: 'Recargo por trabajo en día festivo durante horario nocturno'
  }
];

async function poblarTiposHora() {
  try {
    console.log('🔗 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa');
    
    // Sincronizar modelos
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados');
    
    // Limpiar datos existentes de tipos de hora
    await Hora.destroy({ where: {} });
    console.log('🧹 Tipos de hora anteriores eliminados');
    
    // Crear tipos de hora
    const tiposCreados = [];
    for (const tipoData of TIPOS_HORA) {
      const tipo = await Hora.create(tipoData);
      tiposCreados.push(tipo);
      console.log(`✅ Tipo de hora creado: ${tipo.tipo} - ${tipo.denominacion} (${tipo.valor * 100}%)`);
    }
    
    console.log(`\n🎉 ¡Proceso completado exitosamente!`);
    console.log(`📊 Total de tipos de hora creados: ${tiposCreados.length}`);
    
    // Mostrar resumen
    console.log(`\n📋 Catálogo de tipos de hora:`);
    for (const tipo of tiposCreados) {
      console.log(`   ${tipo.tipo.padEnd(10)} | ${tipo.denominacion.padEnd(30)} | ${(tipo.valor * 100).toString().padStart(5)}%`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al poblar tipos de hora:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  poblarTiposHora();
}

module.exports = poblarTiposHora;
