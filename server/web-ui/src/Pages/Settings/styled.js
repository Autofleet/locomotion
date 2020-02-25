import styled from "styled-components";

export const Body = styled.div`
  display: flex;
  flex-direction: row;
`;

export const Content = styled.div`
  flex: 1;
  padding: 0 50px;
  overflow: auto;
  height: 100vh;
  background-color: rgb(251, 251, 252);
  border-color: rgb(223, 223, 223);
  border-style: solid none solid solid;
  border-width: 1px medium 1px 1px;
  border-image: none 100% / 1 / 0 stretch;
  border-radius: 6px 0px 0px 6px;
`;

export const SettingsContainer = styled.div`
    padding: 20px;  
    background-color: white;
    min-height: 200px;
    margin: 18px;
    box-shadow: rgba(0, 0, 0, 0.07) 0px 3px 5px 0px;
    border-radius: 4px;
`;
