import { StyleSheet, View } from 'react-native';
import { Skeleton } from '../../Skeleton/Skeleton';

export function PriceBreakdownSkeleton() {
  return (
    <Skeleton>
      <View style={styles.content} />
    </Skeleton>
  );
}

const styles = StyleSheet.create({
  content: {
    width: 50,
    height: 10,
  },
});
