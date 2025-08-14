'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('horarios_sede', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      sedeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'sedes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        comment: 'ID de la sede a la que pertenece este horario',
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: 'Nombre del horario (ej: Horario Normal, Horario Nocturno)',
      },
      tipo: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'normal',
        comment: 'Tipo de horario (normal, nocturno, especial, festivo)',
      },
      diaSemana: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Día de la semana (0=Domingo, ..., 6=Sábado)',
      },
      horaEntrada: {
        type: Sequelize.TIME,
        allowNull: false,
        comment: 'Hora de entrada para este día',
      },
      horaSalida: {
        type: Sequelize.TIME,
        allowNull: false,
        comment: 'Hora de salida para este día',
      },
      horasJornada: {
        type: Sequelize.FLOAT,
        allowNull: false,
        comment: 'Horas base de la jornada (horaSalida - horaEntrada)',
      },
      horasJornadaReal: {
        type: Sequelize.FLOAT,
        allowNull: false,
        comment: 'Horas reales trabajadas (horasJornada - tiempo de almuerzo)',
      },
      tiempoAlmuerzo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 60,
        comment: 'Tiempo de almuerzo en minutos',
      },
      diasTrabajados: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5,
        comment: 'Cantidad de días trabajados en la semana para este horario',
      },
      activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Si el horario está activo',
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Descripción adicional del horario',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    // Índice único como en el modelo
    await queryInterface.addIndex('horarios_sede', ['sedeId', 'diaSemana', 'tipo'], {
      unique: true,
      name: 'ux_horarios_sede_sede_dia_tipo',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('horarios_sede');
  },
};
