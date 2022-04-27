import styled from 'styled-components';

export const IconContainer = styled.View`
    margin: ${({ margin }) => (margin ? `${margin}` : '0')};
    vertical-align: middle;
    width: ${({ width }) => (width ? `${width}` : '16px')};
    height: ${({ height }) => (height ? `${height}` : '16px')};
`;
