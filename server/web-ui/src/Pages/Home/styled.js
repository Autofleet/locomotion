import React from 'react';
import styled from 'styled-components';
import Svg from 'react-svg-inline';
import {omit} from 'lodash'

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
    stroke: ${({ disableClass }) => disableClass ? '#dfdfdf' : 'rgb(111, 111, 111)'};
    &:hover {
      stroke: ${({ disableClass }) => disableClass ? '#dfdfdf' : 'rgb(17, 113, 219)'};
    }
    &:active {
      stroke: ${({ disableClass }) => disableClass ? '#dfdfdf' : 'rgb(57, 153, 255)'};
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

export const RowStyle = styled.div`
 .tableRow {
  section {
    opacity: 0;
  }

  &:hover {
    box-shadow: 0px 2px 5px 0 rgba(157, 165, 180, 0.5);
  }
  &:hover section {
    opacity: 1;
  }
}

.pendingInviteTableRow {
  opacity: 30%;
}
`;