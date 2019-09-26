
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('rides', 'number_of_passenger', Sequelize.INTEGER),
  down: queryInterface => queryInterface.removeColumn('rides', 'number_of_passenger'),
};
