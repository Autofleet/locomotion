import React from 'react';
import propTypes from 'prop-types';
import { IconContainer } from './styled';

const SvgIcon = ({
  Svg,
  stroke,
  fill,
  width,
  height,
  margin,
  onPress,
  style,
}) => (
  <Svg
    width={width}
    height={height}
    stroke={stroke}
    fill={fill}
    style={style}
  />
);

export default SvgIcon;

SvgIcon.defaultProps = {
  svg: '',
  stroke: null,
  fill: null,
  width: 20,
  height: 20,
  margin: null,
  onPress: undefined,
  style: {},
};

SvgIcon.propTypes = {
  svg: propTypes.string,
  stroke: propTypes.string,
  fill: propTypes.string,
  width: propTypes.number,
  height: propTypes.number,
  margin: propTypes.string,
  onPress: propTypes.func,
  style: propTypes.object,
};
