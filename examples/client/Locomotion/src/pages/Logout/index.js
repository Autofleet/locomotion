import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import Auth from '../../services/auth';
import FullPageLoader from '../../Components/FullPageLoader';

const Logout = ({ navigation }) => {
  useEffect(() => {
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
