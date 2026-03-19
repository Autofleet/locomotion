import { StyleSheet, View } from 'react-native';
import { Skeleton } from '../../../../../../../Components/Skeleton/Skeleton';

export function PromoButtonSkeleton() {
  return (
    <Skeleton>
      <View style={styles.content} />
    </Skeleton>
  );
}

const styles = StyleSheet.create({
  content: {
    width: 40,
    height: 10,
  },
});
