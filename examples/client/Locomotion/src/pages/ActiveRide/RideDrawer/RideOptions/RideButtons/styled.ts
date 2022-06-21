import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styled from 'styled-components';

export const Container = styled(View)`
    margin: 0px 15px;
    display: flex;
    height: 90px;
`;

export const RowContainer = styled(View)`
    flex-direction: row;
    justify-content: space-between;
    flex: 1;
    margin-bottom: 5px;
`;

export const ButtonContainer = styled(View)`
    flex-direction: row;
    border: 1px solid #f1f2f6;
    padding: 0 10px;
    border-radius: 8px;
    align-items: center;
    flex: 1;
    margin: 3px;
    height: 100%;
`;

export const TouchableOpacityContainer = styled(TouchableOpacity)`
    flex-direction: row;
    align-items: center;
`;