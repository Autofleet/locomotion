module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'email', Sequelize.STRING);
    await queryInterface.addColumn('users', 'active', Sequelize.BOOLEAN);
    await queryInterface.addIndex('users', ['email'], { type: 'UNIQUE' });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'email');
    await queryInterface.removeColumn('users', 'active');
    await queryInterface.removeIndex('users', ['email']);
  },
};
