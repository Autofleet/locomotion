import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styled from 'styled-components';

export const Container = styled(View)`
    margin: 0px 15px;
    display: flex;
`;

export const RowContainer = styled(View)`
    flex-direction: row;
    justify-content: space-between;
    flex: 1;
`;

export const ButtonContainer = styled(View)`
    flex-direction: row;
    border: 1px solid #f1f2f6;
    padding: 10px;
    border-radius: 8px;
    align-items: center;
    flex: 1;
    margin: 3px;
`;

export const TouchableOpacityContainer = styled(TouchableOpacity)`
    flex-direction: row;
    align-items: center;
`;