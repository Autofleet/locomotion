import React, {
  useContext, useEffect, useState, useCallback,
} from 'react';
import styled from 'styled-components';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import { View } from 'react-native';
import { MAIN_ROUTES } from '../routes';
import PageHeader from '../../Components/PageHeader';
import { PageContainer } from '../styles';
import { RideStateContextContext } from '../..';
import { RidePageContext } from '../../context/newRideContext';
import i18n from '../../I18n';
import { BS_PAGES } from '../../context/ridePageStateContext/utils';
import * as NavigationService from '../../services/navigation';
import { MessagesContext } from '../../context/messages';
import MessageCard from './MessageCard';
import Loader from '../../Components/Loader';
import { NoRidesInList } from './styled';
import { PageGenericMessage } from '../../Components/PageGenericMessage';

const ScrollContainer = styled(ScrollView)`
`;
const LoaderContainer = styled(View)`
height: 80%;
justify-content: center;
`;
interface FutureRidesViewProps {
    menuSide: 'right' | 'left';
    route: any;
  }

const Messages = ({ menuSide, route }: FutureRidesViewProps) => {
  const { changeBsPage } = useContext(RideStateContextContext);
  const {
    userMessages, loadUserMessages, isLoading, markReadMessages,
  } = useContext(MessagesContext);
  const { ride } = useContext(RidePageContext);

  const markMessagesAsRead = async () => {
    if (userMessages && userMessages.length) {
      const unreadMessages = userMessages.filter(message => !message.readAt).map(message => message.id);
      if (unreadMessages.length) {
        await markReadMessages(unreadMessages);
      }
    }
  };

  const initPage = async () => {
    await loadUserMessages();
  };

  const exitPageActions = async () => {
    await markMessagesAsRead();
    await loadUserMessages();
  };

  useFocusEffect(
    useCallback(() => {
      initPage();
    }, []),
  );

  return (
    <GestureHandlerRootView>
      <PageContainer>
        <PageHeader
          title={i18n.t('messages.pageTitle')}
          onIconPress={() => {
            exitPageActions();
            NavigationService.navigate(MAIN_ROUTES.HOME);
          }}
          iconSide={menuSide}
        />
        {isLoading
          ? (
            <LoaderContainer>
              <Loader
                sourceProp={null}
                dark
                lottieViewStyle={{
                  height: 15, width: 15,
                }}
              />
            </LoaderContainer>
          )
          : (
            <ScrollContainer>
              {userMessages && userMessages.length
                ? (userMessages || []).map(m => (
                  <MessageCard
                    {...m}
                  />
                ))
                : (
                  <PageGenericMessage
                    title={i18n.t('messages.noMessagesTitle')}
                    text={i18n.t('messages.noMessagesText')}
                  />
                )
          }
            </ScrollContainer>
          )
          }


      </PageContainer>
    </GestureHandlerRootView>
  );
};


export default Messages;
