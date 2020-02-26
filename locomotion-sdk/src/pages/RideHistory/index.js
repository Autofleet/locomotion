import React, { Fragment } from 'react';
import PageHeader from '../../Components/PageHeader';

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
