import moment from 'moment';
import { DEFAULT_INVITE_EXPIRE_TIME_HOURS } from '../../models/Invite/index.model';
import { Invite } from '../../models';

export const getInvite = (id) => Invite.findOne({
  where: {
    id,
  },
});

export const confirmInvite = async (invite: Invite, user) => {
  const now: Date = new Date();
  const operationSettings: any = {}; // TODO user.operationId to get settings

  const expireTime = operationSettings.inviteExpireTime || DEFAULT_INVITE_EXPIRE_TIME_HOURS;
  if (moment(invite.sentAt).add(expireTime, 'hours').isAfter(now)) {
    invite.update({ approvedAt: now });
    user.update({ isEmailVerified: true });
    return user;
  }
  return false;
};
