import styled from 'styled-components';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

import { ERROR_COLOR } from '../../services/sharedStyles';

const bottomBorderStyles = `
border-bottom-color: #e2e2e2;
border-bottom-width: 1px;
`;

const fullBorderStyles = isFocused => `
backgroundColor: #f1f2f6;
borderRadius: 8px;
${isFocused && 'border: 1px solid #333333'};

`;

export const Input = styled.TextInput`
    width: 100%;
    padding: 0px 8px;
    height: 40px;
    width: ${({ width }) => (width || '100%')};
    ${({ fullBorder, isFocused }) => (fullBorder ? fullBorderStyles(isFocused) : bottomBorderStyles)}
    border-color: ${({ error }) => (error ? ERROR_COLOR : '#333333')};
    color: ${({ error }) => (error ? ERROR_COLOR : '#333333')};
`;

export const BottomSheetInput = styled(BottomSheetTextInput)`
    padding: 0px 8px;
    height: 40px;
    flex: 1;
    ${({ fullBorder, isFocused }) => (fullBorder ? fullBorderStyles(isFocused) : bottomBorderStyles)}
    border-color: ${({ error }) => (error ? ERROR_COLOR : '#333333')};
    color: ${({ error }) => (error ? ERROR_COLOR : '#333333')};
`;
