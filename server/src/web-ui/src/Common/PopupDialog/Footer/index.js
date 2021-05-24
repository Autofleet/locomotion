import React from 'react';
import propsTypes from 'prop-types';

import {
  Root,
  PopupButtonsContainer,
  CancelButton,
  ApplyButton,
} from './styled';

const Footer = ({
  onCancel,
  closeButtonTitle,
  submitDisable,
  onSubmit,
  submitButtonTitle,
  centered,
  redButtons,
  displaySubmitLoader,
}) => (
  <Root {...{ centered }}>
    <PopupButtonsContainer>
      {closeButtonTitle ? <CancelButton
        onClick={onCancel}
        title={closeButtonTitle}
      /> : undefined}
      <ApplyButton
        redButtons={redButtons}
        disabled={submitDisable}
        type="submit"
        data-test-id="submitPopup"
        onClick={onSubmit}
        title={submitButtonTitle}
        displayLoader={displaySubmitLoader}
      />
    </PopupButtonsContainer>
  </Root>
);

Footer.defaultProps = {
  closeButtonTitle: '',
  submitButtonTitle: '',
  onCancel: () => null,
  onSubmit: () => null,
  submitDisable: false,
  centered: false,
  redButtons: false,
  displaySubmitLoader: false,
};

Footer.propTypes = {
  closeButtonTitle: propsTypes.string,
  submitButtonTitle: propsTypes.string,
  onCancel: propsTypes.func,
  onSubmit: propsTypes.func,
  submitDisable: propsTypes.bool,
  centered: propsTypes.bool,
  redButtons: propsTypes.bool,
  displaySubmitLoader: propsTypes.bool,
};

export default Footer;
