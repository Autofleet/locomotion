import React from 'react';
import propTypes from 'prop-types';

const SvgIcon = (props) => {
  const {
    Svg,
    stroke = null,
    fill = null,
    color = undefined,
    width = 20,
    height = 20,
    style = {},
  } = props;
  return (
    <Svg
      width={width}
      height={height}
      stroke={stroke}
      fill={fill}
      color={color}
      style={style}
    />
  );
};

export default SvgIcon;

SvgIcon.propTypes = {
  svg: propTypes.string,
  stroke: propTypes.string,
  fill: propTypes.string,
  color: propTypes.string,
  width: propTypes.number,
  height: propTypes.number,
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
};
