import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import AppHeader from '../../components/AppHeader';
import Card from '../../components/Card';
import WorkloadCard from '../../components/WorkloadCard';
import PrimaryButton from '../../components/PrimaryButton';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import {
  FACULTY_PROFILE,
  DEFAULT_FACULTY_PROFILE,
  ASSIGNED_COURSES,
  NOTIFICATIONS_DATA,
  getTodaySchedule,
  getFacultyWorkload,
  getFacultySessionsByDay,
} from '../../constants/demoData';

export default function FacultyDashboard() {
  const router = useRouter();
  const [selectedDayTab, setSelectedDayTab] = useState('today');
  const todayData = getTodaySchedule();
  const workload = getFacultyWorkload();
  const unreadNotifs = NOTIFICATIONS_DATA.filter((n) => n.status === 'unread');
  const facultyProfile = FACULTY_PROFILE || DEFAULT_FACULTY_PROFILE || {};

  return (
    <View style={styles.screenContainer}>
      <AppHeader
        title="NEC Timetable"
        subtitle="Faculty Workload"
        badgeText="FACULTY"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Identity Card */}
        <Card variant="low" style={styles.identityCard}>
          <View style={styles.identityTopRow}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarInitials}>{facultyProfile.initials || 'CN'}</Text>
              <View style={styles.verifiedDot}>
                <MaterialIcons name="check" size={10} color="#ffffff" />
              </View>
            </View>

            <View style={styles.identityDetails}>
              <View style={styles.nameIdRow}>
                <Text style={styles.facultyName} numberOfLines={1}>
                  {facultyProfile.name || 'Faculty Member'}
                </Text>
                <View style={styles.idBadge}>
                  <Text style={styles.idBadgeText}>{facultyProfile.id || 'FAC'}</Text>
                </View>
              </View>

              <Text style={styles.facultyTitle} numberOfLines={1}>
                {facultyProfile.designation || 'Faculty'} • {facultyProfile.department || 'CSE'}
              </Text>

              <View style={styles.identityTagsRow}>
                <View style={styles.termBadge}>
                  <Text style={styles.termBadgeText}>{facultyProfile.academicYear || 'AY 2024-25'}</Text>
                </View>
                <Text style={styles.semText}>{facultyProfile.semester || 'Odd Semester'}</Text>
                <View style={styles.viewerBadge}>
                  <MaterialIcons name="verified" size={12} color={Colors.onTertiaryContainer} />
                  <Text style={styles.viewerBadgeText}>Viewer</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Switch to AC Portal */}
          <Pressable
            style={({ pressed }) => [
              styles.acQuickSwitchRow,
              pressed && styles.acQuickSwitchRowPressed,
            ]}
            onPress={() => router.push('/coordinator')}
          >
            <View style={styles.acQuickSwitchLeft}>
              <MaterialIcons name="admin-panel-settings" size={15} color={Colors.secondary} />
              <Text style={styles.acQuickSwitchText}>Academic Coordinator Console</Text>
            </View>
            <View style={styles.acQuickSwitchAction}>
              <Text style={styles.acQuickSwitchActionText}>Switch to AC View</Text>
              <MaterialIcons name="arrow-forward" size={12} color={Colors.secondary} />
            </View>
          </Pressable>
        </Card>

        {/* Today's Teaching Schedule Overview */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <MaterialIcons name="calendar-today" size={18} color={Colors.secondary} />
              <Text style={styles.sectionHeading}>Today's Schedule</Text>
            </View>
            <View style={styles.dateChip}>
              <Text style={styles.dateChipText}>{todayData.dateLabel}</Text>
            </View>
          </View>

          {/* Hero Highlight: Next Class */}
          <Card variant="primaryContainer" style={styles.heroCard}>
            <View style={styles.heroHeader}>
              <View style={styles.startsInBadge}>
                <View style={styles.pingDot} />
                <Text style={styles.startsInText}>Starts in 45m</Text>
              </View>
              <Text style={styles.heroPeriodTime}>Period 4 • 12:00 – 12:50 PM</Text>
            </View>

            <View style={styles.heroBody}>
              <Text style={styles.heroCategory}>PROFESSIONAL ELECTIVE II</Text>
              <Text style={styles.heroSubject}>22CSX42 — UI/UX Design</Text>
            </View>

            <View style={styles.heroGrid}>
              <View style={styles.heroInfoBox}>
                <MaterialIcons name="groups" size={16} color={Colors.primaryFixed} />
                <View>
                  <Text style={styles.heroInfoLabel}>COHORT</Text>
                  <Text style={styles.heroInfoValue}>SEC C (Sem V)</Text>
                </View>
              </View>

              <View style={styles.heroInfoBox}>
                <MaterialIcons name="meeting-room" size={16} color={Colors.primaryFixed} />
                <View>
                  <Text style={styles.heroInfoLabel}>VENUE</Text>
                  <Text style={styles.heroInfoValue}>CSE-204 (Smart)</Text>
                </View>
              </View>
            </View>

            <View style={styles.heroFooter}>
              <View style={styles.planRow}>
                <MaterialIcons name="assignment" size={14} color={Colors.secondaryFixed} />
                <Text style={styles.planText}>Session Plan #14</Text>
              </View>
              <Text style={styles.weekText}>Week 6 of 15</Text>
            </View>
          </Card>

          {/* Linear Day Breakdown */}
          <Card style={styles.timelineCard}>
            <Text style={styles.timelineTitle}>Day Timeline (2 Sessions Assigned)</Text>

            <View style={styles.timelineItemsList}>
              {/* P2 (Completed) */}
              <View style={styles.timelineRow}>
                <Text style={styles.timelineTime}>10:05 AM</Text>
                <View style={[styles.timelineStrip, { backgroundColor: Colors.onTertiaryContainer }]} />
                <View style={styles.timelineContent}>
                  <View style={styles.timelineTop}>
                    <Text style={styles.timelineCourse}>UI/UX Design</Text>
                    <View style={styles.doneBadge}>
                      <Text style={styles.doneBadgeText}>Done</Text>
                    </View>
                  </View>
                  <Text style={styles.timelineSub}>P2 • Sec B (CSE-202)</Text>
                </View>
              </View>

              {/* Morning Tea Break */}
              <View style={styles.breakRow}>
                <Text style={styles.breakTime}>10:55 AM</Text>
                <View style={styles.breakDivider} />
                <Text style={styles.breakText}>Morning Tea Break (15m)</Text>
                <View style={styles.breakDivider} />
              </View>

              {/* P4 (Upcoming) */}
              <View style={[styles.timelineRow, styles.upcomingTimelineRow]}>
                <Text style={[styles.timelineTime, { color: Colors.secondary, fontWeight: '700' }]}>
                  12:00 PM
                </Text>
                <View style={[styles.timelineStrip, { backgroundColor: Colors.secondary }]} />
                <View style={styles.timelineContent}>
                  <View style={styles.timelineTop}>
                    <Text style={[styles.timelineCourse, { color: Colors.primary, fontWeight: '700' }]}>
                      UI/UX Design
                    </Text>
                    <View style={styles.upcomingBadge}>
                      <Text style={styles.upcomingBadgeText}>Upcoming</Text>
                    </View>
                  </View>
                  <Text style={styles.timelineSub}>P4 • Sec C (CSE-204)</Text>
                </View>
              </View>

              {/* Lunch Interval */}
              <View style={styles.breakRow}>
                <Text style={styles.breakTime}>12:50 PM</Text>
                <View style={styles.breakDivider} />
                <Text style={styles.breakText}>Lunch Interval (55m)</Text>
                <View style={styles.breakDivider} />
              </View>

              {/* P5-P7 (Free) */}
              <View style={[styles.timelineRow, { opacity: 0.8 }]}>
                <Text style={styles.timelineTime}>01:45 PM</Text>
                <View style={[styles.timelineStrip, { backgroundColor: Colors.outlineVariant }]} />
                <View style={styles.timelineContent}>
                  <View style={styles.timelineTop}>
                    <Text style={[styles.timelineCourse, { color: Colors.onSurfaceVariant }]}>
                      No Teaching Sessions
                    </Text>
                    <View style={styles.freeBadge}>
                      <Text style={styles.freeBadgeText}>P5 – P7 Free</Text>
                    </View>
                  </View>
                  <Text style={styles.timelineSub}>Department R&D / Mentoring slot</Text>
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* My Timetable Quick Access */}
        <Card style={styles.quickAccessCard}>
          <View style={styles.quickHeader}>
            <View style={styles.quickTitleRow}>
              <MaterialIcons name="table-chart" size={18} color={Colors.secondary} />
              <Text style={styles.quickTitle}>My Timetable View</Text>
            </View>
            <Text style={styles.syncedLiveText}>Synced Live</Text>
          </View>

          {/* Toggle buttons */}
          <View style={styles.toggleContainer}>
            <Pressable
              style={[
                styles.toggleBtn,
                selectedDayTab === 'today' && styles.toggleBtnActive,
              ]}
              onPress={() => setSelectedDayTab('today')}
            >
              <Text
                style={[
                  styles.toggleBtnText,
                  selectedDayTab === 'today' && styles.toggleBtnTextActive,
                ]}
              >
                Today's Schedule
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.toggleBtn,
                selectedDayTab === 'week' && styles.toggleBtnActive,
              ]}
              onPress={() => {
                setSelectedDayTab('week');
                router.push('/(faculty)/weekly-timetable');
              }}
            >
              <Text
                style={[
                  styles.toggleBtnText,
                  selectedDayTab === 'week' && styles.toggleBtnTextActive,
                ]}
              >
                Weekly (Mon–Fri)
              </Text>
            </Pressable>
          </View>

          {/* Quick Day Strip Preview (Data-Derived) */}
          <View style={styles.dayStripContainer}>
            {['MON', 'TUE', 'WED', 'THU', 'FRI'].map((day, idx) => {
              const count = getFacultySessionsByDay(day).length;
              const isToday = day === 'WED';
              return (
                <React.Fragment key={day}>
                  {idx > 0 && <View style={styles.stripDivider} />}
                  <View style={[styles.dayCol, isToday && styles.activeDayCol]}>
                    <Text
                      style={[
                        styles.dayColLabel,
                        isToday && { color: Colors.secondary, fontWeight: '700' },
                      ]}
                    >
                      {day}
                    </Text>
                    <Text
                      style={[
                        styles.dayColVal,
                        isToday && { color: Colors.secondary, fontWeight: '700' },
                      ]}
                    >
                      {count} P
                    </Text>
                  </View>
                </React.Fragment>
              );
            })}
          </View>

          <PrimaryButton
            title="Open My Complete Timetable"
            iconRight="arrow-forward"
            onPress={() => router.push('/(faculty)/timetable')}
            style={styles.openTimetableBtn}
          />
        </Card>

        {/* My Assigned Courses Card */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>My Assigned Courses</Text>
            <Text style={styles.coursesCountBadge}>1 Course • 2 Sections</Text>
          </View>

          {ASSIGNED_COURSES.map((course) => (
            <Card key={course.code} style={styles.courseCard}>
              <View style={styles.courseHeader}>
                <View style={styles.courseInfoLeft}>
                  <View style={styles.courseCodesRow}>
                    <View style={styles.courseCodeBadge}>
                      <Text style={styles.courseCodeText}>{course.code}</Text>
                    </View>
                    <View style={styles.courseRegBadge}>
                      <Text style={styles.courseRegText}>{course.reg}</Text>
                    </View>
                  </View>
                  <Text style={styles.courseTitle}>{course.name}</Text>
                  <Text style={styles.courseCategory}>{course.category}</Text>
                </View>

                <View style={styles.courseIconBox}>
                  <MaterialIcons name="devices" size={22} color={Colors.primary} />
                </View>
              </View>

              <View style={styles.sectionsGrid}>
                {course.sections.map((sec) => (
                  <View key={sec.section} style={styles.secBox}>
                    <Text style={styles.secLabel}>{sec.section}</Text>
                    <Text style={styles.secLoad}>{sec.periodsPerWeek} Periods / Week</Text>
                    <Text style={styles.secVenue}>Venue: {sec.room}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.courseFooter}>
                <View style={styles.syllabusRow}>
                  <MaterialIcons name="menu-book" size={14} color={Colors.secondary} />
                  <Text style={styles.syllabusText}>Syllabus Coverage: Unit II</Text>
                </View>
                <Text style={styles.creditsText}>{course.contactPeriods} Credits Contact</Text>
              </View>
            </Card>
          ))}
        </View>

        {/* Teaching Workload Summary */}
        <WorkloadCard workload={workload} style={styles.workloadBox} />

        {/* Notifications Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <MaterialIcons name="notifications" size={18} color={Colors.secondary} />
              <Text style={styles.sectionHeading}>Notifications</Text>
            </View>
            <Pressable onPress={() => router.push('/(faculty)/notifications')}>
              <Text style={styles.viewAllNotifsText}>{unreadNotifs.length} Unread</Text>
            </Pressable>
          </View>

          {NOTIFICATIONS_DATA.slice(0, 2).map((notif) => (
            <Pressable
              key={notif.id}
              onPress={() => router.push('/(faculty)/notifications')}
            >
              <Card style={styles.miniNotifCard}>
                <View style={styles.miniNotifRow}>
                  <View style={styles.miniNotifIcon}>
                    <MaterialIcons
                      name={notif.icon === 'campaign' ? 'publish' : 'room-preferences'}
                      size={18}
                      color={Colors.secondary}
                    />
                  </View>
                  <View style={styles.miniNotifCol}>
                    <View style={styles.miniNotifTop}>
                      <Text style={styles.miniNotifTitle}>{notif.title}</Text>
                      <Text style={styles.miniNotifTime}>{notif.timestamp}</Text>
                    </View>
                    <Text style={styles.miniNotifMsg} numberOfLines={2}>
                      {notif.message}
                    </Text>
                  </View>
                </View>
              </Card>
            </Pressable>
          ))}
        </View>

        {/* Bottom Read-Only Context Notice */}
        <View style={styles.bottomNotice}>
          <MaterialIcons name="lock" size={14} color={Colors.onSurfaceVariant} />
          <Text style={styles.bottomNoticeText}>
            Faculty Viewer Portal • Timetable generated & locked by AC
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.margin,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  identityCard: {
    marginBottom: Spacing.md,
  },
  identityTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  verifiedDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.onTertiaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityDetails: {
    flex: 1,
  },
  nameIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  facultyName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.onSurface,
    flex: 1,
  },
  idBadge: {
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  idBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primaryFixed,
    fontFamily: Typography.labelMono.fontFamily,
  },
  facultyTitle: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  identityTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  termBadge: {
    backgroundColor: Colors.surfaceContainerHighest,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  termBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  semText: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  viewerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.surfaceContainerLowest,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    ...Shadows.sm,
  },
  viewerBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.onTertiaryContainer,
  },
  acQuickSwitchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLowest,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHigh,
  },
  acQuickSwitchRowPressed: {
    opacity: 0.85,
    backgroundColor: Colors.surfaceContainer,
  },
  acQuickSwitchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  acQuickSwitchText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  acQuickSwitchAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  acQuickSwitchActionText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.secondary,
  },
  sectionContainer: {
    marginBottom: Spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    paddingHorizontal: 2,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  dateChip: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  dateChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  heroCard: {
    backgroundColor: Colors.primaryContainer,
    marginBottom: 10,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  startsInBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  pingDot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: '#ffffff',
  },
  startsInText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  heroPeriodTime: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primaryFixed,
    fontFamily: Typography.labelMono.fontFamily,
  },
  heroBody: {
    marginBottom: 12,
  },
  heroCategory: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primaryFixed,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  heroSubject: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  heroGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  heroInfoBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 20, 40, 0.5)',
    padding: 8,
    borderRadius: BorderRadius.md,
  },
  heroInfoLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: 'rgba(209, 228, 255, 0.8)',
  },
  heroInfoValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: Typography.labelMono.fontFamily,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  planText: {
    fontSize: 11,
    color: Colors.secondaryFixed,
  },
  weekText: {
    fontSize: 11,
    color: Colors.secondaryFixed,
    fontFamily: Typography.labelMono.fontFamily,
  },
  timelineCard: {
    marginBottom: Spacing.sm,
  },
  timelineTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  timelineItemsList: {
    gap: 8,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    padding: 8,
    borderRadius: BorderRadius.md,
    gap: 8,
  },
  upcomingTimelineRow: {
    backgroundColor: Colors.surfaceContainerHigh,
  },
  timelineTime: {
    width: 55,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  timelineStrip: {
    width: 4,
    height: 24,
    borderRadius: BorderRadius.full,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timelineCourse: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  doneBadge: {
    backgroundColor: Colors.surfaceContainerHighest,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  doneBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.onTertiaryContainer,
  },
  upcomingBadge: {
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  upcomingBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onSecondaryContainer,
  },
  freeBadge: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  freeBadgeText: {
    fontSize: 9,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
  },
  timelineSub: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    marginTop: 1,
  },
  breakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  breakTime: {
    width: 55,
    fontSize: 9,
    color: Colors.outline,
    fontFamily: Typography.labelMono.fontFamily,
  },
  breakDivider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.surfaceContainerHighest,
  },
  breakText: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
    textTransform: 'uppercase',
  },
  quickAccessCard: {
    marginBottom: Spacing.md,
  },
  quickHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  quickTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  syncedLiveText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.secondary,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainer,
    padding: 3,
    borderRadius: BorderRadius.md,
    gap: 4,
    marginBottom: 10,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: Colors.surfaceContainerLowest,
    ...Shadows.sm,
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
  },
  toggleBtnTextActive: {
    fontWeight: '700',
    color: Colors.primary,
  },
  dayStripContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.md,
    marginBottom: 10,
  },
  dayCol: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  activeDayCol: {
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: 4,
  },
  dayColLabel: {
    fontSize: 9,
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  dayColVal: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
    marginTop: 1,
  },
  stripDivider: {
    width: 1,
    height: 18,
    backgroundColor: Colors.surfaceContainerHighest,
  },
  openTimetableBtn: {
    marginTop: 2,
  },
  coursesCountBadge: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
  },
  courseCard: {
    marginBottom: 8,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  courseInfoLeft: {
    flex: 1,
  },
  courseCodesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  courseCodeBadge: {
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  courseCodeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  courseRegBadge: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  courseRegText: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 4,
  },
  courseCategory: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginTop: 1,
  },
  courseIconBox: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  secBox: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
    padding: 8,
    borderRadius: BorderRadius.md,
  },
  secLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
    fontFamily: Typography.labelMono.fontFamily,
  },
  secLoad: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.onSurface,
    fontFamily: Typography.labelMono.fontFamily,
    marginTop: 2,
  },
  secVenue: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  courseFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainerLow,
  },
  syllabusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  syllabusText: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
  creditsText: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  workloadBox: {
    marginBottom: Spacing.md,
  },
  viewAllNotifsText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.secondary,
  },
  miniNotifCard: {
    marginBottom: 8,
    padding: 10,
  },
  miniNotifRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  miniNotifIcon: {
    width: 30,
    height: 30,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  miniNotifCol: {
    flex: 1,
  },
  miniNotifTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  miniNotifTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  miniNotifTime: {
    fontSize: 9,
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  miniNotifMsg: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
    lineHeight: 15,
  },
  bottomNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceContainerLow,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  bottomNoticeText: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
