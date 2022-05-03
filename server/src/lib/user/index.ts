import { User } from '../../models';

const Sequelize = require('sequelize');
const { User } = require('../../models');

const { Op } = Sequelize;

const UserService = {
  async find(id) {
    console.log(User.findByPk);
    return User.findByPk(id);
  },
  async list(ids: Array<string> | null = null) {
    console.log(ids);

    const options = ids ? {
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    } : {};
    return User.findAll(options);
  },
  async findByRefreshTokenId(refreshTokenId: string) {
    return User.findOne({
      where: {
        refreshTokenId,
      },
    });
  },

  async findByPhoneNumber(phoneNumber: string) {
    return User.findAll({
      where: {
        phoneNumber,
      },
    });
  },

  async create(data) {
    const newData = { ...data };
    console.log(newData);
    return User.create(newData);
  },

  async update(id, data) {
    const user = await User.findByPk(id);
    return user.update(data);
  },
  async destroy(id) {
    const res = await User.destroy({
      where: {
        id,
      },
    });

    return res;
  },

};

export default UserService;
