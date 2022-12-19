import { View, ScrollView, Text } from 'react-native';
import styled from 'styled-components';
import RoundedButton from '../../Components/RoundedButton';
import Button from '../../Components/Button';
import { TextArea } from '../../Components/TextArea';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';
import { Start } from '../../lib/text-direction';

export const SelectButton = styled(RoundedButton)`
  margin: 10px;
`;

export const CloseButton = styled(Button)`
  flex: 2;
  height: 30;
  align-items: center;
  justify-content: center;
`;

export const ItemsScrollView = styled(ScrollView)`
  max-height: 400px;
  margin-bottom: 50px;
`;

export const TitleView = styled.View`
  display: flex;
  padding: 0px 20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 20px 0px;
`;

export const SummaryContainer = styled.View`
  flex: 1;
  flex-shrink: 1;
  max-height: 450px;
  background-color: white;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  border-color: rgba(0, 0, 0, 0.1);
  max-height: 450px;
`;

export const Title = styled.Text`
  ${FONT_SIZES.H2}
  color: black;
  ${FONT_WEIGHTS.SEMI_BOLD};
  flex: 10;
`;

export const StyledTextArea = styled(TextArea)`
  margin-bottom: 20px;
`;

export const Container = styled(View)`
  flex: 1;
  text-align: left;
  width: 100%;
`;

export const Footer = styled(View)`
position: absolute;
bottom: 0px;
margin: 0 20px;
`;


export const ItemInnerContainer = styled(View)`
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  align-items: center;
  padding: 0 15px;
`;

export const ItemContainer = styled(View)`
  background-color: ${({ selected }) => (selected ? '#rgba(36, 170, 242, 0.2)' : '#fff')};
  min-height: 50px;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  align-items: center;

`;
const margin = `margin-${Start()}`;

export const ItemTextContainer = styled(Text)`
  justify-content: center;
  ${margin}: 16px;
  width: 80%;
`;
