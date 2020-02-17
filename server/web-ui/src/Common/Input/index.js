import React from 'react';
import PropTypes from 'prop-types';

import OriginalPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import styled from 'styled-components';

const borderStyles = `
  border-radius: 4px;
  border: solid 1px #dedede;
`;

const hoverStyles = `
  background-color: #ffffff;
  &:hover, &:focus, &:active, &.isActive {
    background-color: #ffffff;
  }
`;

export const Input = styled.input`
  line-height: normal;
  font-family: 'Montserrat', sans-serif;
  -webkit-font-smoothing: antialiased;

  cursor: pointer;

  display: block;
  width: 100%;
  height: ${({ height }) => height}px;
  border: none;
  font-size: .8125rem;
  flex: 1;
  color: #333;
  background-color: #ffffff;
  &:focus {
    color: #000;
  }
  &::placeholder {
    font-size: .8125rem;
    color: rgba(92, 92, 92, 0.5);
  }

  ${({ withHover }) => withHover && hoverStyles}

  ${({ withBorder }) => withBorder && borderStyles}

  ${({ withPadding }) => withPadding && 'padding: 0 20px;'}
`;


Input.defaultProps = { // eslint-disable-line
  withBorder: false,
  withHover: false,
  withPadding: true,
  height: 40,
};

const CompoundInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  input {
    flex: 1 1 auto;
  }

  ${({ withHover }) => withHover && hoverStyles}

  ${({ withBorder }) => withBorder && borderStyles}
`;


const InputRightContainer = styled.div`
  margin-right: 16px;
  opacity: 0.3;

  input:active + & {
    opacity: 1;
  }
  input:focus + & {
    opacity: 0.5;
  }
`;

export const CompoundInput = ({
  withBorder,
  withHover,
  componentLeft,
  componentRight,
  ...props
}) => (
  <CompoundInputContainer {...{ withBorder, withHover }}>
    {componentLeft}
    <Input
      {...props}
      withBorder={false}
      withHover={false}
    />
    <InputRightContainer>{componentRight}</InputRightContainer>
  </CompoundInputContainer>
);

CompoundInput.propTypes = {
  withBorder: PropTypes.bool,
  withHover: PropTypes.bool,
  componentLeft: PropTypes.node,
  componentRight: PropTypes.node,
};

CompoundInput.defaultProps = {
  withBorder: true,
  withHover: true,
  componentLeft: null,
  componentRight: null,
};

export const PhoneInputDiv = styled.div`
  .react-tel-input > input.form-control {
    ${({ isRounded }) => (console.log({ isRounded }) || !isRounded ? `
      line-height: normal;
      font-family: 'Montserrat',sans-serif;
      -webkit-font-smoothing: antialiased;
      cursor: pointer;
      display: block;
      width: 100%;
      height: 40px;
      border: none;
      font-size: .8125rem;
      -webkit-flex: 1;
      -ms-flex: 1;
      flex: 1;
      color: #333;
      background-color: #ffffff;
      background-color: #ffffff;
      border-radius: 4px;
      border: solid 1px #dedede;
      padding: 0 20px 0px 45px;
    ` : `
      line-height: normal;
      font-family: Montserrat, sans-serif;
      -webkit-font-smoothing: antialiased;
      display: block;
      height: 40px;
      font-size: 0.8125rem;
      color: rgb(51, 51, 51);
      flex: 1 1 0%;
      border-width: 1px;
      border-style: solid;
      border-color: rgb(222, 222, 222);
      border-image: initial;
      width: 100%;
      padding: 0 55px;
      background-color: transparent;
      cursor: pointer;
      border-radius: 20px;
    `)}
  }

  .react-tel-input > div.flag-dropdown {
    ${({ isRounded }) => (!isRounded ? `
    ` : `
      border-radius: 20px 0px 0px 20px;
      padding-left: 5px;
    `)}
  }

  ${({ isRounded }) => (isRounded ? `
    .react-tel-input .flag-dropdown.open .selected-flag {
      background: rgba(0,0,0,0) !important;
    }
    
    .react-tel-input .flag-dropdown,
    .react-tel-input .flag-dropdown .selected-flag {
      background: rgba(0,0,0,0) !important;
    }
    ` :
    '')}

    .react-tel-input .country-list {
      width: 220px !important;
    }
`;
const DEF_COUNTRY_CODE = 'gb';

export const PhoneInput = props =>
  (
    <PhoneInputDiv>
      <OriginalPhoneInput country={DEF_COUNTRY_CODE} {...props} />
    </PhoneInputDiv>
  );

export const RoundedPhoneInput = props =>
  (
    <PhoneInputDiv isRounded>
      <OriginalPhoneInput autoFormat={false} country={DEF_COUNTRY_CODE} {...props} />
    </PhoneInputDiv>
  );
