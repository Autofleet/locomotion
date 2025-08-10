import { StyleSheet, View } from 'react-native';
import { Skeleton } from '../../../../../Components/Skeleton/Skeleton';

export const AddressLineSkeleton = () => (
  <Skeleton>
    <View>
      <View style={styles.label} />
      <View style={styles.text} />
    </View>
  </Skeleton>
);

const styles = StyleSheet.create({
  label: {
    width: 180,
    height: 20,
    marginBottom: 6,
  },
  text: {
    width: 220,
    height: 20,
  },
});
