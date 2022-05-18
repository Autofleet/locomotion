import MailService from '@sendgrid/mail';
import logger from '../../logger';

const SENDGRID_KEY = process.env.SENDGRID_API_KEY || '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';
MailService.setApiKey(SENDGRID_KEY);

const SUBJECT = 'Please confirm your email address';

export default async (to: string, from: string, html: string) => {
  logger.info(
    'Verification Email sending to new user',
    {
      subject: SUBJECT, to, from, html,
    },
  );
  await MailService.send({
    to,
    from,
    html,
    subject: SUBJECT,
  });

  logger.info(
    'Verification Email sent to new user',
    {
      subject: SUBJECT, to, from, html,
    },
  );
};
