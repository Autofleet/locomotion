import React, { useContext, useEffect } from 'react';
import propTypes from 'prop-types';
import { INITIAL_USER_STATE } from '../AuthScreens/AuthLoadingScreen';
import { UserContext } from '../../context/user';
import Auth from '../../services/auth';
import FullPageLoader from '../../Components/FullPageLoader';

const Logout = ({ navigation }) => {
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    setUser(INITIAL_USER_STATE);
    Auth.logout(navigation);
  }, []);

  return (
    <FullPageLoader />
  );
};

export default Logout;

Logout.defaultProps = {
  navigation: undefined,
};

Logout.propTypes = {
  navigation: propTypes.shape({}),
};
