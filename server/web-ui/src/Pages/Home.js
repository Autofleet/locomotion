import React from 'react';
import PrivateBase from './PrivateBase';
import useAsyncMethod, { getUsers } from './api';
import H1 from '../Common/Header/H1';
import P from '../Common/Header/P';
import Table from '../Common/Table/themes/strips';

const columns = [
  // request_id
  { accessor: 'firstName', Header: 'First name' },
  { accessor: 'lastName', Header: 'Last name' },
  { accessor: 'phoneNumber', Header: 'Phone number' },
];

export default () => {
  const tracesCall = useAsyncMethod(getUsers, null, []);
  return (
    <PrivateBase>
      <H1>
        Users
      </H1>
      <P>
        Text text text, some other Text and also text. Text text text, some other Text and also text. Text text text, some other Text and also text Text text text, some other Text and also text. Text text text, some other Text and also text.
      </P>
      <P>{!tracesCall.data.length ? 'Loading...' : null}</P>
      <Table
        columns={columns}
        data={tracesCall.data}
      />
    </PrivateBase>
  );
};
