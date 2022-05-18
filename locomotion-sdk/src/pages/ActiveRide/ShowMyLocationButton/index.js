import React from 'react';
import styled from 'styled-components';
import Button from '../../../Components/Button';

const Sight = styled.Image`
  height: 50px;
  width: 50px;
`;


export default styled(({ displayButton, onPress }) => (
  displayButton ? (
    <Button onPress={onPress} data-test-id="MyLocationButton">
      <Sight source={require('../../../assets/center_btn.png')} resizeMode="contain" />
    </Button>
  ) : null
))`
`;
