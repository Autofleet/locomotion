import styled from 'styled-components';

const narrowScreen = 'screen and (max-width: 600px)';

export const ReactModal__Overlay = styled.css`
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  background-color: transparentize(#333, 0.1);
`;

export const ReactModal__Content = styled.css`
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  max-width: 900px;
  
  @media ${narrowScreen} {
    width: calc(100vw - 24px);
  }
`;
