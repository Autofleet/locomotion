module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('invites', {
      id: {
        type: Sequelize.UUID,
        field: 'id',
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      user_id: {
        type: Sequelize.UUID,
      },
      sent_at: {
        type: Sequelize.DATE,
      },
      approved_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    }, {
      paranoid: true,
    });
  },
  down: (queryInterface) => queryInterface.dropTable('invites'),
};
