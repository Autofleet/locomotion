import { View } from 'react-native';
import { Skeleton } from '../../../../../Components/Skeleton/Skeleton';

const LAYOUT = [
  { width: 180, height: 20, marginBottom: 6 },
  { width: 220, height: 20 },
];

export const AddressLineSkeleton = () => (
  <Skeleton layout={LAYOUT}>
    <View />
  </Skeleton>
);
