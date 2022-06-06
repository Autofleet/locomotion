import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Header from './Header';
import Footer from './Footer';
import { PopupContainer, Content, Body } from './styled';

const ErrorImage = styled.img`margin: auto;
padding-top: 50px;`;

const PopupDialog = ({
  width,
  padding,
  maxWidth,
  title,
  children,
  onCancel,
  submitDisable,
  onSubmit,
  closeButtonTitle,
  submitButtonTitle,
  verticalScroll,
  centeredFooter,
  type,
  displaySubmitLoader,
}) => {
  const handleSubmit = () => {
    if (submitDisable) {
      return;
    }
    onSubmit();
  };
  return (
    <PopupContainer {...{ width, maxWidth }}>
      <Header>
        {title}
      </Header>
      <Body padding={padding} {...{ verticalScroll }} >
        <Content>
          {type === 'error' ?
            <ErrorImage alt="" src="https://res.cloudinary.com/autofleet/image/upload/v1533651669/Control-Center/error.png" />
            : undefined}

          {children}
        </Content>
      </Body>
      <Footer
        centered={centeredFooter}
        onSubmit={handleSubmit}
        redButtons={type === 'delete' || type === 'error'}
        {
          ...{
            closeButtonTitle,
            submitButtonTitle,
            onCancel,
            onSubmit,
            submitDisable,
            displaySubmitLoader,
          }
        }
      />
    </PopupContainer>
  );
};

export default PopupDialog;

PopupDialog.defaultProps = {
  title: '',
  children: false,
  width: '',
  padding: undefined,
  maxWidth: '',
  submitDisable: false,
  closeButtonTitle: '',
  submitButtonTitle: '',
  onCancel: () => null,
  onSubmit: () => null,
  verticalScroll: false,
  centeredFooter: false,
  type: null,
  displaySubmitLoader: false,
};

PopupDialog.propTypes = {
  title: PropTypes.string,
  width: PropTypes.string,
  padding: PropTypes.string,
  maxWidth: PropTypes.string,
  children: PropTypes.node,
  submitDisable: PropTypes.bool,
  closeButtonTitle: PropTypes.string,
  submitButtonTitle: PropTypes.string,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  verticalScroll: PropTypes.bool,
  centeredFooter: PropTypes.bool,
  type: PropTypes.string,
  displaySubmitLoader: PropTypes.bool,
};
