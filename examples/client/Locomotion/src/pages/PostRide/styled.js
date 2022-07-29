import { View } from 'react-native';
import styled from 'styled-components';


export const SummaryStarsTitle = styled.Text`
  font-size: 20px;
  color: black;
  font-weight: 500;
  margin-bottom: 25px;
  text-align: center;
`;

export const SummaryStars = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px 45px;
  justify-content: center;
`;

export const StarIcon = styled.Image(({ isOn, theme }) => `
  padding: 10px 20px;
  display: flex;
  height: 30px;
  width: 30px;
  ${isOn ? `
    tint-color: ${theme.primaryColor};
    opacity: 0.7;
  ` : `
    tint-color: transparent;
    opacity: 0.4;
  `}
`);

export const PageContent = styled(View)`
    width: 100%;
    height: 100%;
    padding: 0px;
    display: flex;
    flex-direction: column;
`;


export const RatingContainer = styled(View)`
  padding: 25px 0px;
  border-bottom-width: 1px ;
  border-bottom-color: #e2e2e2;
  justify-content: space-between;
`;


export const TipsContainer = styled(View)`
  padding: 10px 20px 0px 20px;
  flex: 1;
`;

export const SubmitContainer = styled(View)`
  padding: 0px 30px;
  max-height: 120px;
  flex: 1;
`;
