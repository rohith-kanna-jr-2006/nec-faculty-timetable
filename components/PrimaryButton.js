import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, Typography, Shadows, Spacing } from '../constants/theme';

export default function PrimaryButton({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'subtle'
  icon,
  iconRight,
  iconColor,
  loading = false,
  disabled = false,
  style,
  textStyle,
}) {
  const getButtonStyles = () => {
    switch (variant) {
      case 'secondary':
        return [styles.btnSecondary, disabled && styles.btnDisabled];
      case 'outline':
        return [styles.btnOutline, disabled && styles.btnDisabled];
      case 'subtle':
        return [styles.btnSubtle, disabled && styles.btnDisabled];
      case 'primary':
      default:
        return [styles.btnPrimary, disabled && styles.btnDisabled];
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'secondary':
        return styles.textSecondary;
      case 'outline':
        return styles.textOutline;
      case 'subtle':
        return styles.textSubtle;
      case 'primary':
      default:
        return styles.textPrimary;
    }
  };

  const getIconColor = () => {
    if (iconColor) {
      return iconColor;
    }
    switch (variant) {
      case 'secondary':
        return Colors.secondary;
      case 'outline':
      case 'subtle':
        return Colors.primary;
      case 'primary':
      default:
        return Colors.onSecondary;
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        getButtonStyles(),
        pressed && !disabled && styles.pressed,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator size="small" color={getIconColor()} />
      ) : (
        <View style={styles.contentRow}>
          {icon && (
            <MaterialIcons
              name={icon}
              size={18}
              color={getIconColor()}
              style={styles.iconLeft}
            />
          )}
          <Text style={[styles.baseText, getTextStyles(), textStyle]}>{title}</Text>
          {iconRight && (
            <MaterialIcons
              name={iconRight}
              size={18}
              color={getIconColor()}
              style={styles.iconRight}
            />
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 46,
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  btnPrimary: {
    backgroundColor: Colors.secondary,
    ...Shadows.sm,
  },
  textPrimary: {
    color: Colors.onSecondary,
  },
  btnSecondary: {
    backgroundColor: Colors.surfaceContainer,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHigh,
  },
  textSecondary: {
    color: Colors.primary,
  },
  btnOutline: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    ...Shadows.sm,
  },
  textOutline: {
    color: Colors.primary,
  },
  btnSubtle: {
    backgroundColor: Colors.surfaceContainerLow,
  },
  textSubtle: {
    color: Colors.onSurface,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  iconLeft: {
    marginRight: 6,
  },
  iconRight: {
    marginLeft: 6,
  },
});
