import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import { logout } from '../../services/logout';
import FullPageLoader from '../../Components/FullPageLoader';

const Logout = (props) => {
  const { navigation = undefined } = props;
  useEffect(() => {
    logout(navigation);
  }, []);

  return (
    <FullPageLoader />
  );
};

export default Logout;

Logout.propTypes = {
  navigation: propTypes.shape({}),
};
