import React, { ReactElement, useContext } from 'react';
import SkeletonPlaceholder from 'react-native-reanimated-skeleton';
import { ICustomViewStyle } from 'react-native-reanimated-skeleton/lib/typescript/constants';
import { ThemeContext } from 'styled-components';

interface SkeletonProps {
  children: ReactElement;
  layout?: ICustomViewStyle[];
}

export const Skeleton = ({ children, layout }: SkeletonProps) => {
  const theme = useContext(ThemeContext);

  return (
    <SkeletonPlaceholder
      isLoading
      animationType="pulse"
      layout={layout}
      containerStyle={{ borderRadius: theme.borderRadiusValues.SM }}
      boneColor={theme.isDarkMode ? '#3a3a3a' : '#d0d0d0'}
      highlightColor={theme.isDarkMode ? '#505050' : '#e8e8e8'}
    >
      {children}
    </SkeletonPlaceholder>
  );
};
