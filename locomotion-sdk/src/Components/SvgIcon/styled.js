import styled from 'styled-components';
import Button from '../Button';

export const IconContainer = styled(Button)`
    margin: ${({ margin }) => (margin ? `${margin}` : '0')};
    width: ${({ width }) => (width ? `${width}` : '16px')};
    height: ${({ height }) => (height ? `${height}` : '16px')};
    align-items: center;
    margin-top: 35%;
`;
