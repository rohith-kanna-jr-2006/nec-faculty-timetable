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

export default function TimetableValidationScreen() {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const hardConstraints = [
    {
      id: 'c1',
      title: 'Class Conflict',
      tag: 'ZERO ERR',
      desc: 'No two curriculum subjects overlapping for CSE-C.',
      icon: 'calendar-today',
      status: 'PASS',
    },
    {
      id: 'c2',
      title: 'Faculty Overlap',
      tag: 'ALL CLEAR',
      desc: 'Zero faculty double-bookings across college master db.',
      icon: 'person-check',
      status: 'PASS',
    },
    {
      id: 'c3',
      title: 'Period Volume',
      tag: '35/35 SLOTS',
      desc: 'Exact 35/35 weekly periods filled without unassigned blocks.',
      icon: 'pin',
      status: 'PASS',
    },
    {
      id: 'c4',
      title: 'Lab Continuity',
      tag: 'CONTIGUOUS',
      desc: 'FSD Lab & OOSE Lab mapped to 4 continuous periods unbroken.',
      icon: 'terminal',
      status: 'PASS',
    },
    {
      id: 'c5',
      title: 'Break Intervals',
      tag: 'REGULATION',
      desc: 'Morning 10:55, Lunch 12:50, Evening 03:25 strictly protected.',
      icon: 'free-breakfast',
      status: 'PASS',
    },
    {
      id: 'c6',
      title: 'Staff Allocation',
      tag: 'DUAL-FACULTY',
      desc: 'Primary and secondary lab instructors locked for full block.',
      icon: 'groups',
      status: 'PASS',
    },
  ];

  const softOptimizations = [
    {
      title: 'Theory Distribution',
      tag: 'EXCELLENT',
      percent: 96,
      desc: '96% spread across all 5 weekdays; zero back-to-back subject fatigue.',
    },
    {
      title: 'Same-Day Repetition',
      tag: 'LOW VARIANCE',
      percent: 100,
      desc: '0 duplicate theory modules within any single calendar instructional day.',
    },
    {
      title: 'AM / PM Cognitive Balance',
      tag: 'OPTIMAL',
      percent: 92,
      desc: 'Heavy courses isolated to peak morning attention hours.',
    },
    {
      title: 'Weekly Laboratory Spread',
      tag: 'BALANCED',
      percent: 95,
      desc: 'Practical labs placed on Tuesday & Thursday mornings; spaced rhythm.',
    },
  ];

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setIsPublished(true);
      Alert.alert(
        'Timetable Published Successfully',
        'Odd Semester 2024-25 timetable for III Year CSE-C is published and synchronized across Faculty Portal, Student App & Digital Signage.',
        [
          {
            text: 'View Weekly Grid',
            onPress: () => router.push('/(faculty)/weekly-timetable'),
          },
          {
            text: 'Back to Dashboard',
            onPress: () => router.push('/coordinator'),
          },
        ]
      );
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <ACHeader title="Validation" showBack={true} activeCohort="III / V / CSE-C" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Subtle Status Breadcrumb Context */}
        <View style={styles.breadcrumbRow}>
          <View style={styles.breadcrumbLeft}>
            <MaterialIcons name="verified-user" size={16} color={Colors.secondary} />
            <Text style={styles.breadcrumbText}>INSTITUTIONAL COMPLIANCE ENGINE</Text>
          </View>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>v4.8 Verified</Text>
          </View>
        </View>

        {/* Hero Banner */}
        <View style={styles.heroCard}>
          <View style={styles.sealCircle}>
            <MaterialIcons name="check" size={28} color={Colors.tertiaryFixed} />
          </View>
          <View style={styles.auditBadge}>
            <Text style={styles.auditBadgeText}>SYSTEM AUDIT PASSED</Text>
          </View>
          <Text style={styles.heroTitle}>VALID TIMETABLE</Text>
          <Text style={styles.heroSubtitle}>
            All hard institutional constraints satisfied. 0 collisions detected across campus nodes.
          </Text>

          <View style={styles.metricPillRow}>
            <View style={styles.metricPill}>
              <Text style={styles.metricPillNum}>6/6</Text>
              <Text style={styles.metricPillLabel}>Hard Constraints</Text>
            </View>
            <View style={styles.metricPill}>
              <Text style={[styles.metricPillNum, { color: Colors.secondary }]}>4/4</Text>
              <Text style={styles.metricPillLabel}>Soft Optimizations</Text>
            </View>
          </View>
        </View>

        {/* Section 1: Hard Constraints */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <MaterialIcons name="lock-clock" size={18} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Hard Constraints</Text>
            </View>
            <View style={styles.strictBadge}>
              <Text style={styles.strictBadgeText}>100% RIGID</Text>
            </View>
          </View>

          <View style={styles.constraintsList}>
            {hardConstraints.map((item) => (
              <View key={item.id} style={styles.constraintItem}>
                <View style={styles.constraintLeft}>
                  <View style={styles.constraintIconBox}>
                    <MaterialIcons name={item.icon} size={18} color={Colors.primary} />
                  </View>
                  <View style={styles.constraintContent}>
                    <View style={styles.constraintTitleRow}>
                      <Text style={styles.constraintTitle}>{item.title}</Text>
                      <View style={styles.constraintTag}>
                        <Text style={styles.constraintTagText}>{item.tag}</Text>
                      </View>
                    </View>
                    <Text style={styles.constraintDesc}>{item.desc}</Text>
                  </View>
                </View>
                <View style={styles.passBadge}>
                  <Text style={styles.passBadgeText}>PASS</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Section 2: Soft Pedagogical Optimizations */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <MaterialIcons name="auto-graph" size={18} color={Colors.secondary} />
              <Text style={styles.sectionTitle}>Pedagogical Optimizations</Text>
            </View>
            <Text style={styles.scoreText}>Score: 98.4%</Text>
          </View>

          <View style={styles.optimizationsList}>
            {softOptimizations.map((item, idx) => (
              <View key={idx} style={styles.optItem}>
                <View style={styles.optTop}>
                  <Text style={styles.optTitle}>{item.title}</Text>
                  <View style={styles.optTag}>
                    <Text style={styles.optTagText}>{item.tag}</Text>
                  </View>
                </View>
                <Text style={styles.optDesc}>{item.desc}</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${item.percent}%` },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Auditor Sign-off Card */}
        <View style={styles.signOffCard}>
          <View style={styles.signOffAvatar}>
            <MaterialIcons name="history-edu" size={18} color="#ffffff" />
          </View>
          <View style={styles.signOffContent}>
            <Text style={styles.signOffTitle}>CSE Timetable Committee Approved</Text>
            <Text style={styles.signOffSub}>Advisor Sign-off: Dr. S. K. Nandha, HoD / CSE</Text>
          </View>
        </View>

        {/* Footer Actions */}
        <View style={styles.actionBlock}>
          <PrimaryButton
            title={
              isPublishing
                ? 'Publishing CSE-C...'
                : isPublished
                ? 'Published & Synced'
                : 'Approve & Publish Timetable'
            }
            icon={isPublished ? 'done-all' : 'task-alt'}
            loading={isPublishing}
            onPress={handlePublish}
            style={[
              styles.publishBtn,
              isPublished && { backgroundColor: Colors.tertiaryContainer },
            ]}
            textStyle={isPublished && { color: Colors.tertiaryFixed }}
          />

          <PrimaryButton
            title="Simulate Faculty Conflict / Inspect Slots"
            variant="outline"
            icon="manage-search"
            onPress={() => router.push('/coordinator/conflict')}
            style={styles.simBtn}
          />
        </View>
      </ScrollView>

      <ACBottomNav activeTab="validation" />
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
  breadcrumbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  breadcrumbLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  breadcrumbText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
    letterSpacing: 0.6,
  },
  versionBadge: {
    backgroundColor: Colors.surfaceContainerHighest,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  versionText: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  heroCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: 6,
    ...Shadows.md,
  },
  sealCircle: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.tertiaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  auditBadge: {
    backgroundColor: 'rgba(133, 248, 196, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  auditBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.onTertiaryContainer,
    fontFamily: Typography.labelMono.fontFamily,
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: 280,
  },
  metricPillRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
    backgroundColor: Colors.surfaceContainerLow,
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    marginTop: 6,
  },
  metricPill: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
    padding: 10,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    ...Shadows.sm,
  },
  metricPillNum: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  metricPillLabel: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
    fontWeight: '500',
  },
  sectionBlock: {
    gap: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primary,
  },
  strictBadge: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  strictBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onTertiaryContainer,
    fontFamily: Typography.labelMono.fontFamily,
  },
  scoreText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  constraintsList: {
    gap: 6,
  },
  constraintItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  constraintLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  constraintIconBox: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  constraintContent: {
    flex: 1,
  },
  constraintTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  constraintTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  constraintTag: {
    backgroundColor: 'rgba(133, 248, 196, 0.3)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
  },
  constraintTagText: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.onTertiaryContainer,
    fontFamily: Typography.labelMono.fontFamily,
  },
  constraintDesc: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
    lineHeight: 15,
  },
  passBadge: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
  },
  passBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.onTertiaryContainer,
    fontFamily: Typography.labelMono.fontFamily,
  },
  optimizationsList: {
    gap: 8,
  },
  optItem: {
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    gap: 4,
    ...Shadows.sm,
  },
  optTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  optTag: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: BorderRadius.xs,
  },
  optTagText: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  optDesc: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    lineHeight: 15,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.secondaryContainer,
    borderRadius: BorderRadius.full,
  },
  signOffCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(219, 225, 255, 0.4)',
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHighest,
  },
  signOffAvatar: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOffContent: {
    flex: 1,
  },
  signOffTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  signOffSub: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    marginTop: 1,
  },
  actionBlock: {
    gap: 8,
    marginTop: 4,
  },
  publishBtn: {
    width: '100%',
  },
  simBtn: {
    width: '100%',
  },
});
