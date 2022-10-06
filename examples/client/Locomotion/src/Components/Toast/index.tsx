import React from 'react';
import SvgIcon from '../SvgIcon';
import {
  ContentContainer,
  Header, SubText, TextContainer, ToastContainer, ToastImage, IconContainer,
} from './styled';
import closeIcon from '../../assets/close-x.svg';

interface AFToastProps {
    text1: string;
    text2: string;
    props: any;
    onPress: () => void
    onHide: () => void
}
const AFToast = ({
  text1, text2, props, onPress, onHide,
}: AFToastProps) => (
  <ToastContainer noBackground onPress={onPress}>
    <IconContainer onPress={onHide} noBackground>
      <SvgIcon Svg={closeIcon} height={10} width={10} />
    </IconContainer>
    <ContentContainer>
      {props.image && <ToastImage resizeMode="contain" source={{ uri: props.image }} />}
      <TextContainer>
        <Header numberOfLines={2}>
          {text1}
        </Header>
        <SubText numberOfLines={3}>
          {text2}
        </SubText>
      </TextContainer>
    </ContentContainer>
  </ToastContainer>
);

export default AFToast;
