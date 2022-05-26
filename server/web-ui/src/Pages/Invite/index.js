import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { verifyUser } from '../../contexts/usersContainer/api';

const STATUS_ERROR = 'ERROR';
const INVITE_SUCCESS_PATH = '/inviteSuccess';
const INVITE_FAILED_PATH = '/inviteFailed';
const InviteCallback = (props) => {
  const history = useHistory();
  const { inviteId } = useParams();
  const verifyEmail = async () => {
      const res = await verifyUser(inviteId)

      if (res.status === STATUS_ERROR) {
        history.push(INVITE_FAILED_PATH)
      } else {
        history.push(INVITE_SUCCESS_PATH)
      }
  }

  useEffect(() => {
      verifyEmail()
  }, [])

  // should show loader
  return <div />;
};

export default InviteCallback;
