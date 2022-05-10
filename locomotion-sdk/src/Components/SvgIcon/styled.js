import styled from 'styled-components';
import Button from '../Button';

export const IconContainer = styled(Button)`
    margin: ${({ margin }) => (margin ? `${margin}` : '0')};
    vertical-align: middle;
    width: ${({ width }) => (width ? `${width}` : '16px')};
    height: ${({ height }) => (height ? `${height}` : '16px')};
`;
