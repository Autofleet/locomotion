import React from 'react';
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

const Input = styled.input`
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

export default Input;
