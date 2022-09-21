import React, { useContext } from 'react';
import styled from 'styled-components';
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
import { MessageDate, MessageText, MessageTitle } from '../MessagesList/MessageCard/styled';
import { MAIN_ROUTES } from '../routes';
import PageHeader from '../../Components/PageHeader';
import { PageContainer } from '../styles';
import i18n from '../../I18n';
import * as NavigationService from '../../services/navigation';
import { MessagesContext } from '../../context/messages';

const ScrollContainer = styled(ScrollView)`
padding: 20px;
width: 90%;
`;

interface FutureRidesViewProps {
    menuSide: 'right' | 'left';
  }

const MessageView = ({ menuSide }: FutureRidesViewProps) => {
  const { viewingMessage: message } = useContext(MessagesContext);
  if (message) {
    return (
      <PageContainer>
        <PageHeader
          title={i18n.t('messageView.pageTitle')}
          onIconPress={() => {
            NavigationService.navigate(MAIN_ROUTES.MESSAGES);
          }}
          iconSide={menuSide}
        />
        <ScrollContainer alwaysBounceVertical={false}>
          <MessageTitle>
            {message.title}
          </MessageTitle>
          <MessageDate>
            {moment(message.sentAt).format('MMMM DD, YYYY, h:mm A')}
          </MessageDate>
          <MessageText>
            {message.text}
          </MessageText>
        </ScrollContainer>
      </PageContainer>
    );
  }
  return null;
};


export default MessageView;
