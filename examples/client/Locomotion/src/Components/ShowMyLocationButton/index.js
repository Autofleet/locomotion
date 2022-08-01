import React from 'react';
import styled from 'styled-components';
import Button from '../Button';
import icon from '../../assets/center_btn.png';

const Sight = styled.Image`
  height: 50px;
  width: 50px;
`;

const DisplayButton = styled(Button)`
  background-color: ${({ theme }) => theme.pageBackgroundColor};
  border-radius: 8px;
  shadow-offset: 0px 0px;
  shadow-color: #04214f;
  shadow-opacity: 0.4;
`;

export default styled(({ displayButton, onPress }) => (
  displayButton ? (
    <DisplayButton onPress={onPress} testID="MyLocationButton">
      <Sight source={icon} resizeMode="contain" />
    </DisplayButton>
  ) : null
))`
`;
