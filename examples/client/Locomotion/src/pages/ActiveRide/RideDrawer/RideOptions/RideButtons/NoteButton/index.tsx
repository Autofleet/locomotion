import React from 'react';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styled from 'styled-components';
import SvgIcon from '../../../../../../Components/SvgIcon';
import { FONT_SIZES, FONT_WEIGHTS } from '../../../../../../context/theme';

const TimeText = styled(Text)`
    ${FONT_SIZES.LARGE}
    ${FONT_WEIGHTS.MEDIUM}
    color: #333;
    margin: 5px;
`;

interface NoteButtonProps {
    icon: string;
    title: string;
}

const NoteButton = ({
  icon,
  title,
}: NoteButtonProps) => (
  <>
    <SvgIcon stroke="#333" Svg={icon} height={15} width={15} />
    <TimeText numberOfLines={1}>{title}</TimeText>
  </>
);

export default NoteButton;
