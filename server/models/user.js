module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING,
      field: 'last_name',
    },
    phoneNumber: {
      type: DataTypes.STRING,
      field: 'phone_number',
      unique: true,
      allowNull: false,
    },
    refreshTokenId: {
      type: DataTypes.STRING,
      field: 'refresh_token_id',
    },
    avatar: {
      type: DataTypes.STRING,
      field: 'avatar',
    },
    email: {
      type: DataTypes.STRING,
      field: 'email',
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    active: {
      type: DataTypes.BOOLEAN,
      field: 'active',
    },
  }, {
    paranoid: true,
  });

  return User;
};
