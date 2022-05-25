import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import UsersManager from '../../contexts/usersContainer/manager';
import { verifyUser } from '../../contexts/usersContainer/api';

const STATUS_ERROR = 'ERROR';
const INVITE_SUCCESS_PATH = '/inviteSuccess';
const INVITE_FAILED_PATH = '/inviteFailed';
const InviteCallback = (props) => {
    console.log(props)
//   const { params: { inviteId } } = match;
  
  const verifyEmail = async () => {
      const res = await verifyUser(inviteId)

      if (res.status === STATUS_ERROR) {

      } else {

      }
  }

  useEffect(() => {
    //   verifyEmail()
  }, [])

  // should show loader
  return <div />;
};
InviteCallback.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      inviteId: PropTypes.string,
    }),
  }).isRequired,
};

export default InviteCallback;
