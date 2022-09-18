import React, { useContext } from 'react';
import moment from 'moment';
import { MAIN_ROUTES } from '../../routes';
import i18n from '../../../I18n';
import { BS_PAGES } from '../../../context/ridePageStateContext/utils';
import * as NavigationService from '../../../services/navigation';
import { messageProps } from '../../../context/messages';
import {
  CardContainer, MessageDate, MessageFooter, MessageText, MessageTitle, ReadMore, ReadMoreText, ReadSymbol, ReadSymbolContainer, TextContainer,
} from './styled';

interface MessageCardProps {
    message: messageProps;
  }

const MessageCard = ({ message }: MessageCardProps) => {
  const { isRead } = message;
  return (
    <CardContainer noBackground onPress={() => NavigationService.navigate()} isRead={isRead}>
      <ReadSymbolContainer>
        {!isRead && <ReadSymbol />}
      </ReadSymbolContainer>
      <TextContainer>
        <MessageTitle numberOfLines={2}>
          {message.title}
        </MessageTitle>
        <MessageText numberOfLines={3}>
          {message.text}
        </MessageText>
        <MessageFooter>
          <MessageDate>
            {moment(message.sentAt).format('MMMM DD, YYYY, h:mm A')}
          </MessageDate>
          <ReadMore noBackground>
            <ReadMoreText>
              {i18n.t('messages.readMore')}
            </ReadMoreText>
          </ReadMore>
        </MessageFooter>
      </TextContainer>
    </CardContainer>
  );
};


export default MessageCard;
