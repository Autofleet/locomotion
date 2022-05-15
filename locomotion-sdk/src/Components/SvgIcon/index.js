import React from 'react';
import propTypes from 'prop-types';
import { IconContainer } from './styled';
import styled from 'styled-components';

const SvgIcon = ({
  svg,
  stroke,
  fill,
  width,
  height,
  margin,
  onPress,
}) => {
  const Icon = styled(svg)`
  width: ${width};
  height: ${height};
  stroke: ${ stroke || '#6f6f6f'};
  fill: ${ fill || '#6f6f6f'};
  `;
  return (
  <IconContainer
    onPress={onPress}
    disabled={!onPress}
    width={width}
    height={height}
    margin={margin}
  >
    <Icon />
  </IconContainer>
)}

export default SvgIcon;

SvgIcon.defaultProps = {
  svg: '',
  stroke: null,
  fill: null,
  width: '20px',
  height: '20px',
  margin: null,
  onPress: undefined,
};

SvgIcon.propTypes = {
  svg: propTypes.string,
  stroke: propTypes.string,
  fill: propTypes.string,
  width: propTypes.string,
  height: propTypes.string,
  margin: propTypes.string,
  onPress: propTypes.func,
};
