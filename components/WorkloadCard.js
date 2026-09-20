import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, Typography, Spacing, Shadows } from '../constants/theme';
import { getFacultyWorkload } from '../constants/demoData';

export default function WorkloadCard({ workload, style }) {
  const data = workload || getFacultyWorkload();

  return (
    <View style={[styles.card, style]}>
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <MaterialIcons name="speed" size={20} color={Colors.secondary} />
          <Text style={styles.title}>Workload Summary</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Weekly Load</Text>
        </View>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricBox}>
          <Text style={styles.metricNumberPrimary}>{data.total}</Text>
          <Text style={styles.metricLabel}>TOTAL P / WK</Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.metricNumberSecondary}>{data.theory}</Text>
          <Text style={styles.metricLabel}>THEORY P</Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.metricNumberNeutral}>{data.lab}</Text>
          <Text style={styles.metricLabel}>LAB P</Text>
        </View>
      </View>

      <View style={styles.gaugeSection}>
        <View style={styles.gaugeHeader}>
          <Text style={styles.gaugeLabel}>Load vs Dept Norms</Text>
          <Text style={styles.gaugeRatio}>
            {data.total} / {data.maxThreshold} Periods
          </Text>
        </View>

        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(data.utilizationPercentage, 100)}%` },
            ]}
          />
        </View>

        <View style={styles.complianceRow}>
          <MaterialIcons name="check-circle" size={16} color={Colors.onTertiaryContainer} />
          <Text style={styles.complianceText}>
            Within Departmental Norms (Max {data.maxThreshold} P)
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: Spacing.margin,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
    ...Shadows.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  badge: {
    backgroundColor: Colors.surfaceContainerHighest,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.md,
  },
  metricBox: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricNumberPrimary: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.primary,
    lineHeight: 30,
  },
  metricNumberSecondary: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.secondary,
    lineHeight: 30,
  },
  metricNumberNeutral: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    lineHeight: 30,
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  gaugeSection: {
    paddingTop: 4,
    gap: 6,
  },
  gaugeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gaugeLabel: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  gaugeRatio: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.onSurface,
    fontFamily: Typography.labelMono.fontFamily,
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainerHighest,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.full,
  },
  complianceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  complianceText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.onTertiaryContainer,
  },
});
