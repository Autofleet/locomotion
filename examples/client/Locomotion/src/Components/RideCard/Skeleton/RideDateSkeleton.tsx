import { StyleSheet, View } from 'react-native';
import { Skeleton } from '../../Skeleton/Skeleton';

export function RideDateSkeleton() {
  return (
    <Skeleton>
      <View style={styles.content} />
    </Skeleton>
  );
}

const styles = StyleSheet.create({
  content: {
    width: 150,
    height: 17,
  },
});
