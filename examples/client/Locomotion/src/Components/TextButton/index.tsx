import React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS, LINK_BLUE_COLOR } from '../../context/theme';
import Button from '../Button';

export const Container = styled(Button)`
`;

export const ButtonText = styled(Text)`
color: ${LINK_BLUE_COLOR}
${FONT_SIZES.H3}
${FONT_WEIGHTS.REGULAR}
`;

interface Props {
    onPress: () => void;
    text: string;
}

const TextButton = ({ onPress, text }: Props) => (
  <Container noBackground onPress={onPress}>
    <ButtonText>
      {text}
    </ButtonText>
  </Container>
);

export default TextButton;
