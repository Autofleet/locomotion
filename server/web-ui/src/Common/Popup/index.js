import React from 'react';
import ReactModal from 'react-modal';
import propsTypes from 'prop-types';
import getPopup from '../../popups';

import styles from './index.scss';

import styled, {css} from 'styled-components';

const Test = styled(ReactModal)`
  &.ReactModal__Overlay {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    background-color: transparentize(rgb(255, 0, 0), 0.1);
  }

&.ReactModal__Content {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  max-width: 900px;


  @media screen and (max-width: 600px) {
    width: calc(100vw - 24px);
  }
}

`;


console.log('srtyles', styles);

const Popup = ({
  name,
  closeOnBackdropPress,
  closeOnEsc,
  isVisible,
  onClose,
  ...props
}) => {
  const Content = getPopup(name);

  return (
    <Test
      overlayClassName="xxx"
      className="uy"
      style={{ alignItems: 'center' }}
      backdropOpacity={0.85}
      shouldCloseOnOverlayClick={closeOnBackdropPress}
      shouldCloseOnEsc={closeOnEsc}
      isOpen={isVisible}
      onRequestClose={onClose}
      ariaHideApp={false}
    >
      <Content
      // TODO : change to onclose
        onCancel={onClose}
        {...props}
      />
    </Test>
  );
};

export default Popup;

Popup.defaultProps = {
  name: '',
  isVisible: false,
  closeOnBackdropPress: true,
  closeOnEsc: true,
  onClose: () => null,
};

Popup.propTypes = {
  name: propsTypes.string,
  isVisible: propsTypes.bool,
  closeOnBackdropPress: propsTypes.bool,
  closeOnEsc: propsTypes.bool,
  onClose: propsTypes.func,
};
