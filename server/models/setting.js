module.exports = (sequelize, DataTypes) => {
  const Setting = sequelize.define('Setting', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    key: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    value: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    type: {
      allowNull: true,
      type: DataTypes.ENUM('string', 'number', 'json', 'boolean'),
      defaultValue: 'string',
    },
    display: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'settings',
  });
  return Setting;
};
