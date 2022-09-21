import React, { useContext } from 'react';
import styled from 'styled-components';
import { ScrollView } from 'react-native-gesture-handler';
import { MAIN_ROUTES } from '../routes';
import PageHeader from '../../Components/PageHeader';
import { ContentContainer, PageContainer } from '../styles';
import { RideStateContextContext } from '../..';
import { RidePageContext } from '../../context/newRideContext';
import i18n from '../../I18n';
import { BS_PAGES } from '../../context/ridePageStateContext/utils';
import * as NavigationService from '../../services/navigation';
import { MessagesContext } from '../../context/messages';
import MessageCard from './MessageCard';

const ScrollContainer = styled(ScrollView)``;

interface FutureRidesViewProps {
    menuSide: 'right' | 'left';
  }

const Messages = ({ menuSide }: FutureRidesViewProps) => {
  const { changeBsPage } = useContext(RideStateContextContext);
  const { userMessages } = useContext(MessagesContext);
  const { ride } = useContext(RidePageContext);

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
      <ScrollContainer>
        {(userMessages || []).map(message => (
          <MessageCard
            message={message}
          />
        ))}
      </ScrollContainer>
    </PageContainer>
  );
};


export default Messages;
