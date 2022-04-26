module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('users', 'avatar', Sequelize.STRING),
  down: (queryInterface) => queryInterface.removeColumn('users', 'avatar'),
};
