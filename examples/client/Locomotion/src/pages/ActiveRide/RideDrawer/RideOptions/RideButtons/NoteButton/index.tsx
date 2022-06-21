import React from 'react';
import { Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styled from 'styled-components';
import SvgIcon from '../../../../../../Components/SvgIcon';
import { FONT_SIZES, FONT_WEIGHTS } from '../../../../../../context/theme';

const TimeText = styled(Text)`
    ${FONT_SIZES.LARGE}
    ${FONT_WEIGHTS.REGULAR}
    /* color: ${({ theme }) => theme.disabledColor}; */
    margin: 5px;
`;

interface NoteButtonProps {
    icon: string;
    title: string;
    onPress: Function;
}

const NoteButton = ({
    icon,
    title,
    onPress
}: NoteButtonProps) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <SvgIcon stroke="#24aaf2" fill="#24aaf2" Svg={icon} height={15} width={15} />
            <TimeText>{title}</TimeText>
        </TouchableOpacity>
    )
};

export default NoteButton;