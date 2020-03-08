const _ = require('lodash');

module.exports = (sequelize, DataTypes) => {
  const states = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    CANCELED: 'canceled',
    REJECTED: 'rejected',
  };

  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rideId: {
      type: DataTypes.UUID,
      field: 'ride_id',
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      field: 'user_id',
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      field: 'type',
      allowNull: false,
    },
    state: {
      type: DataTypes.ENUM(_.values(states)),
      defaultValue: 'pending',
    },
    content: {
      type: DataTypes.JSON,
      field: 'content',
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },

  }, {
    tableName: 'notifications',
  });

  Notification.STATES = states;

  return Notification;
};
