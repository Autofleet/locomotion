import React from 'react';
import PrivateBase from './PrivateBase';
import useAsyncMethod, { getUsers } from './api';
import H1 from '../Common/Header/H1';
import P from '../Common/Header/P';
import Table from '../Common/Table/themes/strips';
import Nav from './Nav';
import styled from 'styled-components';

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

export default () => {
  const tracesCall = useAsyncMethod(getUsers, null, []);
  return (
    <PrivateBase>
      <Body>
        <Nav/>
        <Content>
          <H1>
            Users
          </H1>
          <P>
            Text text text, some other Text and also text. Text text text, some other Text and also text. Text text text, some other Text and also text Text text text, some other Text and also text.
            Text text text, some other Text and also text.
          </P>
          <P>{!tracesCall.data.length ? 'Loading...' : null}</P>
          <Table
            columns={columns}
            data={tracesCall.data}
          />
        </Content>
      </Body>
    </PrivateBase>
  );
};
