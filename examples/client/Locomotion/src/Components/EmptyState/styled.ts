import { Text, View } from 'react-native';
import styled from 'styled-components';

export const Container = styled(View)`
border-radius: 8px;
border: 1px dashed rgba(125, 139, 172, 0.32);
display: flex;
padding: 16px;
flex-direction: column;
justify-content: center;
align-items: center;
margin: 4px;
flex: 1 0 0;
align-self: stretch;
`;
export const Title = styled(Text)`
align-self: stretch;
color: #212229;
text-align: center;
font-family: Inter;
font-size: 14px;
font-style: normal;
font-weight: 600;
`;
export const Description = styled(Text)`
align-self: stretch;
color: #666975;
text-align: center;
font-family: Inter;
font-size: 14px;
font-style: normal;
font-weight: 400;
`;
export const TitleWithoutDescription = styled(Text)`
align-self: stretch;
color: #666975;
text-align: center;
font-family: Inter;
font-size: 14px;
font-style: normal;
font-weight: 500;
`;
