module.exports = (sequelize, DataTypes) => {
  const Verification = sequelize.define('Verification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      field: 'phone_number',
    },
    externalCode: {
      type: DataTypes.STRING,
      field: 'external_code',
    },
  });
  return Verification;
};
