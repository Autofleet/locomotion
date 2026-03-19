/**
 * Custom Flag component that replaces the emoji-based Flag from
 * react-native-country-picker-modal. Injected via Metro resolveRequest
 * to fix iOS flag rendering (TextKit2 breaks Regional Indicator emoji sequences).
 *
 * Uses SVG images from country-flag-icons, rendered via react-native-svg.
 */
import React, { memo } from 'react';
import { View, PixelRatio, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import flagSvgs from 'country-flag-icons/string/3x2';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  flagWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1 / PixelRatio.get(),
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    borderRadius: 2,
  },
});

const FlagImage = memo(({ countryCode, flagSize }) => {
  const svg = flagSvgs[countryCode];
  if (!svg) return null;
  const height = 20;
  const width = 30;
  return (
    <View style={[styles.flagWrapper, { width, height }]}>
      <SvgXml xml={svg} width={width} height={height} />
    </View>
  );
});

export function Flag({
  countryCode, withEmoji = true, withFlagButton = true, flagSize,
}) {
  if (!withFlagButton) return null;
  return (
    <View style={styles.container}>
      <FlagImage countryCode={countryCode} flagSize={flagSize} />
    </View>
  );
}
