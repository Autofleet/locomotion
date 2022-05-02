import React from 'react';
import styled from 'styled-components';
import Svg from 'react-svg-inline';
import { omit } from 'lodash';
import Button from '../../Common/Button';

export const avatarSize = '28px';

export const Avatar = styled.img.attrs({
  alt: '',
})`
  width: ${avatarSize};
  height: ${avatarSize};
  border-radius: 50%;
  display: inline-block;
`;

export const Buttons = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding-right: 5px;

  div {
    min-width: 40px;
    height: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const SvgBase = props => <Svg {...omit(props, ['disableClass'])} />;

export const SvgButton = styled(SvgBase)`
  padding: 0px 10px;
  cursor: pointer;
  svg {
    width: 16px;
    height: 16px;

    stroke: rgb(111, 111, 111);
    stroke: ${({ disableClass }) => (disableClass ? '#dfdfdf' : 'rgb(111, 111, 111)')};
    &:hover {
      stroke: ${({ disableClass }) => (disableClass ? '#dfdfdf' : 'rgb(17, 113, 219)')};
    }
    &:active {
      stroke: ${({ disableClass }) => (disableClass ? '#dfdfdf' : 'rgb(57, 153, 255)')};
    }
  }
`;

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
