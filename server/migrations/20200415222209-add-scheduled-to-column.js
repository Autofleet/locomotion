module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.addColumn(
    'rides',
    'scheduled_to',
    Sequelize.DATE,
  ),


  down: async queryInterface => queryInterface.removeColumn(
    'rides',
    'scheduled_to',
  ),

};
