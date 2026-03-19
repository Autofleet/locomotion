import React from 'react';
import propTypes from 'prop-types';

interface SvgIconProps {
  Svg: any;
  stroke?: string | null;
  fill?: string | null;
  width?: number | string;
  height?: number | string;
  style?: any;
}

function SvgIcon({
  Svg,
  stroke = null,
  fill = null,
  width = 20,
  height = 20,
  style = {},
}: SvgIconProps) {
  return (
    <Svg
      width={width}
      height={height}
      stroke={stroke}
      fill={fill}
      style={style}
    />
  );
}

export default SvgIcon;
