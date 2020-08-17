module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('users', {
      fields: ['email', 'deleted_at'],
      type: 'UNIQUE'
    });
    await queryInterface.addConstraint('users', {
      fields: ['phone_number', 'deleted_at'],
      type: 'UNIQUE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('users',
      ['phone_number', 'deleted_at'], {
        type: 'UNIQUE'
      });
    await queryInterface.removeIndex('users',
      ['email', 'deleted_at'], {
        type: 'UNIQUE'
      });
  },
};
