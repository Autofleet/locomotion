import React from 'react';
import {
  View,
  Image,
} from 'react-native';

import {MessageContainer, MessageText,MessageTitle,CloseContainer,ResetInputIcon} from './styled'
export default ({
    title, subTitle, onClose
  }) => {
      return (
        <MessageContainer>
            <CloseContainer>
                <ResetInputIcon />
            </CloseContainer>
            <View style={{ flex: 2, textAlign: 'left', maxWidth: '80%' }}>
              <MessageTitle>{title}</MessageTitle>
              <MessageText>{subTitle}</MessageText>
            </View>
        </MessageContainer>);
  }
