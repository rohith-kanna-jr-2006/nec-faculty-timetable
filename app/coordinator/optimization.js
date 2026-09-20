import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import ACHeader from '../../components/ACHeader';
import ACBottomNav from '../../components/ACBottomNav';
import PrimaryButton from '../../components/PrimaryButton';

export default function OptimizationScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(87);
  const [solverFinished, setSolverFinished] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
      setSolverFinished(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <ACHeader title="Live Solver" showBack={true} activeCohort="III / V / CSE-C" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro Unit */}
        <View style={styles.introCard}>
          <View style={styles.introTopRow}>
            <View style={styles.engineBadge}>
              <View style={styles.pulseDot} />
              <Text style={styles.engineBadgeText}>Automated Matrix Engine v4.2</Text>
            </View>
            <View style={styles.liveBadge}>
              <MaterialIcons name="sync" size={13} color={Colors.onSecondaryContainer} />
              <Text style={styles.liveBadgeText}>
                {solverFinished ? 'OPTIMIZED' : 'LIVE SOLVER'}
              </Text>
            </View>
          </View>
          <Text style={styles.introTitle}>Optimizing Timetable for CSE-C</Text>
          <Text style={styles.introSubtitle}>
            Solving academic constraints and building a conflict-free weekly schedule for Semester V.
          </Text>
        </View>

        {/* Central Dial & Telemetry Card */}
        <View style={styles.dialCard}>
          <View style={styles.statusPill}>
            <MaterialIcons
              name={solverFinished ? 'check-circle' : 'tune'}
              size={16}
              color={solverFinished ? Colors.onTertiaryContainer : Colors.secondary}
            />
            <Text style={styles.statusPillText}>
              {solverFinished
                ? 'Constraint optimization complete (0 Violations)'
                : 'Finding a conflict-free schedule...'}
            </Text>
          </View>

          {/* Dial Graphic Simulation with SVG Arc */}
          <View style={styles.dialVisualWrapper}>
            <Svg width={180} height={180} viewBox="0 0 180 180" style={styles.svgDial}>
              <Circle
                cx="90"
                cy="90"
                r="72"
                stroke={Colors.surfaceContainerHigh}
                strokeWidth={10}
                fill="none"
              />
              <Circle
                cx="90"
                cy="90"
                r="72"
                stroke={Colors.secondary}
                strokeWidth={10}
                strokeLinecap="round"
                strokeDasharray={452.39}
                strokeDashoffset={452.39 * (1 - progress / 100)}
                fill="none"
                transform="rotate(-90 90 90)"
              />
            </Svg>

            <View style={styles.dialInnerContent}>
              <Text style={styles.progressPercent}>{progress}%</Text>
              <Text style={styles.progressLabel}>SOLVED MATRIX</Text>
              <View style={styles.timerBadge}>
                <MaterialIcons name="schedule" size={12} color={Colors.onTertiaryContainer} />
                <Text style={styles.timerText}>
                  {solverFinished ? 'Solved' : '~2s rem'}
                </Text>
              </View>
            </View>
          </View>

          {/* Micro KPIs Row */}
          <View style={styles.kpiRow}>
            <View style={styles.kpiBox}>
              <Text style={styles.kpiLabel}>VARIANTS</Text>
              <Text style={styles.kpiVal}>1,420</Text>
            </View>
            <View style={styles.kpiBox}>
              <Text style={styles.kpiLabel}>HARD RULES</Text>
              <Text style={[styles.kpiVal, { color: Colors.onTertiaryContainer }]}>100% OK</Text>
            </View>
            <View style={styles.kpiBox}>
              <Text style={styles.kpiLabel}>CONFLICTS</Text>
              <Text style={[styles.kpiVal, { color: Colors.secondary }]}>0 Active</Text>
            </View>
          </View>
        </View>

        {/* Multi-Step Pipeline Checklist */}
        <View style={styles.pipelineCard}>
          <View style={styles.pipelineHeader}>
            <View style={styles.pipelineHeaderLeft}>
              <MaterialIcons name="checklist" size={18} color={Colors.primary} />
              <Text style={styles.pipelineTitle}>Pipeline Verification Stages</Text>
            </View>
            <View style={styles.stagesBadge}>
              <Text style={styles.stagesBadgeText}>
                {solverFinished ? '6/6 Complete' : '4/6 Complete'}
              </Text>
            </View>
          </View>

          <View style={styles.stagesList}>
            {/* Stage 1 */}
            <View style={styles.stageItem}>
              <View style={styles.stageCheckCircle}>
                <MaterialIcons name="check" size={16} color={Colors.onTertiaryFixed} />
              </View>
              <View style={styles.stageContent}>
                <View style={styles.stageTitleRow}>
                  <Text style={styles.stageTitle}>Loading curriculum & regulations</Text>
                  <View style={styles.stageStatusChip}>
                    <Text style={styles.stageStatusText}>VERIFIED</Text>
                  </View>
                </View>
                <Text style={styles.stageDesc}>
                  12 semester courses verified against R2022 Regulation norms
                </Text>
              </View>
            </View>

            {/* Stage 2 */}
            <View style={styles.stageItem}>
              <View style={styles.stageCheckCircle}>
                <MaterialIcons name="check" size={16} color={Colors.onTertiaryFixed} />
              </View>
              <View style={styles.stageContent}>
                <View style={styles.stageTitleRow}>
                  <Text style={styles.stageTitle}>Loading course assignments</Text>
                  <View style={styles.stageStatusChip}>
                    <Text style={styles.stageStatusText}>LOADED</Text>
                  </View>
                </View>
                <Text style={styles.stageDesc}>
                  10 faculty members loaded with workload caps
                </Text>
              </View>
            </View>

            {/* Stage 3 */}
            <View style={styles.stageItem}>
              <View style={styles.stageCheckCircle}>
                <MaterialIcons name="check" size={16} color={Colors.onTertiaryFixed} />
              </View>
              <View style={styles.stageContent}>
                <View style={styles.stageTitleRow}>
                  <Text style={styles.stageTitle}>Checking faculty availability</Text>
                  <View style={styles.stageStatusChip}>
                    <Text style={styles.stageStatusText}>PASSED</Text>
                  </View>
                </View>
                <Text style={styles.stageDesc}>
                  Cross-checked external research slots and committee commitments
                </Text>
              </View>
            </View>

            {/* Stage 4 */}
            <View style={styles.stageItem}>
              <View style={styles.stageCheckCircle}>
                <MaterialIcons name="check" size={16} color={Colors.onTertiaryFixed} />
              </View>
              <View style={styles.stageContent}>
                <View style={styles.stageTitleRow}>
                  <Text style={styles.stageTitle}>Building scheduling constraints</Text>
                  <View style={styles.stageStatusChip}>
                    <Text style={styles.stageStatusText}>LOCKED</Text>
                  </View>
                </View>
                <Text style={styles.stageDesc}>
                  Break rules & Lab continuous 4-period span strictly mapped
                </Text>
              </View>
            </View>

            {/* Stage 5 */}
            <View
              style={[
                styles.stageItem,
                !solverFinished && { backgroundColor: Colors.surfaceContainerHigh },
              ]}
            >
              <View
                style={[
                  styles.stageCheckCircle,
                  !solverFinished && { backgroundColor: Colors.secondaryContainer },
                ]}
              >
                <MaterialIcons
                  name={solverFinished ? 'check' : 'sync'}
                  size={16}
                  color={solverFinished ? Colors.onTertiaryFixed : Colors.onSecondaryContainer}
                />
              </View>
              <View style={styles.stageContent}>
                <View style={styles.stageTitleRow}>
                  <Text style={styles.stageTitle}>Optimizing timetable</Text>
                  <View
                    style={[
                      styles.stageStatusChip,
                      !solverFinished && { backgroundColor: Colors.secondaryFixed },
                    ]}
                  >
                    <Text
                      style={[
                        styles.stageStatusText,
                        !solverFinished && { color: Colors.secondary },
                      ]}
                    >
                      {solverFinished ? 'VERIFIED' : 'SOLVING'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.stageDesc}>
                  Evaluating soft constraints: theory distribution, cognitive balance
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Generation Result Summary Card */}
        {solverFinished && (
          <View style={styles.generationResultCard}>
            <View style={styles.generationResultHeader}>
              <View style={styles.generationResultLeft}>
                <MaterialIcons name="fact-check" size={18} color={Colors.primary} />
                <Text style={styles.generationResultTitle}>TIMETABLE GENERATION OUTPUT</Text>
              </View>
              <View style={styles.generationStatusBadge}>
                <Text style={styles.generationStatusText}>100% FEASIBLE</Text>
              </View>
            </View>

            <View style={styles.genMetricsRow}>
              <View style={styles.genMetricCol}>
                <Text style={styles.genMetricVal}>35</Text>
                <Text style={styles.genMetricLabel}>Required</Text>
              </View>
              <View style={styles.genMetricCol}>
                <Text style={[styles.genMetricVal, { color: Colors.secondary }]}>35</Text>
                <Text style={styles.genMetricLabel}>Scheduled</Text>
              </View>
              <View style={styles.genMetricCol}>
                <Text style={styles.genMetricVal}>0</Text>
                <Text style={styles.genMetricLabel}>Free</Text>
              </View>
              <View style={styles.genMetricCol}>
                <Text style={[styles.genMetricVal, { color: Colors.onTertiaryContainer }]}>0</Text>
                <Text style={styles.genMetricLabel}>Conflicts</Text>
              </View>
            </View>

            <View style={styles.approvalStatusRow}>
              <Text style={styles.approvalStatusLabel}>TARGET STAGE:</Text>
              <View style={styles.pendingBadge}>
                <MaterialIcons name="hourglass-top" size={12} color="#c2410c" />
                <Text style={styles.pendingBadgeText}>PENDING HOD APPROVAL</Text>
              </View>
            </View>
          </View>
        )}

        {/* Action Controls */}
        <View style={styles.actionsCard}>
          <PrimaryButton
            title="Proceed to Validation & Approval"
            icon="verified"
            iconRight="arrow-forward"
            onPress={() => router.push('/coordinator/validation')}
            style={styles.proceedBtn}
          />
          <PrimaryButton
            title="Simulate Conflict & Regenerate"
            variant="outline"
            icon="warning"
            onPress={() => router.push('/coordinator/conflict')}
            style={styles.conflictBtn}
          />
        </View>
      </ScrollView>

      <ACBottomNav activeTab="timetable" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.margin,
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  introCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    gap: 4,
    ...Shadows.sm,
  },
  introTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  engineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondary,
  },
  engineBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  liveBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.onSecondaryContainer,
    fontFamily: Typography.labelMono.fontFamily,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -0.2,
  },
  introSubtitle: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    lineHeight: 16,
    marginTop: 2,
  },
  dialCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    gap: Spacing.md,
    ...Shadows.sm,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  dialVisualWrapper: {
    width: 180,
    height: 180,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.sm,
  },
  svgDial: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  dialInnerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  progressPercent: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: -1,
  },
  progressLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginTop: 2,
  },
  timerText: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.onSurface,
    fontFamily: Typography.labelMono.fontFamily,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  kpiBox: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
    padding: 10,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  kpiLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  kpiVal: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 2,
  },
  pipelineCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  pipelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pipelineHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pipelineTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  stagesBadge: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  stagesBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  stagesList: {
    gap: 8,
  },
  stageItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.surfaceContainerLow,
    padding: 10,
    borderRadius: BorderRadius.lg,
  },
  stageCheckCircle: {
    width: 22,
    height: 22,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.tertiaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stageContent: {
    flex: 1,
  },
  stageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  stageTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  stageStatusChip: {
    backgroundColor: Colors.surfaceContainerLowest,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
  },
  stageStatusText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onTertiaryContainer,
    fontFamily: Typography.labelMono.fontFamily,
  },
  stageDesc: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
    lineHeight: 15,
  },
  generationResultCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    borderColor: Colors.secondaryFixedDim,
    gap: 10,
    ...Shadows.md,
  },
  generationResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  generationResultLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  generationResultTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
    letterSpacing: 0.5,
  },
  generationStatusBadge: {
    backgroundColor: Colors.tertiaryFixed,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  generationStatusText: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.onTertiaryContainer,
    fontFamily: Typography.labelMono.fontFamily,
  },
  genMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLow,
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  genMetricCol: {
    alignItems: 'center',
  },
  genMetricVal: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  genMetricLabel: {
    fontSize: 8,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  approvalStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  approvalStatusLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fed7aa',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  pendingBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#c2410c',
    fontFamily: Typography.labelMono.fontFamily,
  },
  actionsCard: {
    gap: 8,
  },
  proceedBtn: {
    width: '100%',
  },
  conflictBtn: {
    width: '100%',
  },
});
