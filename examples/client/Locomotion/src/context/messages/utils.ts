import moment from 'moment';
import { messageProps } from '.';
import i18n from '../../I18n';

export const getFormattedMessageDate = (message: messageProps) => {
  if (moment().diff(moment(message.sentAt), 'minutes') <= 5) {
    return i18n.t('messages.now');
  }
  if (moment().diff(moment(message.sentAt), 'weeks') < 1) {
    return moment(message.sentAt).format('dddd, h:mm A');
  }
  return moment(message.sentAt).format('MMMM DD, YYYY');
};
