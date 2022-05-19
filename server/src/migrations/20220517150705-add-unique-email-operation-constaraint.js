module.exports = {
  up: async (queryInterface) => {
    await queryInterface.removeIndex('users', ['email', 'deleted_at'], { type: 'UNIQUE' });
    await queryInterface.addIndex('users', ['email', 'operation_id'], { type: 'UNIQUE', name: 'users_email_operation_id_where_deleted_at', where: { deleted_at: null } });
  },
  down: async (queryInterface) => {
    await queryInterface.removeIndex('users', ['email', 'operation_id'], { name: 'users_email_operation_id_where_deleted_at', where: { deleted_at: null } });
    await queryInterface.addConstraint('users', { fields: ['email', 'deleted_at'], type: 'UNIQUE' });
  },
};

