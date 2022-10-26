import React, {
  Fragment,
  useContext, useEffect, useRef, useState,
} from 'react';
import styled from 'styled-components';
import { ScrollView } from 'react-native-gesture-handler';
import { Linking, Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import SvgIcon from '../../Components/SvgIcon';
import { getFormattedMessageDate } from '../../context/messages/utils';
import {
  MessageDate, MessageText, MessageTitle, MARKDOWN_TEXT_STYLE,
} from '../MessagesList/MessageCard/styled';
import { MAIN_ROUTES } from '../routes';
import PageHeader from '../../Components/PageHeader';
import { PageContainer } from '../styles';
import i18n from '../../I18n';
import * as NavigationService from '../../services/navigation';
import Button from '../../Components/Button';
import { LINK_BLUE_COLOR, FONT_SIZES } from '../../context/theme';
import arrow from '../../assets/chevron.svg';
import Loader from '../../Components/Loader';
import { MessagesContext } from '../../context/messages';

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

const LoaderContainer = styled(View)`
  justify-content: center;
  flex: 1;
`;

interface FutureRidesViewProps {
    menuSide: 'right' | 'left';
    route: any;
  }

const MessageView = ({ menuSide, route }: FutureRidesViewProps) => {
  const {
    getMessage, markReadMessages, toastMessageId, closeToast,
  } = useContext(MessagesContext);
  const [message, setMessage] = useState(null);

  const loadMessage = async (messageId: string) => {
    const fetchedMessage = await getMessage(messageId);
    if (fetchedMessage) {
      setMessage(fetchedMessage);
    } else {
      NavigationService.navigate(MAIN_ROUTES.MESSAGES);
    }
  };

  useEffect(() => {
    const { messageId } = route.params;
    if (messageId) {
      loadMessage(messageId);
    }
  }, [route]);

  useEffect(() => {
    if (message?.id === toastMessageId) {
      closeToast();
    }

    if (
      message
      && message.userMessages
      && message.userMessages.length
      && !message.userMessages[0].readAt
    ) {
      markReadMessages([message.userMessages[0].id]);
    }
  }, [message]);

  return (
    <PageContainer>
      <PageHeader
        title={i18n.t('messageView.pageTitle')}
        onIconPress={() => {
          NavigationService.navigate(MAIN_ROUTES.MESSAGES);
        }}
        iconSide={menuSide}
      />
      {message ? (
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
          {message.content
          && (
          <View style={{ marginTop: 20 }}>
            <Markdown style={{
              link: {
                textDecorationLine: 'underline',
                color: LINK_BLUE_COLOR,
              },
              text: {
                ...MARKDOWN_TEXT_STYLE,
              },
            }}
            >
              {message.content}
            </Markdown>
          </View>
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
      ) : (
        <LoaderContainer>
          <Loader
            sourceProp={null}
            dark
            lottieViewStyle={{
              height: 15, width: 15,
            }}
          />
        </LoaderContainer>
      )}
    </PageContainer>
  );
};


export default MessageView;
