import { StyleSheet, View } from 'react-native';
import { Skeleton } from '../../../../Components/Skeleton/Skeleton';

export function TipButtonSkeleton() {
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
    marginTop: 10,
  },
});
