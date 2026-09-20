import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Shadows, Spacing } from '../constants/theme';

export default function Card({ children, style, variant = 'surface', ...props }) {
  let containerStyle = styles.surface;
  if (variant === 'low') containerStyle = styles.low;
  if (variant === 'high') containerStyle = styles.high;
  if (variant === 'highest') containerStyle = styles.highest;
  if (variant === 'primaryContainer') containerStyle = styles.primaryContainer;
  if (variant === 'tertiaryContainer') containerStyle = styles.tertiaryContainer;

  return (
    <View style={[styles.base, containerStyle, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.margin,
    ...Shadows.sm,
  },
  surface: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
  },
  low: {
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
  },
  high: {
    backgroundColor: Colors.surfaceContainerHigh,
  },
  highest: {
    backgroundColor: Colors.surfaceContainerHighest,
  },
  primaryContainer: {
    backgroundColor: Colors.primaryContainer,
    borderWidth: 0,
  },
  tertiaryContainer: {
    backgroundColor: Colors.tertiaryContainer,
    borderWidth: 0,
  },
});
