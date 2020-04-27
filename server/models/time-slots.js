

module.exports = (sequelize, DataTypes) => {
  const TimeSlot = sequelize.define('TimeSlot', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    timezone: {
      type: DataTypes.STRING,
    },
    dayInWeek: {
      type: DataTypes.INTEGER,
      field: 'day_in_week',
    },
    startTime: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'start_time',
    },
    endTime: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'end_time',
    },
  }, {
  });
  return TimeSlot;
};
