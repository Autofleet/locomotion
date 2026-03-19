import { View } from 'react-native';
import { ICustomViewStyle } from 'react-native-reanimated-skeleton/lib/typescript/constants';
import { Skeleton } from '../../../../../Components/Skeleton/Skeleton';

const LAYOUT: ICustomViewStyle[] = [
  { width: 180, height: 20, marginBottom: 6 },
  { width: 220, height: 20 },
];

export function AddressLineSkeleton() {
  return (
    <Skeleton layout={LAYOUT}>
      <View />
    </Skeleton>
  );
}
