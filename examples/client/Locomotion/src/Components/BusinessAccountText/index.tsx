import React from 'react';
import { BoldTitle, SubTitle, TitleWithSubTitle } from './styled';

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
