import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import propsTypes from 'prop-types';
import Loader from '../Loader';
import { ButtonTextContainer, StyledButton, SubmitButtonText } from './styled';

const SelectableButton = ({
  onPress,
  style,
  selected,
  component,
  children,
  label,
  value,
  ...props
}) => (
  <StyledButton
    {...props}
    onPress={onPress}
    selected={selected}
    style={style}
  >
    <ButtonTextContainer selected={selected}>
      {
        children
          ? (
            <SubmitButtonText selected={selected}>
              {children}
            </SubmitButtonText>
          ) : (
            <>
              <View style={{ marginLeft: 15 }}>
                <SubmitButtonText selected={selected}>
                  {label}
                </SubmitButtonText>
              </View>
              <View style={{ marginRight: 15 }}>
                <SubmitButtonText selected={selected}>
                  {value}
                </SubmitButtonText>
              </View>
            </>
          )
    }
    </ButtonTextContainer>
  </StyledButton>
);

SelectableButton.defaultProps = {
  selected: false,
};

SelectableButton.propTypes = {
  selected: propsTypes.bool,
};

export default SelectableButton;
