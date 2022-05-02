import styled from 'styled-components';

export const PopupContainer = styled.div`
  position: relative;
  z-index: 1;
  background-color: #F6F6F8;
  border-radius: 6px;
  overflow: hidden;
  width: ${props => props.width || 'unset'};
  max-width: ${props => props.maxWidth || 'unset'};
`;


export const Content = styled.div`
  flex: 1;
  flex-grow: 0;
`;

export const Body = styled.div`
  padding: 0px ${({ padding = '50px' }) => padding};
  ${({ verticalScroll }) => verticalScroll && 'overflow-y: auto;'}
  min-height: 200px;
  vertical-align: middle;
  display: flex;
  justify-content: center;
  flex-direction: column;

  @media screen and (max-width: 600px) {
    padding: 0 14px;
  }
`;

