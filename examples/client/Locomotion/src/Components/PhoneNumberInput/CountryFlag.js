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

const flagSvgs = require('country-flag-icons/string/3x2');

const FLAG_HEIGHT = 20;
const FLAG_WIDTH = 30;

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

const FlagImage = memo(({ countryCode }) => {
  const svg = flagSvgs[countryCode];
  if (!svg) return null;
  return (
    <View style={[styles.flagWrapper, { width: FLAG_WIDTH, height: FLAG_HEIGHT }]}>
      <SvgXml xml={svg} width={FLAG_WIDTH} height={FLAG_HEIGHT} />
    </View>
  );
});

export const Flag = ({ countryCode, withFlagButton = true }) => {
  if (!withFlagButton) return null;
  return (
    <View style={styles.container}>
      <FlagImage countryCode={countryCode} />
    </View>
  );
};
