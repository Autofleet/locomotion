import React, { SetStateAction, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import Modal from '../../Components/CompatModal';
import SvgIcon from '../../Components/SvgIcon';
import { SubTitle, Title } from '../styled';
import i18n from '../../I18n';
import errorIcon from '../../assets/error-icon.svg';
import XButton from '../../Components/CloseButton';

import {
  ButtonText, CloseButton, Container, TextContainer, TitleContainer, LeftSideTitle, RightSideTitle,
} from './styles';

interface GenericErrorProps {
  isVisible: boolean;
  closePopup: any | SetStateAction<boolean>;
  title?: string;
  text?: string;
  buttonText?: string;
  customButton?: any;
  cancelPopup?: any;
}

const GenericErrorPopup = ({
  isVisible,
  closePopup,
  title = '',
  text = '',
  buttonText = '',
  customButton = null,
  cancelPopup = null,
}: GenericErrorProps) => {
  useEffect(() => {
    if (isVisible && Platform.OS === 'android') {
      Alert.alert(
        title || i18n.t('popups.genericError.title'),
        text || i18n.t('popups.genericError.text'),
        [{ text: buttonText || String(i18n.t('popups.genericError.buttonText')), onPress: closePopup }],
      );
    }
  }, [isVisible]);

  if (Platform.OS === 'android') {
    return null;
  }

  return (
    <Modal isVisible={isVisible}>
      <Container>
        <TitleContainer>
          <LeftSideTitle>
            <SvgIcon Svg={errorIcon} height={20} width={20} style={{ marginRight: 5 }} />
            <Title>{title || i18n.t('popups.genericError.title')}</Title>
          </LeftSideTitle>
          <RightSideTitle>
            {cancelPopup ? (
              <XButton onPress={cancelPopup} containerStyles={{ alignSelf: 'flex-end' }} />
            ) : (null)}
          </RightSideTitle>
        </TitleContainer>
        <TextContainer>
          <SubTitle>{text || i18n.t('popups.genericError.text')}</SubTitle>
        </TextContainer>
        {customButton || (
        <CloseButton onPress={closePopup}>
          <ButtonText>
            {buttonText || String(i18n.t('popups.genericError.buttonText'))}
          </ButtonText>
        </CloseButton>
        )}
      </Container>
    </Modal>
  );
};

export default GenericErrorPopup;
