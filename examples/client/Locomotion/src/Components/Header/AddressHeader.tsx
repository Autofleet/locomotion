import React, { useContext } from 'react';
import { RidePageContext } from '../../context/newRideContext';
import { ButtonHeaderView, Container, HeaderView } from './styled';
import backArrow from '../../assets/arrow-back.svg';
import SvgIcon from '../SvgIcon';
import SafeView from '../SafeView';
import StopPointsViewer from '../StopPointsViewer';

const AddressHeader = ({ backToAddress }) => {
  const { setServiceEstimations, initSps } = useContext(RidePageContext);

  const backToMap = () => {
    setServiceEstimations(null);
    initSps();
  };
  return (
  <SafeView>
      <Container>
        <ButtonHeaderView
          onPress={backToMap}
          data-test-id="goBackToAddressSelector">
          <HeaderView menuSide={'left'}>
            <SvgIcon
              Svg={backArrow}
              height={25}
              width={25} />
          </HeaderView>
        </ButtonHeaderView>
        <StopPointsViewer />
      </Container>
  </SafeView>
  );
};

export default AddressHeader;
