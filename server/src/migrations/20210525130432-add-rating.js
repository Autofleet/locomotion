module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('rides', 'rating', { type: Sequelize.INTEGER });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('rides', 'rating');
  },
};
