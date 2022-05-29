import MailService from '@sendgrid/mail';
import logger from '../../logger';

const SENDGRID_KEY = process.env.SENDGRID_API_KEY;
MailService.setApiKey(SENDGRID_KEY);

const sendMail = async (to: string, from: string, html: string, subject: string) => {
  logger.info(
    'Verification Email sending to new user',
    {
      subject, to, from, html,
    },
  );
  await MailService.send({
    to,
    from,
    html,
    subject,
  });

  logger.info(
    'Verification Email sent to new user',
    {
      subject, to, from, html,
    },
  );
};

export default sendMail;
