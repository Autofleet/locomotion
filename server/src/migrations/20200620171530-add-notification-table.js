module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('notifications', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.UUID,
      field: 'user_id',
    },
    ride_id: {
      type: Sequelize.UUID,
      field: 'ride_id',
    },
    type: {
      type: Sequelize.STRING,
      field: 'type',
    },
    created_at: {
      type: Sequelize.DATE,
    },
    updated_at: {
      type: Sequelize.DATE,
    },
  }),

  down: queryInterface => queryInterface.dropTable('notifications'),
};

