

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.removeIndex('users', 'users_email');
    await queryInterface.sequelize.query('ALTER TABLE users DROP CONSTRAINT users_phone_number_key;');
    await queryInterface.addConstraint('users', { type: 'UNIQUE', fields: ['email', 'deleted_at'] });
    await queryInterface.addConstraint('users', { type: 'UNIQUE', fields: ['phone_number', 'deleted_at'] });
  },

  down: async (queryInterface) => {
    await queryInterface.removeIndex('users', ['phone_number', 'deleted_at'], { type: 'UNIQUE' });
    await queryInterface.removeIndex('users', ['email', 'deleted_at'], { type: 'UNIQUE' });
    await queryInterface.addIndex('users', 'users_email');
    await queryInterface.addConstraint('users', 'phone_number');
  },
};
