import React from 'react';
import { Dimensions, View } from 'react-native';
import styled from 'styled-components';

const Overlay = styled(View)`
width: 100%;
height: ${Dimensions.get('window').height};
background-color: #333;
opacity: 0.7;
z-index: 10;
position: absolute;
`;

const BlackOverlay = () => <Overlay />;

export default BlackOverlay;
