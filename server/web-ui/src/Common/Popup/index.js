import React from 'react';
import ReactModal from 'react-modal';
import propsTypes from 'prop-types';
import getPopup from '../../Popups';
import './index.scss';

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

    <ReactModal
      overlayClassName="ReactModal__Overlay"
      className="ReactModal__Content"
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
    </ReactModal>
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
