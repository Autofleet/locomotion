import React from 'react';
import {
  Header, SubText, TextContainer, ToastContainer, ToastImage,
} from './styled';

interface AFToastProps {
    text1: string;
    text2: string;
    props: any;
    onPress: () => undefined
}
const AFToast = ({
  text1, text2, props, onPress,
}: AFToastProps) => (
  <ToastContainer noBackground onPress={onPress}>
    {props.image && <ToastImage resizeMode="contain" source={{ uri: props.image }} />}
    <TextContainer>
      <Header numberOfLines={2}>
        {text1}
      </Header>
      <SubText numberOfLines={3}>
        {text2}
      </SubText>
    </TextContainer>
  </ToastContainer>
);

export default AFToast;
