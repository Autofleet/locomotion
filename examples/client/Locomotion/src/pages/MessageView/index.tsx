import React, {
  Fragment,
  useContext, useEffect, useRef, useState,
} from 'react';
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
import { getMessage } from '../../context/messages/api';
import Button from '../../Components/Button';
import { LINK_BLUE_COLOR, FONT_SIZES } from '../../context/theme';
import arrow from '../../assets/chevron.svg';
import Loader from '../../Components/Loader';

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
  const [message, setMessage] = useState(null);

  const loadMessage = async (messageId) => {
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
