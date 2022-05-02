module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('settings', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    key: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true,
    },
    value: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    type: {
      allowNull: true,
      type: Sequelize.ENUM('string', 'number', 'json', 'boolean'),
      defaultValue: 'string',
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface) => queryInterface.dropTable('settings'),
};
