import { StyleSheet, View } from 'react-native';
import { Skeleton } from '../../../../Components/Skeleton/Skeleton';

export const TipButtonSkeleton = () => (
  <Skeleton>
    <View style={styles.content} />
  </Skeleton>
);

const styles = StyleSheet.create({
  content: {
    width: 40,
    height: 10,
    marginTop: 10,
  },
});
