import React, {Fragment, useEffect} from 'react';
import {
  View,
  Image,
} from 'react-native';

import {MessageContainer, MessageText,MessageTitle,CloseContainer,ResetInputIcon} from './styled'
import { getTogglePopupsState } from '../../../../context/main';

export default ({
  id, title, subTitle, closeAfter, onClose,
}) => {
  const [isPopupOpen, togglePopup] = getTogglePopupsState();
  const closePopup = () => {
    if (onClose) {
      onClose();
    }
    togglePopup(id, false);
  };
  useEffect(() => {
    if (closeAfter) {
      setTimeout(closePopup, closeAfter);
    }
  }, []);

    return (
    <Fragment>
    {isPopupOpen(id) ?
        <MessageContainer>
            <CloseContainer onPress={() => closePopup()}>
                <ResetInputIcon />
            </CloseContainer>
            <View style={{ flex: 2, textAlign: 'left', maxWidth: '80%' }}>
                <MessageTitle>{title}</MessageTitle>
                <MessageText>{subTitle}</MessageText>
            </View>
        </MessageContainer> : null}
    </Fragment>
    )
  }
