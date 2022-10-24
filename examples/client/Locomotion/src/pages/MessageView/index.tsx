import React, { useContext, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ScrollView } from 'react-native-gesture-handler';
import { Linking, Text, View } from 'react-native';
import RenderHTML from 'react-native-render-html';
import SvgIcon from '../../Components/SvgIcon';
import { getFormattedMessageDate } from '../../context/messages/utils';
import { MessageDate, MessageText, MessageTitle } from '../MessagesList/MessageCard/styled';
import { MAIN_ROUTES } from '../routes';
import PageHeader from '../../Components/PageHeader';
import { PageContainer } from '../styles';
import i18n from '../../I18n';
import * as NavigationService from '../../services/navigation';
import { MessagesContext } from '../../context/messages';
import Button from '../../Components/Button';
import { LINK_BLUE_COLOR, FONT_SIZES } from '../../context/theme';
import arrow from '../../assets/chevron.svg';

const ScrollContainer = styled(ScrollView)`
padding: 25px;
width: 100%;
flex: 1;
`;

const MessageLink = styled(Button)`
flex-direction: row;
align-items: center;
`;

const LinkText = styled(Text)`
${FONT_SIZES.H3};
color: ${LINK_BLUE_COLOR};
`;

const Footer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

interface FutureRidesViewProps {
    menuSide: 'right' | 'left';
    route: any;
  }

const MessageView = ({ menuSide, route }: FutureRidesViewProps) => {
  const {
    viewingMessage: message,
    setViewingMessage,
    userMessages,
    getUserMessages,
  } = useContext(MessagesContext);

  const loadMessage = async (messageId) => {
    const messages = await getUserMessages();
    const foundMessage = messages.find(({ message: m }) => m.id === messageId);
    if (foundMessage.message) {
      setViewingMessage(foundMessage.message);
    } else {
      NavigationService.navigate(MAIN_ROUTES.MESSAGES);
    }
  };

  useEffect(() => {
    const { userMessageId, userMessage, messageId } = route.params;
    if (userMessageId) {
      setViewingMessage(userMessage);
    }

    if (messageId) {
      loadMessage(messageId);
    }


    return () => setViewingMessage(null);
  }, [route, userMessages]);

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
            {getFormattedMessageDate(message)}
          </MessageDate>
          <MessageText>
            {message.subTitle}
          </MessageText>
          <MessageText>
            {message.content}
          </MessageText>
          {!!message.html
          && (
            <RenderHTML
              source={{ html: message.html }}
            />
          )}
          {!!message.link
          && (
            <MessageLink noBackground onPress={() => message.link && Linking.openURL(message.link)}>
              <LinkText>
                {message.linkText || message.link}
              </LinkText>
              <SvgIcon Svg={arrow} stroke={LINK_BLUE_COLOR} height={15} />
            </MessageLink>
          )
        }

        </ScrollContainer>
      </PageContainer>
    );
  }
  return null;
};


export default MessageView;
