import React from 'react';

import { Redirect } from 'react-router-dom';
import useAsyncMethod, { getUsers } from '../api';
import { P, H1 } from '../../Common/Header';
import Table from '../../Common/Table/themes/strips';
import Nav from '../Nav';
import { generateAvatarById } from '../../Services/avatar';
import Toggle from '../../Common/Toggle';
import {Body, Content, RowStyle ,Buttons, Avatar, SvgButton, SvgBase, avatarSize} from './styled';
import deleteIcon from '../../assets/delete.svg';
const customAvatarSeed = 'Auto Fleet';

const columns = [
  {
    Header: '',
    width: 60,
    id: 'avatar',
    Cell: ({ original: user }) => {
      console.log(user);

      if (user.avatar) {
        return <Avatar src={user.avatar}/>;
      } else {
        return <SvgBase svg={generateAvatarById(`${user.firstName} ${user.lastName}` || customAvatarSeed)}
                    width={avatarSize} height={avatarSize}/>;
      }
    }
  },
  { accessor: 'firstName', Header: 'First name' },
  { accessor: 'lastName', Header: 'Last name' },
  { accessor: 'email', Header: 'Email' },
  { accessor: 'active', Header: 'Active' },
  { accessor: 'phoneNumber', Header: 'Phone number' },
  {
    Header: '',
    id: 'buttons',
    minWidth: 90,
    accessor: ({ id, active }) => ({ id, active }),
    Cell: ({ value: { id, active } }) => ( // eslint-disable-line react/prop-types
      <Buttons>
        <SvgButton
          svg={deleteIcon}
        />
        <img src={deleteIcon} />
      </Buttons>
    )
  },
  {
    Header: '',
    id: 'toggle',
    minWidth: 50,
    accessor: ({ id, active }) => ({ id, active }),
    Cell: ({ value: { id, active } }) => ( // eslint-disable-line react/prop-types
      <section>
      <Toggle
            value={`toggle_${id}`}
            checked={active === true}
            onChange={(event) => {


              if (event.target.checked) {
                console.log('active');

              } else {
                console.log('not active');
              }
      }}
          /></section>
    )
  }
];

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
