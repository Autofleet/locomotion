import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { View } from 'react-native';
import CloseButton from '../../Components/CloseButton';
import CancellationReasonsProvider, { CancellationReasonsContext } from '../../context/cancellation-reasons';
import RoundedButton from '../../Components/RoundedButton';
import { SubTitle, Title } from '../styled';
import i18n from '../../I18n';
import {
  Container,
  LoaderContainer,
  BodyContainer,
  CancellationReasonCard,
  CancellationReasonText,
  CloseButtonContainer,
} from './styled';
import { RidePageContext } from '../../context/newRideContext';
import Loader from '../../Components/Loader';
import Mixpanel from '../../services/Mixpanel';

interface CancellationReasonsProps {
  isVisible: boolean;
  onCancel: any;
  onSubmit: any;
}

const CancellationReasonsPopup = ({
  isVisible,
  onCancel,
  onSubmit,
}: CancellationReasonsProps) => {
  const { cancellationReasons, clearCancellationReasons } = useContext(CancellationReasonsContext);
  const { updateRide, ride } = useContext(RidePageContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isVisible) {
      if (!cancellationReasons
      || cancellationReasons.length === 0) {
        onCancel();
        Mixpanel.setEvent('No cancellation reasons in the popup', {
          state: ride.state,
          rideId: ride.id,
        });
      } else {
        Mixpanel.setEvent('Cancellation reasons popup showed', {
          state: ride.state,
          rideId: ride.id,
          cancellationReasonIds: cancellationReasons.map(cr => cr.id),
        });
      }
    } else {
      setIsLoading(false);
      clearCancellationReasons();
    }
  }, [isVisible]);

  const onCancellationReasonClick = async (id: string) => {
    setIsLoading(true);
    Mixpanel.clickEvent('Cancellation reasons clicked', {
      cancellationReasonId: id,
      state: ride.state,
      rideId: ride.id,
    });
    await updateRide(ride?.id, {
      cancellationReasonId: id,
    });
    onSubmit();
  };

  return (
    <Modal isVisible={isVisible}>

      <Container>
        <CloseButtonContainer>
          <CloseButton onPress={onCancel} />
        </CloseButtonContainer>
        <Title>{i18n.t('popups.cancellationReasons.title')}</Title>
        <SubTitle>{i18n.t('popups.cancellationReasons.subTitle')}</SubTitle>
        <BodyContainer>
          {isLoading
            ? (
              <LoaderContainer>
                <Loader
                  dark
                  lottieViewStyle={{
                    height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center',
                  }}
                  sourceProp={undefined}
                />
              </LoaderContainer>
            )
            : cancellationReasons.map(cr => (
              <TouchableOpacity activeOpacity={1} onPress={() => onCancellationReasonClick(cr.id)}>
                <CancellationReasonCard key={cr.id}>
                  <CancellationReasonText>
                    {cr.value}
                  </CancellationReasonText>
                </CancellationReasonCard>
              </TouchableOpacity>
            ))}
        </BodyContainer>
      </Container>
    </Modal>
  );
};

export default CancellationReasonsPopup;
