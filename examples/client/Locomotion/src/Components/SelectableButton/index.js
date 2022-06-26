import React, { useEffect, useState } from 'react';
import propsTypes from 'prop-types';
import Loader from '../Loader';
import { ButtonTextContainer, StyledButton, SubmitButtonText } from './styled';

const RoundedButton = ({
  onPress,
  style,
  selected,
  ...props
}) => (
  <StyledButton
    {...props}
    onPress={onPress}
    selected={selected}
    style={style}
  >
    <ButtonTextContainer selected={selected}>
      <SubmitButtonText selected={selected}>
        {props.children}
      </SubmitButtonText>

    </ButtonTextContainer>
  </StyledButton>
);

RoundedButton.defaultProps = {
  selected: false,
};

RoundedButton.propTypes = {
  selected: propsTypes.bool,
};

export default RoundedButton;
