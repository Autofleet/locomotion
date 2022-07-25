import React from 'react';
import { Dimensions, View } from 'react-native';
import styled from 'styled-components';

type OverlayProps = {
    bottomSheetHeight: number
}

const Overlay = styled(View)<OverlayProps>`
width: 100%;
height: ${({ bottomSheetHeight }) => Dimensions.get('window').height - bottomSheetHeight};
background-color: #333;
opacity: 0.7;
z-index: 999;
position: absolute;
`;

const BlackOverlay = ({ bottomSheetHeight }: OverlayProps) => <Overlay bottomSheetHeight={bottomSheetHeight} />;

export default BlackOverlay;
