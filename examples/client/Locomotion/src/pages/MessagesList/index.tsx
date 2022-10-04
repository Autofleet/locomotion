import React, {
  useContext, useState,
} from 'react';
import styled from 'styled-components';
import { ScrollView } from 'react-native-gesture-handler';
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

const ScrollContainer = styled(ScrollView)`
`;
const LoaderContainer = styled(View)`
height: 80%;
justify-content: center;
`;
interface FutureRidesViewProps {
    menuSide: 'right' | 'left';
  }

const Messages = ({ menuSide }: FutureRidesViewProps) => {
  const { changeBsPage } = useContext(RideStateContextContext);
  const { userMessages, loadUserMessages, isLoading } = useContext(MessagesContext);
  const { ride } = useContext(RidePageContext);

  const markMessagesAsRead = async () => {
    // TODO request to backend to mark all as read
  };
  useFocusEffect(
    React.useCallback(() => {
      loadUserMessages();
      markMessagesAsRead();
    }, []),
  );

  return (
    <PageContainer>
      <PageHeader
        title={i18n.t('messages.pageTitle')}
        onIconPress={() => {
          changeBsPage(ride.id ? BS_PAGES.ACTIVE_RIDE : BS_PAGES.ADDRESS_SELECTOR);
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
            {(userMessages || []).map(message => (
              <MessageCard
                message={message}
              />
            ))}
          </ScrollContainer>
        )
          }

    </PageContainer>
  );
};


export default Messages;
