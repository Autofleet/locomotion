module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'push_user_id', Sequelize.STRING);
    await queryInterface.addColumn('users', 'push_token', Sequelize.STRING);
    await queryInterface.addColumn('users', 'device_type', Sequelize.STRING);
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'push_user_id');
    await queryInterface.removeColumn('users', 'push_token');
    await queryInterface.removeColumn('users', 'device_type');
  },
};
