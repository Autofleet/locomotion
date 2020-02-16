import React from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import useAsyncMethod, { getUsers } from './api';
import { P, H1 } from '../Common/Header';
import Table from '../Common/Table/themes/strips';
import Nav from './Nav';

const columns = [
  { accessor: 'firstName', Header: 'First name' },
  { accessor: 'lastName', Header: 'Last name' },
  { accessor: 'phoneNumber', Header: 'Phone number' },
];

const Body = styled.div`
  display: flex;
  flex-direction: row;
`;

const Content = styled.div`
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

const RowStyle = styled.div`
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

const defaultTrProps = () => ({ className: RowStyle });
const innerTrProps = defaultTrProps;

export default () => {
  if (!localStorage.token) {
    return <Redirect to="/login"/>;
  } else {
    const tracesCall = useAsyncMethod(getUsers, null, []);
    return <Body>
      <Nav/>
      <Content>
        <H1>
          Users
        </H1>
        <P>{!tracesCall.data.length ? 'Loading...' : null}</P>
        <Table
          getTrProps={innerTrProps}
          columns={columns}
          data={tracesCall.data}
        />
      </Content>
    </Body>;
  }
};
