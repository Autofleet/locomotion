module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('rides', 'arriving_push', { type: Sequelize.DATE });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('rides', 'arriving_push');
  },
};
