import React, { useEffect, useContext } from 'react';
import SvgIcon from '../SvgIcon';
import {
  ContentContainer,
  Header, SubText, TextContainer, ToastContainer, ToastImage, IconContainer, Footer, FooterButton, FooterButtonText,
} from './styled';
import i18n from '../../I18n';

interface AFToastProps {
    text1: string;
    text2: string;
    props: any;
    onPress: () => void
    onHide: () => void
}
const AFToast = ({
  text1, text2, props, onPress,
}: AFToastProps) => (
  <ToastContainer noBackground activeOpacity={1} onPress={onPress}>
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
    <Footer>
      <FooterButton>
        <FooterButtonText onPress={props.onButtonClick}>
          {props.buttonText}
        </FooterButtonText>
      </FooterButton>
    </Footer>
  </ToastContainer>
);
export default AFToast;
