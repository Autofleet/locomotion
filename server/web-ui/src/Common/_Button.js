import React from 'react';
import styled from 'styled-components';

export default styled.button`
  padding: 0;
  border: none;
  cursor: pointer;
  height: 40px;
  margin-top: 42px;
  border-radius: 20px;
  background-color: #ffffff;
  box-shadow: 4px 2.9px 8px 0 rgba(85, 195, 255, 0.3);
  font-size: 15.3px;
  font-weight: 500;
  color: #333333;

&:hover, &:focus {
    box-shadow: 4px 2.9px 8px 0 rgba(85, 195, 255, 0.3);
    border: solid 1px transparent;
    background-origin: border-box;
    background-clip: content-box, border-box;
  }
`;
