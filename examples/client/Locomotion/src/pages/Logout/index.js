import React, { Fragment, useEffect } from 'react';
import propTypes from 'prop-types';
import Auth from '../../services/auth';

const Login = ({ navigation, logo }) => {
  useEffect(() => {
    Auth.logout(navigation);
  }, []);

  return (
    <Fragment />
  );
};

export default Login;

Login.defaultProps = {
  navigation: undefined,
};

Login.propTypes = {
  navigation: propTypes.shape({}),
};
