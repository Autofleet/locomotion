module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'did_complete_onboarding', { type: Sequelize.BOOLEAN });
    await queryInterface.bulkUpdate('users', { did_complete_onboarding: true });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'did_complete_onboarding');
  },
};