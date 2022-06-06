import React from 'react';
import styled from 'styled-components';

const IconContainer = styled.span`
    stroke: ${({ stroke }) => (stroke || '#6f6f6f')};
    margin: 0px 10px;
    cursor: pointer;
    width: ${({ width }) => (width || '16px')};
    height: ${({ height }) => (height || '16px')};
    ${({ disableClass }) => (disableClass ?
    `stroke: #dfdfdf;
       cursor: default;
      ` : '')};

    &:hover {
      stroke: ${({ disableClass }) => (disableClass ? '#dfdfdf' : 'rgb(17, 113, 219)')};
    }

    &:active {
      stroke: ${({ disableClass }) => (disableClass ? '#dfdfdf' : 'rgb(57, 153, 255)')};
    }
`;
export default ({
  svg: SvgComponent,
  stroke,
  disableClass,
  width,
  height,
  onClick,
}) => (
  <IconContainer stroke={stroke} onClick={() => onClick()} disableClass={disableClass} width={width} height={height} >
    <SvgComponent width={width} height={height} />
  </IconContainer>
);
