import { ReactElement, useContext } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { ThemeContext } from 'styled-components';

interface SkeletonProps {
  children: ReactElement;
}

export const Skeleton = ({ children }: SkeletonProps) => {
  const theme = useContext(ThemeContext);

  return (
    <SkeletonPlaceholder borderRadius={theme.borderRadiusValues.SM}>
      {children}
    </SkeletonPlaceholder>
  );
};
