import React from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';
import { IconContainer } from './styled';

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
  stroke: ${stroke};
  fill: ${fill};
  `;
  return (
    <IconContainer
      onPress={onPress}
      disabled={!onPress}
      width={width}
      height={height}
      margin={margin}
      noBg
    >
      <Icon />
    </IconContainer>
  );
};

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
