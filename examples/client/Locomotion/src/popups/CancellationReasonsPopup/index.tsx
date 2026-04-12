import React, { useContext, useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from '../../Components/CompatModal';
import CloseButton from '../../Components/CloseButton';
import { CancellationReasonsContext } from '../../context/cancellation-reasons';
import { CancellationReason } from '../../context/cancellation-reasons/interface';
import { SubTitle, Title } from '../styled';
import i18n from '../../I18n';
import {
  Container,
  LoaderContainer,
  BodyContainer,
  CancellationReasonCard,
  CancellationReasonText,
  CloseButtonContainer,
  ClickableContainer,
  SubTitleContainer,
} from './styled';
import { RidePageContext } from '../../context/newRideContext';
import Loader from '../../Components/Loader';
import Mixpanel from '../../services/Mixpanel';

interface CancellationReasonsProps {
  isVisible: boolean;
  onCancel: any;
  onSubmit: any;
  rideId: string;
}

const CancellationReasonsPopup = ({
  isVisible,
  onCancel,
  onSubmit,
  rideId,
}: CancellationReasonsProps) => {
  const { cancellationReasons, clearCancellationReasons } = useContext(CancellationReasonsContext);
  const { updateRide, ride } = useContext(RidePageContext);
  const [isLoading, setIsLoading] = useState(false);

  const rideIdToUse = rideId || ride?.id;
  useEffect(() => {
    if (isVisible) {
      if (!cancellationReasons
      || cancellationReasons.length === 0) {
        onCancel();
        Mixpanel.setEvent('No cancellation reasons in the popup', {
          state: ride?.state,
          rideId: rideIdToUse,
        });
      } else {
        Mixpanel.setEvent('Cancellation reasons popup showed', {
          state: ride?.state,
          rideId: rideIdToUse,
          cancellationReasonIds: cancellationReasons.map((cr: CancellationReason) => cr.id),
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
      state: ride?.state,
      rideId: rideIdToUse,
    });
    await updateRide(rideIdToUse, {
      cancellationReasonId: id,
    });
    onSubmit();
  };

  return (
    cancellationReasons?.length > 0 ? (
      <Modal isVisible={isVisible}>
        <Container>
          <ScrollView>
            <CloseButtonContainer>
              <CloseButton onPress={onCancel} />
            </CloseButtonContainer>
            <Title>{i18n.t('popups.cancellationReasons.title')}</Title>
            <SubTitleContainer>
              <SubTitle>{i18n.t('popups.cancellationReasons.subTitle')}</SubTitle>
            </SubTitleContainer>
            <BodyContainer testID="cancellationReasons">
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
                : (
                  cancellationReasons.map((cr: CancellationReason) => (
                    <ClickableContainer
                      onPress={() => onCancellationReasonClick(cr.id)}
                      testID={`cancellationReason-${cr.category}`}
                    >

                      <CancellationReasonCard key={cr.id}>
                        <CancellationReasonText>
                          {String(i18n.t(`cancellationReasons.${cr.value}`, cr.value))}
                        </CancellationReasonText>
                      </CancellationReasonCard>
                    </ClickableContainer>
                  ))
                )}
            </BodyContainer>
          </ScrollView>
        </Container>
      </Modal>
    ) : null
  );
};

export default CancellationReasonsPopup;
