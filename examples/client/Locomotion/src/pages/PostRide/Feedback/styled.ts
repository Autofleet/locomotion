import { Text, View } from 'react-native';
import styled from 'styled-components';
import { TextArea } from '../../../Components/TextArea';
import { FONT_SIZES, FONT_WEIGHTS } from '../../../context/theme';
import { End } from '../../../lib/text-direction';

export const ActiveLabelContainer = styled(View)`
    flex-direction: row;
    align-items: center;
`;
export const ActiveWriteCommentLabel = styled(Text)`
    color: ${({ theme }) => theme.primaryColor};
    margin-left: 6px;
    ${FONT_SIZES.H3};
    ${FONT_WEIGHTS.REGULAR};
`;
export const WriteCommentContainer = styled(View)``;
export const LabelComment = styled(Text)`
    color: #989A9B;
    ${FONT_SIZES.LARGE};
    ${FONT_WEIGHTS.REGULAR};
`;
export const StyledTextArea = styled(TextArea)`
  padding: 8px;
  color: #333333;
`;
export const Container = styled(View)`
    padding: 0px 30px;
`;

export const Counter = styled(Text)`
  font-size: 16px;
  color: #1a303b56;
  text-align: ${End};
  flex: 1;
`;

export const TextAreaTopBar = styled(View)`
    flex-direction: row;
    margin-bottom: 5px;
    margin-top: 10px;
`;
