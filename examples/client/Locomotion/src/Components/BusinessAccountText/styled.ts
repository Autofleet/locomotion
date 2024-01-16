import { Text, View } from 'react-native';
import styled from 'styled-components';

export const TitleWithSubTitle = styled(View)`
  display: flex;
  flex-direction: column;
  flex: 1 0 0;
`;
export const BaseText = styled(Text)`
color: #212229;
font-family: Montserrat;
font-size: 14px;
font-style: normal;
line-height: 20px;
`;
export const SubTitle = styled(BaseText)`
font-weight: 500;
`;
export const BoldTitle = styled(BaseText)`
font-weight: 700;
`;
