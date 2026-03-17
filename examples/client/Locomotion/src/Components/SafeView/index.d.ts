import React from 'react';
import { ViewProps } from 'react-native';

interface SafeViewProps extends ViewProps {
  children?: React.ReactNode;
}

declare const SafeView: React.FC<SafeViewProps>;
export default SafeView;
