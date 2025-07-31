import { StyleSheet, View } from 'react-native';
import { Skeleton } from '../../Skeleton/Skeleton';

export const PriceBreakdownSkeleton = () => (
  <Skeleton>
    <View style={styles.content} />
  </Skeleton>
);

const styles = StyleSheet.create({
  content: {
    width: 50,
    height: 10,
  },
});
