const replaceEnum = require('sequelize-replace-enum-postgres').default;

module.exports = {
  up: async (queryInterface) => Promise.all([
    replaceEnum({
      queryInterface,
      tableName: 'rides',
      columnName: 'state',
      defaultValue: 'creating',
      newValues: ['creating', 'active', 'completed', 'canceled', 'rejected', 'pending'],
      enumName: 'enum_rides_state',
    }),
  ]),
  down: async (queryInterface) => Promise.all([
    replaceEnum({
      queryInterface,
      tableName: 'rides',
      columnName: 'state',
      defaultValue: 'creating',
      newValues: ['creating', 'active', 'completed', 'canceled', 'rejected', 'pending'],
      enumName: 'enum_rides_state',
    }),
  ]),
};
