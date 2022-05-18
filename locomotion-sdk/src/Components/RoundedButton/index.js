import React from 'react';
import styled from 'styled-components';
import { inputHeight } from '../../assets/style-settings';
import InnerButton from './InnerButton';

const RoundedButton = styled(InnerButton)`
  width: 100%;
  height: ${inputHeight};
  background-color: white;
  margin-top: 50px;
  padding-top: 15px;
  border-radius: 2px;
`;

export default RoundedButton;
