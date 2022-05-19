module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'email_verified', { type: Sequelize.BOOLEAN });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'email_verified');
  },
};
