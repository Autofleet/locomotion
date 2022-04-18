module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('time_slots', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    operation_id: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    timezone: {
      type: Sequelize.STRING,
    },
    day_in_week: {
      type: Sequelize.INTEGER,
    },
    start_time: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    end_time: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    deleted_at: {
      allowNull: true,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface) => queryInterface.dropTable('time_slots'),
};
