import React, { useContext } from 'react';
import moment from 'moment';
import { MAIN_ROUTES } from '../../routes';
import i18n from '../../../I18n';
import * as NavigationService from '../../../services/navigation';
import { messageProps, MessagesContext } from '../../../context/messages';
import {
  CardContainer,
  MessageDate,
  MessageFooter,
  MessageText,
  MessageTitle,
  ReadMoreText,
  ReadSymbol,
  ReadSymbolContainer,
  TextContainer,
} from './styled';
import { getFormattedMessageDate } from '../../../context/messages/utils';

interface MessageCardProps {
    message: messageProps;
  }

const MessageCard = ({ message }: MessageCardProps) => {
  const { setViewingMessage } = useContext(MessagesContext);
  const { isRead } = message;
  const readMoreText = i18n.t('messages.readMore');
  return (
    <CardContainer
      noBackground
      onPress={() => {
        setViewingMessage(message);
        NavigationService.navigate(MAIN_ROUTES.MESSAGE_VIEW);
      }}
      isRead={isRead}
    >
      <ReadSymbolContainer>
        {!isRead && <ReadSymbol />}
      </ReadSymbolContainer>
      <TextContainer>
        <MessageTitle numberOfLines={2}>
          {message.title}
        </MessageTitle>
        <MessageText numberOfLines={3}>
          {message.subTitle}
        </MessageText>
        <MessageFooter>
          <MessageDate>
            {getFormattedMessageDate(message)}
          </MessageDate>
          <ReadMoreText>
            {readMoreText}
          </ReadMoreText>
        </MessageFooter>
      </TextContainer>
    </CardContainer>
  );
};


export default MessageCard;
