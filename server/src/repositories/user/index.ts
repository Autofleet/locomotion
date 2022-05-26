import { User } from '../../models';

export const findOrCreate = (phoneNumber: string, operationId: string): Promise<[User, boolean]> => User.scope('userScope').findOrCreate({
  where: { phoneNumber, operationId },
  defaults: { phoneNumber, operationId },
});

export const find = (id: string): Promise<User> => User.scope('userScope').findByPk(id);

export const findAll = (ids: string[] | null = null): Promise<User[]> => {
  const options = ids ? {
    where: {
      id: ids,
    },
  } : {};
  return User.scope('userScope').findAll(options);
};
export const findByRefreshTokenId = (refreshTokenId: string): Promise<User> => User.scope('userScope').findOne({
  where: {
    refreshTokenId,
  },
});

export const findByPhoneNumber = (phoneNumber: string): Promise<User> => User.scope('userScope').findOne({
  where: {
    phoneNumber,
  },
});

export const create = (data): Promise<User> => User.create(data);

export const update = async (id, data): Promise<User> => {
  const user = await User.scope('userScope').findByPk(id);
  return user.update(data);
};

export const destroy = (id: string): Promise<number> => User.scope('userScope').destroy({
  where: {
    id,
  },
});
