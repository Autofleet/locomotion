import { StyleSheet, View } from 'react-native';
import { Skeleton } from '../../Skeleton/Skeleton';

export const ConfirmPickupSkeleton = () => (
  <Skeleton>
    <View style={styles.container}>
      <View style={styles.input} />
    </View>
  </Skeleton>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    paddingLeft: 5,
    paddingRight: 10,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 13,
  },
});
