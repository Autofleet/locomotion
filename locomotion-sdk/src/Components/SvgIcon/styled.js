import styled from 'styled-components';
import BaseButton from '../ButtonBase';

export const IconContainer = styled(BaseButton)`
    margin: ${({ margin }) => (margin ? `${margin}` : '0')};
    vertical-align: middle;
    width: ${({ width }) => (width ? `${width}` : '16px')};
    height: ${({ height }) => (height ? `${height}` : '16px')};
`;
