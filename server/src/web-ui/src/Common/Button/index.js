import React from 'react';
import propsTypes from 'prop-types';
import Loader from '../../Common/Loader';

const Button = ({
  title,
  className,
  ...props
}) => (
  <button {...props} className={`${className}`}>{props.displayLoader ? <Loader isDark={props.darkLoader} /> : title }</button>
);

export default Button;

Button.defaultProps = {
  title: '',
  className: '',
  onClick: () => null,
  displayLoader: false,
  darkLoader: false,
};

Button.propTypes = {
  title: propsTypes.string,
  className: propsTypes.string,
  onClick: propsTypes.func,
  displayLoader: propsTypes.bool,
  darkLoader: propsTypes.bool,
};
