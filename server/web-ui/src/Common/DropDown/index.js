import React from 'react';
import Select from 'react-select';
import styled from 'styled-components';

const colors = {
  blue: '#1482fd',
  black: '#414141',
  grey: '#afafaf',
  darkGrey: '#dedede',
};
const fontSize = '12px';
const defaultLineHeight = '36px';
const lineHeight = ({ height }) => (height || defaultLineHeight);
const optionLineHeight = ({ optionHeight }) => (optionHeight || defaultLineHeight);
const borderRadius = '0 0 3px 3px';

const selectPrefix = ({ classNamePrefix }) => classNamePrefix;
const optionsTextColor = ({ optionsColor }) => (colors[optionsColor] || colors.black);
const selectedBorderColor = ({ themeColor }) => (colors[themeColor] || colors.grey);

const StyledSelect = styled(Select)`
  .${selectPrefix}__control--is-focused {
    border-color: ${selectedBorderColor};
  }
  .${selectPrefix}__single-value {
    color: ${optionsTextColor};
    font-weight: 500;
  }
  .${selectPrefix}__option {
    height: ${optionLineHeight};
  }
  .${selectPrefix}__menu-list {
    padding-bottom: 0px;
    border-radius: ${borderRadius};
    padding-top: 7px;
  }
  .${selectPrefix}__menu {
    margin-top: -3px;
    border: 1px solid;
    border-radius: ${borderRadius};
    border-color: ${selectedBorderColor};
    box-shadow: 0 0 0 0, 0 4px 11px hsla(0,0%,0%,0.1);
    border-top: 0;
    font-size: ${fontSize};
  }
  .${selectPrefix}__control {
    &:hover {
      border-color: ${selectedBorderColor};
    }
    /* min-height: ${lineHeight};
    height: ${lineHeight}; */
    font-size: ${fontSize};
    box-shadow: none;
    border-color: ${selectedBorderColor};
  }
  .${selectPrefix}__control--is-focused {
    border-color: ${selectedBorderColor};
  }
  .${selectPrefix}__indicator {
    &:hover {
      color: ${selectedBorderColor}
    }
    color: ${optionsTextColor}
  }
  .${selectPrefix}__indicator-separator {
    display: none;
  }

  .${selectPrefix}__indicators {
    height: ${lineHeight};
  }
`;

export const FormGroup = styled.label`
    position: relative;
    width: 100%;
    margin-top: ${({marginTop}) => marginTop ? marginTop : '0px'};
    display: block;

    &:first-of-type {
      margin-top: 0;
    }
    ${({ disabled }) => disabled && 'opacity: 0.3'};
  `;


export const FormGroupLabel = styled.span`
    display: block;
    margin-bottom: 6px;
    opacity: 0.7;
    line-height: 1;
    font-size: .8125rem;
    color: rgba(51, 51, 51, 0.7);
  `;

export const InputGroup = styled.div`
    position: relative;
  `;

export const ErrorMessage = styled.span`
    display: block;
    width: 100%;
    font-size: .75rem;
    color: #f03a5f;
    height: 15px;
    margin-top: 10px;
    text-align: center;
  `;

const popupErrorMessageStyle = (errorAlign) => ({
  textAlign: errorAlign || 'right',
});

export default props => (
<FormGroup
    htmlFor={props.inputId}
  >
    <FormGroupLabel>{props.label}</FormGroupLabel>
    <InputGroup>
      <StyledSelect classNamePrefix="afDD" {...props} />
      <ErrorMessage style={popupErrorMessageStyle(props.errorMessageAlignment)}>
        {props.errorMessage}
      </ErrorMessage>

    </InputGroup>
  </FormGroup>



);
