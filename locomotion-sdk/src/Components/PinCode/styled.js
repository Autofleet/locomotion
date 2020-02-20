import styled from 'styled-components';

export const Container = styled.View`
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 300px;
  margin-bottom: 50px;
`;

export const Box = styled.View`
  padding-right: 0px;
  align-items: center;
  width: 50px;
  background-color: ${({ first }) => first ? 'red' : '#f6f6f8'};
`;

export const DigitInput = styled.TextInput`
  background-color: #ffffff;
  width: 50px;
  height: 50px;
  border-color: #dedede;
  text-align: center;
  border-width: 1;
  border-radius: 2px;
`;