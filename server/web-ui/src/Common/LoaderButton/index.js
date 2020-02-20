import React from 'react';
import propsTypes from 'prop-types';
import styled from 'styled-components';
import Loader from '../Loader';

const StyledButton = styled.button`
  padding: 0;
  border: none;
  cursor: pointer;
  height: 40px;
  border-radius: 20px;
  background-color: #ffffff;
  box-shadow: 4px 2.9px 8px 0 rgba(85, 195, 255, 0.3);
  font-size: 15.3px;
  font-weight: 500;
  color: #333333;

&:hover, &:focus {
    box-shadow: 4px 2.9px 8px 0 rgba(85, 195, 255, 0.3);
    border: solid 1px transparent;
    background-origin: border-box;
    background-clip: content-box, border-box;
  }

&:active {
    box-shadow: 4px 2.9px 8px 0 rgba(85, 195, 255, 0.3);
    background-color: #f6f6f8;
  }
`;
const Button = ({
  title,
  className,
  ...props
}) => (
  <StyledButton {...props} className={className}>{props.displayLoader ? <Loader isDark={props.darkLoader} /> : title }</StyledButton>
);

export default Button;

Button.defaultProps = {
  title: '',
  onClick: () => null,
  className: undefined,
  displayLoader: false,
  darkLoader: false,
};

Button.propTypes = {
  title: propsTypes.string,
  onClick: propsTypes.func,
  className: propsTypes.string,
  displayLoader: propsTypes.bool,
  darkLoader: propsTypes.bool,
};
