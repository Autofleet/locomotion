import React from 'react';
import styled from 'styled-components';
import Button from '../../../Components/Button';

const Sight = styled.Image`
  height: 50px;
  width: 50px;
`;
const DisplayButton = styled(Button)`
  background-color: unset;
`;

export default styled(({ displayButton, onPress }) => (
  displayButton ? (
    <DisplayButton onPress={onPress} data-test-id="MyLocationButton">
      <Sight source={require('../../../assets/center_btn.png')} resizeMode="contain" />
    </DisplayButton>
  ) : null
))`
`;
