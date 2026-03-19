import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import { logout } from '../../services/logout';
import FullPageLoader from '../../Components/FullPageLoader';

function Logout({ navigation }) {
  useEffect(() => {
    logout(navigation);
  }, []);

  return (
    <FullPageLoader />
  );
}

export default Logout;

Logout.defaultProps = {
  navigation: undefined,
};

Logout.propTypes = {
  navigation: propTypes.shape({}),
};
