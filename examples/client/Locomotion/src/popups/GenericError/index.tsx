import React, { SetStateAction } from 'react';
import Modal from 'react-native-modal';
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
  title,
  text,
  buttonText,
  customButton,
  cancelPopup,
}: GenericErrorProps) => (
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
          ) : (null)
        }
        </RightSideTitle>
      </TitleContainer>
      <TextContainer>
        <SubTitle>{text || i18n.t('popups.genericError.text')}</SubTitle>
      </TextContainer>
      {customButton || (
      <CloseButton onPress={closePopup}>
        <ButtonText>
          {buttonText || i18n.t('popups.genericError.buttonText')}
        </ButtonText>
      </CloseButton>
      )}
    </Container>
  </Modal>
);

GenericErrorPopup.defaultProps = {
  title: '',
  text: '',
  buttonText: '',
  customButton: null,
  cancelPopup: null,
};
export default GenericErrorPopup;
