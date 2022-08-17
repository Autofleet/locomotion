import styled from 'styled-components';

export const FlexContainer = styled.View`
  display: flex;
  flex-direction: row;
`;

export const MainContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 5px 0;
`;

export const IconContainer = styled.View`
  width: 10%;
  align-items: center;
`;

export const Content = styled(FlexContainer)`
  flex-direction: column;
  width: 65%;
`;

export const EtaContent = styled(FlexContainer)`
  justify-content: flex-end;
  width: 25%;
`;

export const TimeLineContainer = styled(FlexContainer)`
  flex-direction: column;
`;

export const Line = styled.View`
border: 1px solid #333333;
width: 1px;
height: 50%;
position: absolute;
left: 4.5%;
top: 25%;
`;
