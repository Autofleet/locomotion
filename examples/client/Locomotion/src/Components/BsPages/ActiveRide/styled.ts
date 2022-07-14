import {
  Image, Text, View, TouchableOpacity,
} from 'react-native';
import styled from 'styled-components';
import { FONT_SIZES, FONT_WEIGHTS } from '../../../context/theme';

export const HALF_WIDTH = '49%';

export const TopContainer = styled(View)`
    flex-direction: row;
    width: 100%;
    height: 70px;
`;

export const VehicleDetails = styled(View)`
width: 30%;
`;

export const VehicleImage = styled(Image)`
    flex: 1;
`;

export const VehiclePlateContainer = styled(View)`
    position: absolute;
    background-color: white;
    top: 50px;
    box-shadow: 0px 5px 5px rgba(0,0,0,0.05);
    border-radius: 4px;
    width: 100%;
    align-self: center;
`;

export const VehiclePlateText = styled(Text)`
    ${FONT_SIZES.MEDIUM};
    ${FONT_WEIGHTS.REGULAR};
    opacity: 0.7;
    text-align: center;
`;

export const DriverCardContainer = styled(View)`
    width: 70%;
`;

export const StopPointTextContainer = styled(View)`
    margin-top: 10px;
    background-color: rgba(36, 170, 242, 0.05);
    width: 100%;
    height: 45px;
    border-radius: 8px;
    padding: 0px 25px;
    flex-direction: row;
    align-items: center;
`;

export const StopPointText = styled(Text)`
    ${FONT_SIZES.LARGE}
    ${FONT_WEIGHTS.REGULAR}
    flex: 4;
`;

export const StopPointsTimeContainer = styled(View)`
    flex-direction: row;
`;

export const StopPointTimeText = styled(Text)`
    color: #2dc36a;
    ${FONT_SIZES.H2}
    ${FONT_WEIGHTS.MEDIUM}
`;

export const PulseContainer = styled(View)`
    margin-right: 5px;
`;

export const StopPointsVerticalViewContainer = styled(View)`
    margin-top: 20px;
`;

export const ButtonsContainer = styled(View)`
    margin-top: 20px;
`;

export const RowContainer = styled(View)`
    flex-direction: row;
    width: 100%;
    margin-bottom: 2%;
    height: 40px;
    justify-content: space-between;
`;

export const ButtonContainer = styled(TouchableOpacity)`
    flex-direction: row;
    border: 1px solid #f1f2f6;
    border-radius: 8px;
    align-items: center;
    height: 100%;
    display: flex;
    width: ${HALF_WIDTH};
    padding: 0 15px;
    opacity: ${props => (props.disabled ? 0.5 : 1)};
`;
