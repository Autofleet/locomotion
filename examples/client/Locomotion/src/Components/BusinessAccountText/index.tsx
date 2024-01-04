import React from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components';

const TitleWithSubTitle = styled(View)`
  display: flex;
  flex-direction: column;
  flex: 1 0 0;
`;
const BaseText = styled(Text)`
color: #212229;
font-family: Montserrat;
font-size: 14px;
font-style: normal;
line-height: 20px;
`;
const SubTitle = styled(BaseText)`
font-weight: 500;
`;
const BoldTitle = styled(BaseText)`
font-weight: 700;
`;
interface BusinessAccountTextProps {
    title: string;
    subTitle: string;
}
const BusinessAccountText = ({
  title, subTitle,
} : BusinessAccountTextProps) => (
  <TitleWithSubTitle>
    <BoldTitle numberOfLines={1}>{title}</BoldTitle>
    <SubTitle numberOfLines={1}>{subTitle}</SubTitle>
  </TitleWithSubTitle>
);

export default BusinessAccountText;
