import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import { TouchableOpacity } from 'react-native-gesture-handler';
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

} from './styled';
import { RidePageContext } from '../../context/newRideContext';
import Loader from '../../Components/Loader';

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
      }
    } else {
      setIsLoading(false);
      clearCancellationReasons();
    }
  }, [isVisible]);

  const onCancellationReasonClick = async (id: string) => {
    setIsLoading(true);
    await updateRide(ride?.id, {
      cancellationReasonId: id,
    });
    onSubmit();
  };

  return (
    <Modal isVisible={isVisible}>
      <Container>
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
