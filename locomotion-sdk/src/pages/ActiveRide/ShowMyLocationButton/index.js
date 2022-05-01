import React from 'react';
import styled from 'styled-components';
import BaseButton from '../../../Components/ButtonBase';

const Sight = styled.Image`
  height: 50px;
  width: 50px;
`;


export default styled(({ displayButton, onPress }) => (
  displayButton ? (
    <BaseButton onPress={onPress} data-test-id='MyLocationButton'>
      <Sight source={require('../../../assets/center_btn.png')} resizeMode="contain" />
    </BaseButton>
  ) : null
))`
`;
