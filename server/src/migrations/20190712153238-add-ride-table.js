module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('rides', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    operation_id: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.UUID,
      field: 'user_id',
    },
    state: {
      type: Sequelize.ENUM('creating', 'active', 'completed', 'canceled', 'rejected'),
      defaultValue: 'creating',
    },
    pickup_address: {
      type: Sequelize.STRING,
    },
    pickup_lat: {
      type: Sequelize.DECIMAL,
    },
    pickup_lng: {
      type: Sequelize.DECIMAL,
    },
    dropoff_address: {
      type: Sequelize.STRING,
    },
    dropoff_lat: {
      type: Sequelize.DECIMAL,
      field: 'dropoff_lat',
    },
    dropoff_lng: {
      type: Sequelize.DECIMAL,
      field: 'dropoff_lng',
    },
    completed_at: {
      type: Sequelize.DATE,
      field: 'completed_at',
    },
    canceled_at: {
      type: Sequelize.DATE,
      field: 'canceled_at',
    },
    created_at: {
      type: Sequelize.DATE,
    },
    updated_at: {
      type: Sequelize.DATE,
    },
  })
    .then(() => queryInterface.addIndex('rides', ['user_id']))
    .then(() => queryInterface.addIndex('rides', ['state'])),

  down: (queryInterface) => queryInterface.dropTable('rides'),
};
