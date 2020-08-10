import React, { Fragment, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import i18n from '../../i18n';
import Nav from '../Nav';
import { H1 } from '../../Common/Header';
import Table from '../../Common/Table/themes/strips';
import Toggle from '../../Common/Toggle';
import Popup from '../../Common/Popup';
import { generateAvatarById } from '../../Services/avatar';
import { Body, Content, Buttons, Avatar, SvgBase, avatarSize } from './styled';
import usersContainer from '../../contexts/usersContainer';
import { ReactComponent as deleteIcon } from '../../assets/delete.svg';
import { ReactComponent as editIcon } from '../../assets/edit.svg';
import SvgIcon from '../../Common/SvgIcon';

const customAvatarSeed = 'Auto Fleet';

const makeColumns = () => [
  {
    Header: '',
    width: 60,
    id: 'avatar',
    Cell: ({ original: user }) => {
      if (user.avatar) {
        return <Avatar src={user.avatar} />;
      }
      return (<SvgBase
        svg={generateAvatarById(`${user.firstName} ${user.lastName}` || customAvatarSeed)}
        width={avatarSize}
        height={avatarSize}
      />);
    },
  },
  { accessor: 'firstName', Header: i18n.t('users.firstName'), width: 150 },
  { accessor: 'lastName', Header: i18n.t('users.lastName') },
  { accessor: 'email', Header: i18n.t('users.email') },
  { accessor: 'phoneNumber', Header: i18n.t('users.phoneNumber') },
  {
    accessor: 'active',
    Header: i18n.t('users.status'),
    Cell: ({ value }) => (value ? i18n.t('users.active') : i18n.t('users.disabled')),
  },
  {
    accessor: 'created_at',
    Header: i18n.t('users.registrationDate'),
    Cell: ({ value }) => moment.utc(value).format('YYYY-MM-DD'),
  },
];

export default () => {
  if (!localStorage.token) {
    return <Redirect to="/login" />;
  }

  const [popupState, setPopupState] = useState('');
  const [chosenUser, setChosenUser] = useState('');

  const users = usersContainer.useContainer();
  const columns = [...makeColumns(), {
    Header: '',
    id: 'buttons',
    minWidth: 90,
    accessor: ({ id, active }) => ({ id, active }),
    Cell: ({ value: { id, active } }) => ( // eslint-disable-line react/prop-types
      <Buttons>
        <SvgIcon
          svg={editIcon}
          onClick={() => {
              const userData = users.getUser(id);
              setChosenUser(userData);
              setPopupState('EditUser');
            }}
        />
        <SvgIcon
          svg={deleteIcon}
          disableClass={active}
          onClick={() => {
              if (!active) {
                users.deleteUser(id);
              }
            }}
        />
      </Buttons>
    ),
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
                users.setUserState(id, true);
              } else {
                users.setUserState(id, false);
              }
            }}
        />
      </section>
    ),
  }];
  useEffect(() => {
    users.loadUsers();
  }, []);

  return (
    <Fragment>
      <Body>
        <Nav />
        <Content>
          <H1>
            {i18n.t('users.users')}
          </H1>
          <Table
            columns={columns}
            data={users.usersMap}
          />
        </Content>
        <Popup
          name="AddUser"
          isVisible={popupState === 'AddUser'}
          chosenUser={chosenUser}
          onClose={() => setPopupState(false)}
          popupName={popupState}
          initialValues={{ active: true }}
        />

        <Popup
          name="EditUser"
          editMode
          isVisible={popupState === 'EditUser'}
          chosenUser={chosenUser}
          onClose={() => setPopupState(false)}
          popupName={popupState}
          initialValues={chosenUser}
        />


      </Body>


    </Fragment>
  );
};
