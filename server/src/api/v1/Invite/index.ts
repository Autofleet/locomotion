import { handleError, ResourceNotFoundError } from '@autofleet/errors';
import moment from 'moment';
import Router from '../../../lib/router';
import sendMail from '../../../lib/mail';
import emailTemplate from '../../../lib/mail/emailTemplate';
import logger from '../../../logger';
import { Invite } from '../../../models';
import UserService from '../../../lib/user';
import { confirmInvite, getInvite } from '../../../lib/invite';
import { DEFAULT_INVITE_EXPIRE_TIME_HOURS } from '../../../models/Invite/index.model';

const router = Router();

router.post('/:id/verify', async (req, res) => {
  const { id } = req.params;
  try {
    const invite = await getInvite(id);

    if (!invite) {
      throw new ResourceNotFoundError('Invite not found');
    }

    const { userId } = invite;
    const user = await UserService.find(userId);
    if (!user) {
      throw new ResourceNotFoundError('User not found');
    }

    const response = await confirmInvite(invite, user);
    return res.json(response);
  } catch (e) {
    return handleError(e, res);
  }
});

router.post('/send-email-verification', async (req, res) => {
  const { userId } = req.body;
  const user = await UserService.find(userId);
  if (!user) {
    throw new ResourceNotFoundError('user not found');
  }
  const newInvite = await Invite.create({ userId: user.id, sentAt: new Date() });
  try {
    const operation: any = {
      logoUri: 'http://cdn.mcauto-images-production.sendgrid.net/e99b027cf41e7516/85cbcea6-36b7-40c8-809e-0076b66f76ce/100x86.gif',
      clientName: 'autofleet',
      helpCenterUrl: 'google.com',
      termsUrl: 'google.com',
      emailPreferencesUrl: 'google.com',
      websiteUrl: 'google.com',
      displayUrl: 'autofleet.io',
      privacyUrl: 'google.com',
      companyAddress: '24 herbert st the new york',
      emailSender: 'me@autofleet.io',
    }; /* get operations settings for email info based on user operation_id */
    const expireTime = operation.inviteExpireTime || DEFAULT_INVITE_EXPIRE_TIME_HOURS;
    const expiryDate = moment(newInvite.sentAt).add(expireTime, 'hours').format('D MMMM YYYY [at] h:mm A');
    const emailHtml = emailTemplate(
      {
        inviteId: newInvite.id,
        logoUri: operation.logoUri,
        companyName: operation.clientName,
        firstName: user.firstName,
        expiryDate,
        helpCenterUrl: operation.helpCenterUrl,
        termsUrl: operation.termsUrl,
        emailPreferencesUrl: operation.emailPreferencesUrl,
        websiteUrl: operation.websiteUrl,
        displayUrl: operation.displayUrl,
        privacyUrl: operation.privacyUrl,
        companyAddress: operation.companyAddress,
      },
    );
    const subject = operation.verificationEmailSubject || `${operation.clientName} ${operation.emailSender}`;
    await sendMail(user.email, operation.emailSender, emailHtml, subject);
    return res.json({
      status: 'OK',
    });
  } catch (e) {
    logger.error(e);
    return handleError(e, res);
  }
});

export default router;
