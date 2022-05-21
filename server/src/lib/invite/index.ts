import moment from "moment";
import { BadRequest } from '@autofleet/errors';
import { DEFAULT_INVITE_EXPIRE_TIME_HOURS } from "../../models/Invite/index.model";
import { Invite } from "../../models";

export const getInvite = (id) => {
    return Invite.findOne({
        where: {
          id,
        },
      });
}

export const confirmInvite = async (invite: Invite, user) => {
    const now: Date = new Date();
    const operationSettings: any = {}; // user.operationId to get settings

    const expireTime = operationSettings.inviteExpireTime || DEFAULT_INVITE_EXPIRE_TIME_HOURS;
    if (moment(invite.sentAt).add(expireTime, 'hours').isAfter(now)) {
        invite.update({ approvedAt: now });
        user.update({ emailVerified: true });
        return user
      } else {
        throw new BadRequest([{ message: 'invitation expired' }], null);
      }
}