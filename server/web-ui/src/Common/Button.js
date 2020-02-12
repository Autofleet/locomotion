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
    background-image: linear-gradient(#ffffff, #ffffff), linear-gradient(to top, #1ef5b9, #55c3ff);
    background-origin: border-box;
    background-clip: content-box, border-box;
  }

&:active {
    background-image: linear-gradient(to right, #1ef5b9, #55c3ff);
    box-shadow: 4px 2.9px 8px 0 rgba(85, 195, 255, 0.3);
    color: #ffffff;
  }
`;
