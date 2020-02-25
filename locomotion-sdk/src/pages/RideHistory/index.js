import React, { Fragment } from 'react';
import Config from 'react-native-config';
import PageHeader from '../../Components/PageHeader';

const { CONTACT_US_URL: uri } = Config;

export default ({ navigation }) => {
  const toggleMenu = () => {
    navigation.toggleDrawer();
  };
  return (
    <Fragment>
      <PageHeader
        title="Rides History"
        onIconPress={() => toggleMenu()}
      />
    </Fragment>
  );
};
