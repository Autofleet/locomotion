module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('notifications', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      ride_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      state: {
        type: Sequelize.ENUM('pending', 'completed', 'canceled', 'rejected'),
        defaultValue: 'pending',
      },
      content: {
        type: Sequelize.JSON,
      },
      created_at: {
        type: Sequelize.DATE,
      },
      updated_at: {
        type: Sequelize.DATE,
      },

    });
    await queryInterface.addConstraint('notifications', ['ride_id', 'user_id', 'type'], { type: 'UNIQUE' });
  },
  down: queryInterface => queryInterface.dropTable('notifications'),
};
