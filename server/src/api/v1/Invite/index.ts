import { handleError, ResourceNotFoundError } from '@autofleet/errors';
import Router from '../../../lib/router';
import sendMail from '../../../lib/mail';
import emailTemplate from '../../../lib/mail/emailTemplate';
import logger from '../../../logger';
import { Invite } from '../../../models';
import UserService from '../../../lib/user';
import { confirmInvite, getInvite } from '../../../lib/invite';

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
    res.json(response);
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
    const operation: any = {}; /* get operations settings for email info based on user operation_id */
    const emailHtml = emailTemplate(
      {
        inviteId: newInvite.id,
        logoUri: operation.logo,
        firstName: user.firstName,
        supportEmail: operation.supportEmail,
        websiteUrl: operation.websiteUrl,
        displayUrl: operation.websiteDisplayUrl,
        privacyUrl: operation.privacyUrl,
      },
    );
    const subject = operation.verificationEmailSubject || `${operation.clientName} ${operation.emailSender}`;
    await sendMail(user.email, operation.emailSender, emailHtml, subject);
    res.json({
      status: 'OK',
    });
  } catch (e) {
    logger.error(e);
    return handleError(e, res);
  }
});

export default router;
