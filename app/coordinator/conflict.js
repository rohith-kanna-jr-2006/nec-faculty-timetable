import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import ACHeader from '../../components/ACHeader';
import ACBottomNav from '../../components/ACBottomNav';
import PrimaryButton from '../../components/PrimaryButton';

export default function ConflictScreen() {
  const router = useRouter();
  const [selectedStrategy, setSelectedStrategy] = useState('faculty_swap');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [resolved, setResolved] = useState(false);

  const strategies = [
    {
      id: 'faculty_swap',
      title: 'Resolve Faculty Conflict',
      tag: 'OPTIMAL FIX',
      desc: 'Swap Wed P3 allocation in CSE-C to verified idle slot: Friday • Period 1 (09:10 AM).',
      badge: '0 Cascading Conflicts • Section C Load Maintained',
    },
    {
      id: 'theory_dist',
      title: 'Improve Theory Distribution',
      tag: 'BALANCED',
      desc: 'Evenly re-spread Compiler Design core lectures across non-consecutive days with balanced student fatigue index.',
      badge: 'Reduced Student Cognitive Load',
    },
    {
      id: 'lab_anchor',
      title: 'Re-anchor Laboratory Placement',
      tag: 'LAB PRIORITY',
      desc: 'Shift 4-hour continuous CSE Lab cycles to morning blocks and solve theory around laboratory anchors.',
      badge: 'Strict Lab Block Preserved',
    },
    {
      id: 'full_resolve',
      title: 'Full Constraint Re-solve',
      tag: 'RE-SOLVE',
      desc: 'Purge non-locked assignments in Semester 5 CSE and run complete iterative heuristic solver.',
      badge: 'Global Recalibration',
    },
  ];

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      setResolved(true);
      Alert.alert(
        'Conflict Resolved Successfully',
        'Candidate slot Wed P3 shifted to Friday P1 (09:10 AM). Zero active conflicts remaining across CSE Department.',
        [
          {
            text: 'View Timetable Validation',
            onPress: () => router.push('/coordinator/validation'),
          },
        ]
      );
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <ACHeader title="Conflict Inspection" showBack={true} activeCohort="III / V / CSE-C" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Intro */}
        <View style={styles.conflictHeaderRow}>
          <View>
            <Text style={styles.candidateText}>CANDIDATE SOLUTION #409-B</Text>
            <Text style={styles.conflictTitle}>Faculty Conflict Inspection</Text>
          </View>
          <View style={[styles.ruleBreachBadge, resolved && styles.ruleBreachBadgeClean]}>
            <MaterialIcons
              name={resolved ? 'check-circle' : 'report-problem'}
              size={14}
              color={resolved ? Colors.onTertiaryContainer : Colors.onErrorContainer}
            />
            <Text style={[styles.ruleBreachText, resolved && styles.ruleBreachTextClean]}>
              {resolved ? 'RESOLVED' : 'RULE BREACH'}
            </Text>
          </View>
        </View>

        {/* Warning Alert Banner */}
        {!resolved ? (
          <View style={styles.warningBanner}>
            <View style={styles.warningIconBox}>
              <MaterialIcons name="warning" size={20} color="#ffffff" />
            </View>
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Faculty Conflict Detected in Candidate Solution</Text>
              <Text style={styles.warningDesc}>
                Simultaneous allocation violation detected under Anna University & NEC autonomous scheduling bylaws.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.resolvedBanner}>
            <View style={styles.resolvedIconBox}>
              <MaterialIcons name="verified" size={20} color="#ffffff" />
            </View>
            <View style={styles.warningContent}>
              <Text style={styles.resolvedTitle}>All Slot Collisions Resolved</Text>
              <Text style={styles.resolvedDesc}>
                Optimal Friday P1 slot reallocated. 100% compliant with zero overlapping periods.
              </Text>
            </View>
          </View>
        )}

        {/* Conflict Details Card */}
        <View style={styles.facultyDetailCard}>
          <View style={styles.facultyHeadRow}>
            <View>
              <View style={styles.nameBadgeRow}>
                <Text style={styles.facultyName}>Ms. K. Shanmugapriya</Text>
                <View style={styles.empBadge}>
                  <Text style={styles.empBadgeText}>EMP #NEC-CS-084</Text>
                </View>
              </View>
              <Text style={styles.facultyDept}>Assistant Professor • Dept of CSE</Text>
              <View style={styles.hoursRow}>
                <View style={styles.hoursChip}>
                  <Text style={styles.hoursChipText}>Target: 14 hrs/wk</Text>
                </View>
                <View style={[styles.hoursChip, !resolved && styles.hoursOverlapChip]}>
                  <Text
                    style={[
                      styles.hoursChipText,
                      !resolved ? styles.hoursOverlapText : { color: Colors.onTertiaryContainer },
                    ]}
                  >
                    {resolved ? 'Overlap: 0 hr' : 'Overlap: 1 hr'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Collision Comparison Block */}
          <View style={styles.collisionBlock}>
            {/* Candidate Request (CSE-C) */}
            <View style={styles.candidateSlotBox}>
              <View style={styles.slotBoxTop}>
                <Text style={styles.slotBoxType}>CANDIDATE REQUEST (SECTION C)</Text>
                <View style={styles.slotTimeChip}>
                  <Text style={styles.slotTimeChipText}>
                    {resolved ? 'FRI • P1' : 'WED • P3'}
                  </Text>
                </View>
              </View>
              <Text style={styles.slotCourseName}>22CSC14 Principles of Compiler Design</Text>
              <View style={styles.slotMetaRow}>
                <View style={styles.slotMetaItem}>
                  <MaterialIcons name="meeting-room" size={14} color={Colors.secondary} />
                  <Text style={styles.slotMetaText}>Room CSE-204 (Section C)</Text>
                </View>
                <View style={styles.slotMetaItem}>
                  <MaterialIcons name="schedule" size={14} color={Colors.secondary} />
                  <Text style={styles.slotMetaText}>
                    {resolved ? '09:15 AM – 10:05 AM' : '11:10 AM – 12:00 PM'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Overlap Indicator */}
            <View style={styles.overlapIconWrapper}>
              <View
                style={[
                  styles.overlapCircle,
                  resolved && { backgroundColor: Colors.onTertiaryContainer },
                ]}
              >
                <MaterialIcons
                  name={resolved ? 'check' : 'close'}
                  size={16}
                  color="#ffffff"
                />
              </View>
            </View>

            {/* Colliding Roster (CSE-A) */}
            <View
              style={[
                styles.collidingSlotBox,
                resolved && { backgroundColor: Colors.surfaceContainerLow },
              ]}
            >
              <View style={styles.slotBoxTop}>
                <Text
                  style={[
                    styles.collidingType,
                    resolved && { color: Colors.onSurfaceVariant },
                  ]}
                >
                  COLLIDING ROSTER (SECTION A)
                </Text>
                <View
                  style={[
                    styles.collidingLockChip,
                    resolved && { backgroundColor: Colors.surfaceContainerHigh },
                  ]}
                >
                  <Text
                    style={[
                      styles.collidingLockText,
                      resolved && { color: Colors.primary },
                    ]}
                  >
                    LOCKED • CSE-A
                  </Text>
                </View>
              </View>
              <Text style={styles.slotCourseName}>22CSC14 Principles of Compiler Design</Text>
              <View style={styles.slotMetaRow}>
                <View style={styles.slotMetaItem}>
                  <MaterialIcons
                    name="meeting-room"
                    size={14}
                    color={resolved ? Colors.onSurfaceVariant : Colors.error}
                  />
                  <Text style={styles.slotMetaText}>Room CSE-102 (Section A)</Text>
                </View>
                <View style={styles.slotMetaItem}>
                  <MaterialIcons
                    name="schedule"
                    size={14}
                    color={resolved ? Colors.onSurfaceVariant : Colors.error}
                  />
                  <Text style={styles.slotMetaText}>11:10 AM – 12:00 PM</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Reason Box */}
          <View style={styles.reasonBox}>
            <MaterialIcons name="gavel" size={16} color={Colors.secondary} />
            <Text style={styles.reasonText}>
              <Text style={styles.boldPrimary}>Constraint Reason: </Text>
              Faculty member cannot teach two separate classes in the same period. Anna University & NEC autonomous rule breach.
            </Text>
          </View>
        </View>

        {/* Visual Slot Diagram */}
        <View style={styles.diagramCard}>
          <View style={styles.diagramHeader}>
            <View style={styles.diagramHeaderLeft}>
              <MaterialIcons name="calendar-view-week" size={18} color={Colors.secondary} />
              <Text style={styles.diagramTitle}>Visual Slot Collision Diagram</Text>
            </View>
            <Text style={styles.diagramSub}>Wednesday Schedule</Text>
          </View>

          <View style={styles.slotGrid}>
            <View style={styles.slotCol}><Text style={styles.slotLabel}>P1 (09:15)</Text></View>
            <View style={styles.slotCol}><Text style={styles.slotLabel}>P2 (10:05)</Text></View>
            <View
              style={[
                styles.slotCol,
                !resolved ? styles.slotColError : styles.slotColResolved,
              ]}
            >
              <Text
                style={[
                  styles.slotLabel,
                  !resolved ? styles.slotLabelError : styles.slotLabelResolved,
                ]}
              >
                P3 (11:10)
              </Text>
            </View>
            <View style={styles.slotCol}><Text style={styles.slotLabel}>P4 (12:00)</Text></View>
          </View>

          {/* Collision Matrix detail */}
          <View style={styles.matrixDetailBox}>
            <View style={styles.matrixDetailTop}>
              <View style={styles.matrixDetailTag}>
                <MaterialIcons
                  name={resolved ? 'check-circle' : 'bolt'}
                  size={14}
                  color={resolved ? Colors.onTertiaryContainer : Colors.error}
                />
                <Text
                  style={[
                    styles.matrixDetailTagText,
                    resolved && { color: Colors.onTertiaryContainer },
                  ]}
                >
                  {resolved ? 'Period 3 Collision Resolved' : 'Period 3 Direct Collision Matrix'}
                </Text>
              </View>
              <View
                style={[
                  styles.criticalChip,
                  resolved && { backgroundColor: Colors.tertiaryFixed },
                ]}
              >
                <Text
                  style={[
                    styles.criticalChipText,
                    resolved && { color: Colors.onTertiaryFixed },
                  ]}
                >
                  {resolved ? 'CLEAN' : 'CRITICAL LOCK'}
                </Text>
              </View>
            </View>

            <View style={styles.matrixRows}>
              <View style={styles.matrixRowItem}>
                <Text style={styles.matrixDeptLabel}>CSE-A (ROOM 102)</Text>
                <Text style={styles.matrixCourseLabel}>22CSC14 PCD</Text>
                <Text style={styles.matrixFacultyLabel}>Ms. K. Shanmugapriya</Text>
              </View>
              <View
                style={[
                  styles.matrixRowItem,
                  !resolved && styles.matrixRowItemError,
                  resolved && styles.matrixRowItemResolved,
                ]}
              >
                <Text
                  style={[
                    styles.matrixDeptLabel,
                    !resolved ? { color: Colors.error } : { color: Colors.onTertiaryContainer },
                  ]}
                >
                  CSE-C ({resolved ? 'FRI P1' : 'ROOM 204'})
                </Text>
                <Text style={styles.matrixCourseLabel}>22CSC14 PCD</Text>
                <Text
                  style={[
                    styles.matrixFacultyLabel,
                    !resolved ? { color: Colors.error } : { color: Colors.onTertiaryContainer },
                  ]}
                >
                  {resolved ? 'Shifted to Fri P1' : 'Requested Conflict'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Solver Regeneration Strategies */}
        <View style={styles.strategiesCard}>
          <View>
            <View style={styles.strategiesTitleRow}>
              <MaterialIcons name="auto-mode" size={20} color={Colors.secondary} />
              <Text style={styles.strategiesTitle}>Regenerate Timetable</Text>
            </View>
            <Text style={styles.strategiesSubtitle}>
              Select a solver heuristic to eliminate conflicts across candidate schedule.
            </Text>
          </View>

          <View style={styles.optionsList}>
            {strategies.map((strat) => {
              const isSelected = selectedStrategy === strat.id;
              return (
                <Pressable
                  key={strat.id}
                  style={[
                    styles.strategyCard,
                    isSelected ? styles.strategyCardActive : styles.strategyCardInactive,
                  ]}
                  onPress={() => setSelectedStrategy(strat.id)}
                >
                  <View style={styles.strategyTop}>
                    <View style={styles.radioCircle}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <View style={styles.strategyContent}>
                      <View style={styles.strategyTitleRow}>
                        <Text style={styles.strategyTitleText}>{strat.title}</Text>
                        <View style={styles.strategyTag}>
                          <Text style={styles.strategyTagText}>{strat.tag}</Text>
                        </View>
                      </View>
                      <Text style={styles.strategyDescText}>{strat.desc}</Text>
                      <View style={styles.strategyBadgeRow}>
                        <MaterialIcons
                          name="check-circle"
                          size={12}
                          color={Colors.secondary}
                        />
                        <Text style={styles.strategyBadgeText}>{strat.badge}</Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <PrimaryButton
            title={
              isRegenerating
                ? 'Solving Heuristics...'
                : resolved
                ? 'Regenerated (0 Conflicts)'
                : 'Regenerate Timetable'
            }
            icon={resolved ? 'check-circle' : 'bolt'}
            loading={isRegenerating}
            onPress={handleRegenerate}
            style={[
              styles.regenBtn,
              resolved && { backgroundColor: Colors.tertiaryContainer },
            ]}
            textStyle={resolved && { color: Colors.tertiaryFixed }}
          />

          <PrimaryButton
            title="Manual Faculty Substitution"
            variant="outline"
            icon="person-add"
            onPress={() => router.push('/coordinator/faculty-assignment')}
            style={styles.subBtn}
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
  conflictHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  candidateText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
    letterSpacing: 0.6,
  },
  conflictTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 1,
  },
  ruleBreachBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.errorContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  ruleBreachBadgeClean: {
    backgroundColor: Colors.tertiaryFixed,
  },
  ruleBreachText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onErrorContainer,
    fontFamily: Typography.labelMono.fontFamily,
  },
  ruleBreachTextClean: {
    color: Colors.onTertiaryFixed,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.errorContainer,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },
  resolvedBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.tertiaryContainer,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },
  warningIconBox: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resolvedIconBox: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.onTertiaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.error,
  },
  resolvedTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.tertiaryFixed,
  },
  warningDesc: {
    fontSize: 11,
    color: Colors.onErrorContainer,
    marginTop: 2,
    lineHeight: 15,
  },
  resolvedDesc: {
    fontSize: 11,
    color: Colors.inverseOnSurface,
    marginTop: 2,
    lineHeight: 15,
  },
  facultyDetailCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    gap: Spacing.md,
    ...Shadows.sm,
  },
  facultyHeadRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  facultyName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  empBadge: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: BorderRadius.xs,
  },
  empBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  facultyDept: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  hoursRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  hoursChip: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  hoursOverlapChip: {
    backgroundColor: 'rgba(186, 26, 26, 0.1)',
  },
  hoursChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  hoursOverlapText: {
    color: Colors.error,
    fontWeight: '700',
  },
  collisionBlock: {
    gap: 2,
  },
  candidateSlotBox: {
    backgroundColor: Colors.surfaceContainerLow,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: 4,
  },
  slotBoxTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slotBoxType: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
    letterSpacing: 0.5,
  },
  slotTimeChip: {
    backgroundColor: Colors.surfaceContainerHighest,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  slotTimeChipText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  slotCourseName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  slotMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 2,
  },
  slotMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  slotMetaText: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
  overlapIconWrapper: {
    alignItems: 'center',
    marginVertical: -8,
    zIndex: 10,
  },
  overlapCircle: {
    width: 26,
    height: 26,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  collidingSlotBox: {
    backgroundColor: 'rgba(255, 218, 214, 0.6)',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: 4,
  },
  collidingType: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.error,
    fontFamily: Typography.labelMono.fontFamily,
    letterSpacing: 0.5,
  },
  collidingLockChip: {
    backgroundColor: Colors.error,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  collidingLockText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: Typography.labelMono.fontFamily,
  },
  reasonBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.surfaceContainer,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  reasonText: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    lineHeight: 16,
    flex: 1,
  },
  boldPrimary: {
    fontWeight: '700',
    color: Colors.primary,
  },
  diagramCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  diagramHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  diagramHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  diagramTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  diagramSub: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  slotGrid: {
    flexDirection: 'row',
    gap: 4,
  },
  slotCol: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  slotColError: {
    backgroundColor: Colors.error,
  },
  slotColResolved: {
    backgroundColor: Colors.tertiaryFixed,
  },
  slotLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  slotLabelError: {
    color: '#ffffff',
    fontWeight: '800',
  },
  slotLabelResolved: {
    color: Colors.onTertiaryFixed,
    fontWeight: '800',
  },
  matrixDetailBox: {
    backgroundColor: Colors.surfaceContainerLow,
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    gap: 6,
  },
  matrixDetailTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  matrixDetailTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  matrixDetailTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.error,
    fontFamily: Typography.labelMono.fontFamily,
  },
  criticalChip: {
    backgroundColor: Colors.error,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
  },
  criticalChipText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#ffffff',
    fontFamily: Typography.labelMono.fontFamily,
  },
  matrixRows: {
    flexDirection: 'row',
    gap: 6,
  },
  matrixRowItem: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
    padding: 8,
    borderRadius: BorderRadius.md,
  },
  matrixRowItemError: {
    backgroundColor: 'rgba(255, 218, 214, 0.7)',
  },
  matrixRowItemResolved: {
    backgroundColor: 'rgba(133, 248, 196, 0.25)',
  },
  matrixDeptLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  matrixCourseLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 2,
  },
  matrixFacultyLabel: {
    fontSize: 10,
    color: Colors.secondary,
    marginTop: 1,
  },
  strategiesCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  strategiesTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  strategiesTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  strategiesSubtitle: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  optionsList: {
    gap: 6,
    marginVertical: 4,
  },
  strategyCard: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  strategyCardActive: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderColor: Colors.secondary,
  },
  strategyCardInactive: {
    backgroundColor: Colors.surfaceContainerLow,
    borderColor: 'transparent',
  },
  strategyTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondary,
  },
  strategyContent: {
    flex: 1,
  },
  strategyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  strategyTitleText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  strategyTag: {
    backgroundColor: Colors.tertiaryContainer,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
  },
  strategyTagText: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.onTertiaryContainer,
    fontFamily: Typography.labelMono.fontFamily,
  },
  strategyDescText: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
    lineHeight: 15,
  },
  strategyBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  strategyBadgeText: {
    fontSize: 9,
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
    fontWeight: '600',
  },
  regenBtn: {
    width: '100%',
    backgroundColor: Colors.primaryContainer,
  },
  subBtn: {
    width: '100%',
  },
});
