import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { verifyUser } from '../../contexts/usersContainer/api';

const STATUS_ERROR = 'ERROR';
const InviteCallback = () => {
  const history = useHistory();
  const { inviteId } = useParams();
  const verifyEmail = async () => {
      let data;
      try {
        const res = await verifyUser(inviteId);
        data = res.data;
      } catch (e) {
        data = e.response.data;
      }
      const isSuccessful = data.status !== STATUS_ERROR;
      history.push('/invite', { operationId: isSuccessful ? data.user.operationId : null, isSuccessful });
  };

  useEffect(() => {
      verifyEmail();
  }, []);

  // should show loader
  return <div />;
};

export default InviteCallback;
