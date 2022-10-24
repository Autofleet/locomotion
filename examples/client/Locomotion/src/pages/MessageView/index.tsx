import React, { useContext, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ScrollView } from 'react-native-gesture-handler';
import { Linking, Text } from 'react-native';
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
padding: 20px;
width: 90%;
flex: 1;
`;

const MessageLink = styled(Button)`
flex-direction: row;
align-items: center;
`;

const LinkText = styled(Text)`
${FONT_SIZES.H2};
color: ${LINK_BLUE_COLOR};
`;

interface FutureRidesViewProps {
    menuSide: 'right' | 'left';
    route: any;
  }

const MessageView = ({ menuSide, route }: FutureRidesViewProps) => {
  const { viewingMessage: message, setViewingMessage } = useContext(MessagesContext);

  useEffect(() => {
    const { userMessageId, userMessage } = route.params;
    if (userMessageId) {
      setViewingMessage(userMessage);
    }
  }, [route]);

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
          <MessageText>
            {message.subTitle}
          </MessageText>
          <MessageDate>
            {getFormattedMessageDate(message)}
          </MessageDate>
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
              {message.linkDisplay || message.link}
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
