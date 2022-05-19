import moment from 'moment';
import Router from '../../../lib/router';
import sendMail from '../../../lib/mail';
import emailTemplate from '../../../lib/mail/emailTemplate';
import logger from '../../../logger';
import { Invite } from '../../../models';
import { DEFAULT_INVITE_EXPIRE_TIME_HOURS } from '../../../models/Invite/index.model';
import UserService from '../../../lib/user';

const router = Router();

router.post('/:inviteId/verify', async (req, res) => {
  const { inviteId } = req.params;
  let invite: Invite = null;
  try {
    invite = await Invite.findOne({
      where: {
        id: inviteId,
      },
    });
  } catch (e) {
    res.json({
      status: 'ERROR',
      msg: 'invite not found',
    });
    return;
  }

  if (!invite) {
    res.json({
      status: 'ERROR',
      msg: 'invite not found',
    });
    return;
  }

  const { userId } = invite;
  const user = await UserService.find(userId);
  const operationSettings: any = {}; // user.operationId to get settings
  const now: Date = new Date();

  const expireTime = operationSettings.inviteExpireTime || DEFAULT_INVITE_EXPIRE_TIME_HOURS;
  if (moment(invite.sentAt).add(expireTime, 'hours').isAfter(now)) {
    invite.update({ approvedAt: now });
    user.update({ emailVerified: true });
    res.json(user);
  } else {
    res.json({
      status: 'FAIL',
      msg: 'invitation expired',
    });
  }
});

router.post('/send-email-verification', async (req, res) => {
  const { userId } = req.body;
  const userProfile = await UserService.find(userId);
  const newInvite = await Invite.create({ userId: userProfile.id, sentAt: new Date() });
  try {
    const operation: any = {}; /* get operations settings for email info based on user operation_id */
    const emailHtml = emailTemplate(
      {
        inviteId: newInvite.id,
        logoUri: operation.logo,
        firstName: userProfile.firstName,
        supportEmail: operation.supportEmail,
        websiteUrl: operation.websiteUrl,
        displayUrl: operation.websiteDisplayUrl,
        privacyUrl: operation.privacyUrl,
      },
    );
    const subject = operation.verificationEmailSubject || `${operation.clientName} ${operation.emailSender}`;
    await sendMail(userProfile.email, operation.emailSender, emailHtml, subject);
    res.json({
      status: 'OK',
    });
  } catch (e) {
    logger.error(e);
    res.json({
      status: 'FAIL',
    });
  }
});

export default router;
