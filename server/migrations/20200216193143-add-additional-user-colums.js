
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'email', Sequelize.STRING);
    await queryInterface.addColumn('users', 'active', Sequelize.BOOLEAN);
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'email');
    await queryInterface.removeColumn('users', 'active');
  },
};
