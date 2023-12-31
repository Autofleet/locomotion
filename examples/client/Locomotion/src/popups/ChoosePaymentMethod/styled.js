import { View, ScrollView } from 'react-native';
import styled from 'styled-components';
import RoundedButton from '../../Components/RoundedButton';
import Button from '../../Components/Button';
import { TextArea } from '../../Components/TextArea';
import { FONT_SIZES, FONT_WEIGHTS } from '../../context/theme';

export const SelectButton = styled(RoundedButton)`
  margin: 10px;
`;

export const CloseButton = styled(Button)`
  flex: 2;
  height: 30;
  align-items: center;
  justify-content: center;
`;

export const CardsScrollView = styled(ScrollView)`
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
  flex: 10;
  color: var(--gray-05, #212229);
  /* Body strong - Mobile */
  font-family: Montserrat;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px; /* 150% */
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
