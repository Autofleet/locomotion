import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';

const Sight = styled.Image`
  height: 50px;
  width: 50px;
`;


export default styled(({ displayButton, onPress }) => (
  displayButton ? (
    <TouchableOpacity onPress={onPress}>
      <Sight source={require('../../../assets/center_btn.png')} resizeMode="contain" />
    </TouchableOpacity>
  ) : null
))`
`;
