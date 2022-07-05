import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { Text } from '../../Profile/ScreenText/styles';

export default ({
  loadingState = false,
  onAddClick = undefined,
}) => {
  const [loading, setLoading] = useState(false);
  const route = useRoute();

  useEffect(() => {
    setLoading(loadingState);
  }, [loading]);


  return (
    <>
      <Text>{route?.params?.paymentMethod?.name}</Text>
    </>
  );
};
