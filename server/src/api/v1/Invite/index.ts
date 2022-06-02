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
      return res.status(404).json({ status: 'ERROR', error: 'Invite not found' });
    }

    const { userId } = invite;
    const user = await UserService.find(userId);
    if (!user) {
      return res.status(404).json({ status: 'ERROR', error: 'User not found' });
    }

    const response = await confirmInvite(invite, user);
    if (!response) {
      return res.status(404).json({ status: 'ERROR', error: 'Invitation expired' });
    }
    return res.json({ status: 'OK', user: response });
  } catch (e) {
    return res.status(500).json({ status: 'ERROR', error: e });
  }
});

router.post('/send-email-verification', async (req, res) => {
  const { userId } = req.body;
  const user = await UserService.find(userId);
  if (!user) {
    return res.status(404).json({ status: 'ERROR', error: 'User not found' });
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
    return res.status(500).json({ status: 'ERROR', error: e });
  }
});

export default router;
