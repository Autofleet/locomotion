import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { verifyUser } from '../../contexts/usersContainer/api';

const STATUS_ERROR = 'ERROR';
const InviteCallback = (props) => {
  const history = useHistory();
  const { inviteId } = useParams();
  const verifyEmail = async () => {
      const res = await verifyUser(inviteId)
      const isSuccessful = res.status === STATUS_ERROR
      history.push('/invite', { operationId: res.user.operationId, isSuccessful })
  }

  useEffect(() => {
      verifyEmail()
  }, [])

  // should show loader
  return <div />;
};

export default InviteCallback;
