import React from 'react';
import styled from 'styled-components';
import { omit } from 'lodash';

import Button from '../../../Components/Button';

const RootBase = props => <footer {...omit(props, ['centered'])} />;
const ButtonBase = props => <Button {...omit(props, ['redButtons'])} />;

export const Root = styled(RootBase)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: ${({ centered }) => (centered ? 'center' : 'flex-end')};
  padding: 40px 50px;
`;

export const PopupButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  line-height: 100%;
  margin-top: 10px;
  
  button:not(:last-child) {
    margin-right: 30px;
  }
`;

const StyledButton = styled(ButtonBase)`
  font-weight: 500;
  font-size: .95625rem;
`;

export const CancelButton = styled(StyledButton)`
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 300;
  color: #464646;
`;

export const ApplyButton = styled(StyledButton)`
  min-width: 145px;
  height: 37px;
  border-radius: 4px;
  background-color: ${({ redButtons }) => (redButtons ? '#f03a5f' : '#23a0fe')};
  box-shadow: 0px 15px 29px 0 rgba(51, 70, 85, 0.24);
  padding: 0 10px;

  font-family: Montserrat;
  font-size: 14px;
  color: #ffffff;
    
  &:disabled {
    opacity: 0.3;
    color: rgba(51, 51, 51, 0.7);
  }
`;
