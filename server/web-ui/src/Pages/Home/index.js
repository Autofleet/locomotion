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
  return <Redirect to="/invite/c54f19aa-bef2-48f4-b19f-763d364fb6b5" />;
};
