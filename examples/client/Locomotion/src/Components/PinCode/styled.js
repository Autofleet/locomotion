import styled from 'styled-components';

export const Container = styled.View`
  flex-direction: row;
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 300px;

  
  margin: 0 auto 50px auto;
`;

export const Box = styled.View`
  padding-right: 0px;
  align-items: center;
  width: 50px;
  background-color: ${({ first }) => (first ? 'red' : '#f6f6f8')};
  margin-right: 8px;
  margin-left: 8px;
  margin-top: 15px;
`;

export const DigitInput = styled.TextInput`
  background-color: #ffffff;
  width: 50px;
  height: 50px;
  border-color: #dedede;
  text-align: center;
  border-width: 1px;
  border-radius: 2px;
`;
