module.exports = {
  up: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn(
      'rides',
      'deleted_at',
      Sequelize.DATE,
    ),
    queryInterface.addColumn(
      'notifications',
      'deleted_at',
      Sequelize.DATE,
    ),
    queryInterface.addColumn(
      'settings',
      'deleted_at',
      Sequelize.DATE,
    ),
    queryInterface.addColumn(
      'verifications',
      'deleted_at',
      Sequelize.DATE,
    ),
  ]),
  down: async (queryInterface) => Promise.all([
    queryInterface.removeColumn(
      'rides',
      'deleted_at',
    ),
    queryInterface.removeColumn(
      'notifications',
      'deleted_at',
    ),
    queryInterface.removeColumn(
      'settings',
      'deleted_at',
    ),
    queryInterface.removeColumn(
      'verifications',
      'deleted_at',
    ),
  ]),

};
