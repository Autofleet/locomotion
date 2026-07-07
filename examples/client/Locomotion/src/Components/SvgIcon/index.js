import React from 'react';
import propTypes from 'prop-types';

const SvgIcon = ({
  Svg,
  stroke,
  fill,
  color,
  width,
  height,
  style,
}) => (
  <Svg
    width={width}
    height={height}
    stroke={stroke}
    fill={fill}
    color={color}
    style={style}
  />
);

export default SvgIcon;

SvgIcon.defaultProps = {
  svg: '',
  stroke: null,
  fill: null,
  color: undefined,
  width: 20,
  height: 20,
  style: {},
};

SvgIcon.propTypes = {
  svg: propTypes.string,
  stroke: propTypes.string,
  fill: propTypes.string,
  color: propTypes.string,
  width: propTypes.number,
  height: propTypes.number,
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
};
