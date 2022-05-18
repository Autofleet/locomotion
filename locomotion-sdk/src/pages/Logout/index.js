import React, { Fragment, useState, useEffect } from 'react';
import { Image, View } from 'react-native';
import propTypes from 'prop-types';
import Auth from '../../services/auth';


const LogoIconSource = require('../../assets/logo.png');

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
