import React from 'react';
import styled from 'styled-components';
import { omit } from 'lodash';
import { Input } from "../../Common/Input";
import Button from '../../Common/Button';
import {LabelText} from "../../Common/Toggle/styled";

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
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    min-height: 80%;
    width: 85%;
`;

export const SettingsPanel = styled.div( ({transparent, placeholder}) => `
    flex: 1;
    margin: 10px;
    ${!transparent ? `
    background-color: white;
    box-shadow: rgba(0, 0, 0, 0.07) 0px 3px 5px 0px;
    border-radius: 4px;
    ` : !placeholder ? `
    flex-grow: inherit;
    ` : `` }

`);

export const SettingsPanelHeader = styled.div`
    padding: 10px;
    border-bottom: black 1px;
    border-bottom: 1px solid #efefef;
`;

export const SettingsPanelItem = styled.div(({type}) => `
    padding: 5% 5% ${type === 'text' ? 0 : 5}% 5%;
    margin: 0 5%;

    ${type !== 'submit' ? `
    border-bottom: 1px solid rgba(0, 0, 0, 0.07);
    ` : '' }

    ${type === 'toggle' ? `
    display: block;
    line-height: 1;
    font-size: .8125rem;
    color: rgba(51, 51, 51, 0.7);
    margin-top: 10px;
    ` : '' }
`);

export const ToggleLabelTextSpacer = styled.div`
    display: inline-block;
    min-width: 140px;
`;

export const FieldLabelText = styled(LabelText)`
    width: 84%;
    opacity: 0.7;
    line-height: 1;
    font-size: .8125rem;
    color: rgba(51, 51, 51, 0.7);
`;

export const SaveSettingsContainer = styled.div`

`;

const ButtonBase = props => <Button {...omit(props, ['redButtons'])} />;

export const ApplyButton = styled(ButtonBase)`
  font-weight: 500;
  font-size: .95625rem;
  min-width: 145px;
  height: 37px;
  border-radius: 4px;
  background-color: #23a0fe;
  box-shadow: 0px 15px 29px 0 rgba(51, 70, 85, 0.24);
  padding: 0 10px;
  float: right;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  color: #ffffff;

  &:disabled {
    opacity: 0.3;
    color: rgba(51, 51, 51, 0.7);
  }

  transition: 0.25s;

  &:hover {
    background-color: #1078f0;
    box-shadow: 0px 10px 29px 0 rgba(51, 70, 85, 0.4);
  }
  &:active {
    background-color: #0472ed;
    box-shadow: 0px 0px 20px 0 rgba(51, 70, 85, 0.5);
  }

`;

export const NumberInput = styled.input`
    display: inline-block;
    position: relative;
    min-width: 50px;
    width: 13%;
    cursor: pointer;
    padding-left: 10px;
    height: 40px;
    border-radius: 4px;
    border: solid 1px #dedede;
    line-height: normal;
    font-family: 'Montserrat', sans-serif;
    -webkit-font-smoothing: antialiased;
    font-size: .8125rem;
    color: #333;
    background-color: #ffffff;
`;
