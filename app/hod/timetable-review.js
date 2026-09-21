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
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import HODHeader from '../../components/HODHeader';
import HODBottomNav from '../../components/HODBottomNav';
import PrimaryButton from '../../components/PrimaryButton';
import {
  getAcademicContext,
  getTimetableVersion,
  getClassTimetable,
  subscribeTimetableVersion,
  TIMETABLE_STATUSES,
} from '../../constants/demoData';

export default function ClassTimetableReviewScreen() {
  const router = useRouter();
  const context = getAcademicContext();
  const activeSection = context.section || 'CSE-C';
  const [timetableVersion, setTimetableVersion] = useState(getTimetableVersion());
  const [selectedDay, setSelectedDay] = useState('all');

  useEffect(() => {
    const unsub = subscribeTimetableVersion((v) => setTimetableVersion({ ...v }));
    return unsub;
  }, []);

  const rawSessions = getClassTimetable({ section: activeSection, department: 'CSE' });
  const sessions = rawSessions;

  const days = [
    { id: 'all', label: 'All Days' },
    { id: 'MON', label: 'Mon (7P)' },
    { id: 'TUE', label: 'Tue (Lab)' },
    { id: 'WED', label: 'Wed (7P)' },
    { id: 'THU', label: 'Thu (Lab)' },
    { id: 'FRI', label: 'Fri (7P)' },
  ];

  const filteredSessions =
    selectedDay === 'all'
      ? sessions
      : sessions.filter((s) => s.day === selectedDay);

  const displayStatus = timetableVersion.status || TIMETABLE_STATUSES.NO_TIMETABLE;
  const isApproved = displayStatus === 'APPROVED' || displayStatus === 'PUBLISHED';
  const hasTimetable = sessions.length > 0;

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <HODHeader
        title="Class Timetable Review"
        showBack={true}
        activeCohort={`${context.year || 'III'} / ${context.semester || 'V'} / ${activeSection}`}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Review Context Header Card */}
        <View style={styles.contextCard}>
          <View style={styles.contextHeaderRow}>
            <View style={styles.reviewTag}>
              <MaterialIcons name="rate-review" size={13} color="#FFFFFF" />
              <Text style={styles.reviewTagText}>HOD TIMETABLE AUDIT DESK</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                isApproved ? styles.statusApproved : styles.statusPending,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  isApproved ? styles.statusApprovedText : styles.statusPendingText,
                ]}
              >
                {displayStatus}
              </Text>
            </View>
          </View>

          <Text style={styles.gridTitle}>
            CSE • {context.year || 'Tier'} • {context.semester || 'Term'} • {activeSection}
          </Text>
          <Text style={styles.gridMeta}>
            Version: {timetableVersion.versionLabel || 'Not Available'} • {sessions.length} Scheduled Periods
          </Text>

          {/* Quick Metrics */}
          <View style={styles.metricsBar}>
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>
                {hasTimetable ? `${sessions.length}/${timetableVersion.totalRequiredPeriods || 35}` : '0'}
              </Text>
              <Text style={styles.metricLabel}>Periods Filled</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>
                {hasTimetable ? `${timetableVersion.hardConflicts ?? 0}` : 'N/A'}
              </Text>
              <Text style={styles.metricLabel}>Hard Conflicts</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricVal}>
                {hasTimetable ? 'Verified' : 'Not Ready'}
              </Text>
              <Text style={styles.metricLabel}>Validation</Text>
            </View>
          </View>
        </View>

        {/* Day Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        >
          {days.map((d) => {
            const isSelected = selectedDay === d.id;
            return (
              <Pressable
                key={d.id}
                style={[styles.dayTab, isSelected && styles.dayTabActive]}
                onPress={() => setSelectedDay(d.id)}
              >
                <Text style={[styles.dayTabText, isSelected && styles.dayTabTextActive]}>
                  {d.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Timetable Session Grid */}
        <View style={styles.sessionList}>
          {!hasTimetable ? (
            <View style={styles.emptyCard}>
              <MaterialIcons name="event-busy" size={40} color={Colors.outlineVariant} />
              <Text style={styles.emptyTitle}>No Timetable Generated</Text>
              <Text style={styles.emptySub}>
                The Academic Coordinator constraint solver has not run or published a class timetable for this cohort yet.
              </Text>
              <Pressable
                style={styles.emptyActionBtn}
                onPress={() => router.push('/hod/context')}
              >
                <Text style={styles.emptyActionText}>Verify Academic Context</Text>
                <MaterialIcons name="arrow-forward" size={14} color="#0F2942" />
              </Pressable>
            </View>
          ) : (
            filteredSessions.map((session) => (
              <View key={session.id} style={styles.sessionCard}>
                <View style={styles.sessionTopRow}>
                  <View style={styles.periodBadge}>
                    <Text style={styles.periodText}>{session.period}</Text>
                    <Text style={styles.dayText}>{session.day}</Text>
                  </View>

                  <View style={styles.courseInfoCol}>
                    <View style={styles.codeRow}>
                      <Text style={styles.courseCodeText}>{session.code}</Text>
                      <View
                        style={[
                          styles.catBadge,
                          session.type === 'THEORY'
                            ? styles.catTheory
                            : session.type === 'LAB'
                            ? styles.catLab
                            : styles.catElective,
                        ]}
                      >
                        <Text style={styles.catBadgeText}>{session.type}</Text>
                      </View>
                    </View>
                    <Text style={styles.courseNameText}>{session.name}</Text>
                  </View>

                  <View style={styles.roomBox}>
                    <MaterialIcons name="room" size={12} color="#64748B" />
                    <Text style={styles.roomText}>{session.room}</Text>
                  </View>
                </View>

                <View style={styles.sessionBottomRow}>
                  <MaterialIcons name="person" size={14} color="#0F2942" />
                  <Text style={styles.facultyText}>{session.faculty}</Text>
                  <Text style={styles.timeTag}>{session.time}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Primary Action Button */}
        <View style={styles.ctaBox}>
          <Text style={styles.ctaTitle}>Ready to Ratify Timetable?</Text>
          <Text style={styles.ctaDesc}>
            {hasTimetable
              ? 'Review constraint clearance and issue statutory approval order or request revision from the Academic Coordinator.'
              : 'Class timetable must be synthesized and submitted before HOD statutory approval can be executed.'}
          </Text>
          <PrimaryButton
            title="Proceed to HOD Timetable Approval"
            icon="gavel"
            iconRight="arrow-forward"
            onPress={() => router.push('/hod/approval')}
            style={styles.ctaBtn}
          />
        </View>
      </ScrollView>

      <HODBottomNav activeTab="timetable" />
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
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  contextCard: {
    backgroundColor: '#0F2942',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  contextHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 4,
  },
  reviewTagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusApproved: {
    backgroundColor: '#ECFDF5',
  },
  statusApprovedText: {
    color: '#059669',
    fontSize: 9,
    fontWeight: '800',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusPendingText: {
    color: '#D97706',
    fontSize: 9,
    fontWeight: '800',
  },
  gridTitle: {
    ...Typography.titleMedium,
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 17,
    marginBottom: 2,
  },
  gridMeta: {
    ...Typography.bodySmall,
    color: '#CBD5E1',
    fontSize: 11,
    marginBottom: 10,
  },
  metricsBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: BorderRadius.md,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricVal: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  metricLabel: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  tabsRow: {
    gap: 8,
    paddingBottom: Spacing.md,
  },
  dayTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  dayTabActive: {
    backgroundColor: '#0F2942',
    borderColor: '#0F2942',
  },
  dayTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
  },
  dayTabTextActive: {
    color: '#FFFFFF',
  },
  sessionList: {
    gap: 10,
    marginBottom: Spacing.lg,
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    ...Shadows.sm,
  },
  sessionTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  periodBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    minWidth: 42,
  },
  periodText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F2942',
  },
  dayText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  courseInfoCol: {
    flex: 1,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  courseCodeText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F2942',
  },
  catBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  catBadgeText: {
    fontSize: 8,
    fontWeight: '800',
  },
  catTheory: {
    backgroundColor: '#EFF6FF',
    color: '#2563EB',
  },
  catLab: {
    backgroundColor: '#FEF3C7',
    color: '#D97706',
  },
  catElective: {
    backgroundColor: '#ECFDF5',
    color: '#059669',
  },
  courseNameText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  roomBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  roomText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  sessionBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 6,
    gap: 6,
  },
  facultyText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F2942',
    flex: 1,
  },
  timeTag: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  ctaBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    ...Shadows.sm,
  },
  ctaTitle: {
    ...Typography.titleSmall,
    color: '#0F2942',
    fontWeight: '800',
    fontSize: 14,
    marginBottom: 2,
  },
  ctaDesc: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
    marginBottom: 12,
  },
  ctaBtn: {
    backgroundColor: '#0F2942',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderStyle: 'dashed',
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    ...Typography.titleMedium,
    color: Colors.primary,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySub: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
  },
  emptyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceVariant,
  },
  emptyActionText: {
    ...Typography.labelMedium,
    color: '#0F2942',
    fontWeight: '700',
  },
});
