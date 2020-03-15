const _ = require('lodash');

module.exports = (sequelize, DataTypes) => {
  const states = {
    CREATING: 'creating',
    ACTIVE: 'active',
    COMPLETED: 'completed',
    CANCELED: 'canceled',
    REJECTED: 'rejected',
  };

  const Ride = sequelize.define('Ride', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      field: 'user_id',
      allowNull: false,
    },
    state: {
      type: DataTypes.ENUM(_.values(states)),
      defaultValue: 'creating',
      allowNull: false,
    },
    pickupAddress: {
      type: DataTypes.STRING,
      field: 'pickup_address',
      allowNull: false,
    },
    pickupLat: {
      type: DataTypes.DECIMAL,
      field: 'pickup_lat',
      allowNull: false,
    },
    pickupLng: {
      type: DataTypes.DECIMAL,
      field: 'pickup_lng',
      allowNull: false,
    },
    dropoffAddress: {
      type: DataTypes.STRING,
      field: 'dropoff_address',
      allowNull: false,
    },
    dropoffLat: {
      type: DataTypes.DECIMAL,
      field: 'dropoff_lat',
      allowNull: false,
    },
    dropoffLng: {
      type: DataTypes.DECIMAL,
      field: 'dropoff_lng',
      allowNull: false,
    },
    numberOfPassenger: {
      type: DataTypes.INTEGER,
      field: 'number_of_passenger',
    },
    completedAt: {
      type: DataTypes.DATE,
      field: 'completed_at',
    },
    canceledAt: {
      type: DataTypes.DATE,
      field: 'canceled_at',
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
    arrivingPush: {
      type: DataTypes.DATE,
      field: 'arriving_push',
    },
  }, {
    tableName: 'rides',
  });

  Ride.STATES = states;

  return Ride;
};
