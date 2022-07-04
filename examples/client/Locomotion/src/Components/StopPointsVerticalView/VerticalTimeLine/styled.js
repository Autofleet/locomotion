import styled from 'styled-components';

export const FlexContainer = styled.View`
  display: flex;
  flex-direction: row;
`;

export const TextFlexContainer = styled.View`
  flex: 1;
  padding-left: 25px;
`;

export const MainContainer = styled.View`
  display: flex;
  flex-direction: row;
`;

export const TimeLineContent = styled(FlexContainer)`
  flex: 1;
  padding: 5px;
  borderBottomWidth: ${({ last }) => (last ? '0' : '1')}px;
  borderBottomColor: #dedede;
  borderStyle: solid;
`;

export const Content = styled(FlexContainer)`
  flex: 5;
  align-self: center;
  flex-direction: column;
`;

export const EtaContent = styled(FlexContainer)`
  flex: 1;
  align-self: center;
  justify-content: flex-end;
`;

export const TimeLineContainer = styled(FlexContainer)`
  flex-direction: column;
`;

export const BaseTimeLine = styled.View`
  width: 2px;
  margin-left: 7px;
`;

export const BottomTimeLine = styled(BaseTimeLine)`
  padding-top: 12px;
  ${({ last }) => `${last ? '' : `
    borderLeftWidth: 1px;
    borderLeftColor: #474747;
    borderStyle: solid;
  `}`}
`;

export const TopTimeLine = styled(BaseTimeLine)`
  height: 16px;
  padding-top: 20px;
  ${({ first }) => `${first ? '' : `
    borderLeftWidth: 1px;
    borderLeftColor: #474747;
    borderStyle: solid;
  `}`}
`;

export const MarkerContiner = styled.View`
  z-index: 999;
  position: relative;
  left: -${({ first, last }) => (first ? '8' : `${last ? '8' : '10'}`)}px;
  top: -20px;
`;
