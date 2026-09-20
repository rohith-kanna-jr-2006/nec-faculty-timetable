import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, Typography, Spacing, Shadows } from '../constants/theme';

export default function ProfileSection({ title, icon, items = [] }) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        {icon && <MaterialIcons name={icon} size={18} color={Colors.secondary} />}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      <View style={styles.itemsList}>
        {items.map((item, index) => (
          <View
            key={index}
            style={[
              styles.itemRow,
              index === items.length - 1 && styles.lastItemRow,
            ]}
          >
            <Text style={styles.itemLabel}>{item.label}</Text>
            {item.isBadge ? (
              <View style={[styles.badgeContainer, item.badgeColor === 'primary' && styles.badgePrimary]}>
                <Text style={[styles.badgeText, item.badgeColor === 'primary' && styles.badgeTextPrimary]}>
                  {item.value}
                </Text>
              </View>
            ) : (
              <Text
                style={[
                  styles.itemValue,
                  item.isMono && styles.itemValueMono,
                  item.highlight && styles.itemValueHighlight,
                ]}
                numberOfLines={item.numberOfLines || 1}
              >
                {item.value}
              </Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: Spacing.margin,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
    ...Shadows.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerLow,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  itemsList: {
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  lastItemRow: {
    paddingBottom: 0,
  },
  itemLabel: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    flex: 1,
  },
  itemValue: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.onSurface,
    textAlign: 'right',
  },
  itemValueMono: {
    fontFamily: Typography.labelMono.fontFamily,
    fontWeight: '600',
    color: Colors.primary,
  },
  itemValueHighlight: {
    color: Colors.secondary,
    fontWeight: '600',
  },
  badgeContainer: {
    backgroundColor: Colors.surfaceContainerHighest,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  badgePrimary: {
    backgroundColor: Colors.primaryContainer,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  badgeTextPrimary: {
    color: Colors.onPrimaryContainer,
  },
});
