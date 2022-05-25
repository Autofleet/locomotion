module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'is_email_verified', { type: Sequelize.BOOLEAN });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'is_email_verified');
  },
};
