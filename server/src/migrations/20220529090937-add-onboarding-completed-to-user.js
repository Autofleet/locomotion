module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'did_complete_onboarding', { type: Sequelize.BOOLEAN });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'did_complete_onboarding');
  },
};

