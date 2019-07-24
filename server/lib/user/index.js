const Sequelize = require('sequelize');
const { User } = require('../../models');


const { Op } = Sequelize;

const UserService = {
  async find(id) {
    return User.findById(id);
  },
  async list(ids) {
    return User.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
  },
  async findByRefreshTokenId(refreshTokenId) {
    return User.findOne({
      where: {
        refreshTokenId,
      },
    });
  },

  async findByPhoneNumber(phoneNumber) {
    return User.findAll({
      where: {
        phoneNumber,
      },
    });
  },

  async create(data) {
    const newData = { ...data };
    return User.create(newData);
  },

  async update(id, data) {
    const user = await User.findById(id);
    return user.update(data);
  },
  async destroy(id) {
    const res = await User.destroy({
      where: {
        id,
        state: 'offline',
      },
    });

    return res;
  },

};

module.exports = UserService;
