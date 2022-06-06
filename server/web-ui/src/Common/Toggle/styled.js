import styled from 'styled-components';
import 'react-table-6/react-table.css';

export const ToggleLabel = styled.label`
    position: relative;
    width: auto;
    height: 14px;
`;

export const ToggleInput = styled.input.attrs({ type: 'checkbox' })`
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    margin: 0;
    height: 100%;
`;

export const TogglerBody = styled.div`
    display: inline-block;
    position: relative;
    width: 28px;
    height: 14px;
    background-color: #dedede;
    border-radius: 6.2px;
    cursor: pointer;
    transition-duration: 200ms;
    vertical-align: middle;

    &:hover {
      box-shadow: 0 0 10px 0 rgba(0,0,0,.1);
      background-color: #bebebe;
    }
    &:active {
      box-shadow: 0 0 10px 0 rgba(0,0,0,.3);
      background-color: #8e8e8e;
    }

    &::after {
      display: block;
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      transform: translate(0, -50%);
      width: 13px;
      height: 13px;
      border-radius: 50%;
      box-shadow: 2px 0px 1px 0 rgba(155, 155, 155, 0.2);
      background-color: #fafafc;
      border: solid 2px #dedede;
      transition-duration: 200ms;
    }

    ${ToggleInput}:checked + & {
        background-color: #23a0fe;
        &:hover {
            background-color: #0380dd;
        }
        &:active {
            background-color: #0068bd;
        }
        &::after {
            transform: translate(12px, -50%);
        }
    }
`;

export const LabelText = styled.div`
    display: inline-block;
    font-size: 12px;
    margin-right: 10px;
    cursor: pointer;
`;
