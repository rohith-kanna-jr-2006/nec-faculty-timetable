import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AppHeader from '../../components/AppHeader';
import Card from '../../components/Card';
import TimetableCard from '../../components/TimetableCard';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import {
  FACULTY_PROFILE,
  getFacultySessions,
  getFacultySessionsByDay,
  getFacultyWorkload,
  getTodaySchedule,
} from '../../constants/demoData';

export default function MyTimetableScreen() {
  const [activeTab, setActiveTab] = useState('today'); // 'today' | 'weekly'
  const [selectedDayFilter, setSelectedDayFilter] = useState('all');

  const facultySessions = getFacultySessions();
  const workload = getFacultyWorkload();
  const todayData = getTodaySchedule();
  const wedSessions = getFacultySessionsByDay('WED');

  const daysConfig = [
    { id: 'MON', label: 'Mon', full: 'Monday' },
    { id: 'TUE', label: 'Tue', full: 'Tuesday' },
    { id: 'WED', label: 'Wed', full: 'Wednesday' },
    { id: 'THU', label: 'Thu', full: 'Thursday' },
    { id: 'FRI', label: 'Fri', full: 'Friday' },
  ];

  const filterChips = [
    { id: 'all', label: `All Days (${facultySessions.length}P)` },
    ...daysConfig.map((d) => {
      const count = getFacultySessionsByDay(d.id).length;
      return { id: d.id, label: `${d.label} (${count}P)` };
    }),
  ];

  const visibleDays =
    selectedDayFilter === 'all'
      ? daysConfig
      : daysConfig.filter((d) => d.id === selectedDayFilter);

  const handleExportPDF = () => {
    Alert.alert(
      'Export Timetable PDF',
      `Generating verified schedule PDF for ${FACULTY_PROFILE.name} (${FACULTY_PROFILE.academicYear}). Document signed by AC ${FACULTY_PROFILE.academicCoordinator}.`,
      [{ text: 'OK' }]
    );
  };

  const handleAddToCalendar = () => {
    Alert.alert(
      'Sync Calendar',
      `Syncing teaching schedule with your institutional Google Calendar (${FACULTY_PROFILE.email}).`,
      [{ text: 'Done' }]
    );
  };

  return (
    <View style={styles.screenContainer}>
      <AppHeader
        title="Nandha Engg - CSE"
        subtitle={`Faculty Portal • ${FACULTY_PROFILE.name}`}
        badgeText="MY TIMETABLE"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Sync Status Card */}
        <Card variant="low" style={styles.syncCard}>
          <View style={styles.syncRow}>
            <View style={styles.syncIconBox}>
              <MaterialIcons name="verified" size={18} color={Colors.secondary} />
            </View>
            <View style={styles.syncTextCol}>
              <Text style={styles.syncStatusTag}>SYNCED & LOCKED</Text>
              <Text style={styles.syncStatusDesc} numberOfLines={1}>
                Verified by AC {FACULTY_PROFILE.academicCoordinator} (Sem V) • Venues active
              </Text>
            </View>
            <View style={styles.termPill}>
              <Text style={styles.termPillText}>AY 24-25</Text>
            </View>
          </View>
        </Card>

        {/* Faculty Identity & Academic Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileTopRow}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeInitials}>{FACULTY_PROFILE.initials}</Text>
              <View style={styles.avatarCheckDot}>
                <MaterialIcons name="check" size={10} color="#ffffff" />
              </View>
            </View>

            <View style={styles.profileDetailsCol}>
              <View style={styles.nameIdRow}>
                <Text style={styles.facultyNameText}>{FACULTY_PROFILE.name}</Text>
                <View style={styles.idChip}>
                  <Text style={styles.idChipText}>ID: {FACULTY_PROFILE.id}</Text>
                </View>
              </View>
              <Text style={styles.facultyDeptText}>
                {FACULTY_PROFILE.designation} • {FACULTY_PROFILE.department}
              </Text>
            </View>
          </View>

          {/* Published Status Pill */}
          <View style={styles.publishedStatusBox}>
            <View style={styles.statusDotRow}>
              <View style={styles.greenPulse} />
              <Text style={styles.statusPublishedText}>Official {FACULTY_PROFILE.academicYear} • Published</Text>
            </View>
            <View style={styles.viewerModeRow}>
              <MaterialIcons name="lock" size={12} color={Colors.onSurfaceVariant} />
              <Text style={styles.viewerModeText}>Viewer Mode (AC Controlled)</Text>
            </View>
          </View>

          {/* Workload Metrics Strip */}
          <View style={styles.workloadStrip}>
            <View style={styles.workloadStripCol}>
              <Text style={styles.stripLabel}>COURSE</Text>
              <Text style={styles.stripValuePrimary}>22CSX42</Text>
              <Text style={styles.stripSub}>UI/UX Design</Text>
            </View>
            <View style={styles.workloadStripCol}>
              <Text style={styles.stripLabel}>ACTIVE COHORTS</Text>
              <Text style={styles.stripValueSecondary}>Sec B & Sec C</Text>
              <Text style={styles.stripSub}>Sem V (Third Year)</Text>
            </View>
            <View style={styles.workloadStripCol}>
              <Text style={styles.stripLabel}>WEEKLY LOAD</Text>
              <Text style={styles.stripValuePrimary}>{workload.total} Periods</Text>
              <Text style={styles.stripSub}>
                {workload.theory} Theory • {workload.lab} Lab
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsRow}>
            <Pressable
              style={({ pressed }) => [styles.smallActionBtn, pressed && styles.pressed]}
              onPress={handleExportPDF}
            >
              <MaterialIcons name="picture-as-pdf" size={15} color={Colors.primary} />
              <Text style={styles.smallActionBtnText}>Export PDF</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.smallActionBtn, pressed && styles.pressed]}
              onPress={handleAddToCalendar}
            >
              <MaterialIcons name="calendar-today" size={15} color={Colors.primary} />
              <Text style={styles.smallActionBtnText}>Add to Calendar</Text>
            </Pressable>
          </View>
        </Card>

        {/* Interactive View Switcher Tabs */}
        <View style={styles.viewSwitcher}>
          <Pressable
            style={[
              styles.switchTabBtn,
              activeTab === 'today' && styles.switchTabBtnActive,
            ]}
            onPress={() => setActiveTab('today')}
          >
            <MaterialIcons
              name="today"
              size={16}
              color={activeTab === 'today' ? Colors.secondary : Colors.onSurfaceVariant}
            />
            <Text
              style={[
                styles.switchTabText,
                activeTab === 'today' && styles.switchTabTextActive,
              ]}
            >
              Today (Wed, 23 Oct)
            </Text>
            <View style={styles.tabCountPill}>
              <Text style={styles.tabCountText}>{wedSessions.length} Classes</Text>
            </View>
          </Pressable>

          <Pressable
            style={[
              styles.switchTabBtn,
              activeTab === 'weekly' && styles.switchTabBtnActive,
            ]}
            onPress={() => setActiveTab('weekly')}
          >
            <MaterialIcons
              name="view-week"
              size={16}
              color={activeTab === 'weekly' ? Colors.secondary : Colors.onSurfaceVariant}
            />
            <Text
              style={[
                styles.switchTabText,
                activeTab === 'weekly' && styles.switchTabTextActive,
              ]}
            >
              Weekly Schedule
            </Text>
            <View style={styles.tabCountPillSecondary}>
              <Text style={styles.tabCountTextSecondary}>{workload.total} P</Text>
            </View>
          </Pressable>
        </View>

        {/* ================= TAB 1: TODAY VIEW ================= */}
        {activeTab === 'today' && (
          <View style={styles.tabContentContainer}>
            {/* Upcoming Next Class Hero */}
            {todayData.heroClass && (
              <Card style={styles.nextClassCard}>
                <View style={styles.nextClassHeader}>
                  <View style={styles.nextClassTitleRow}>
                    <View style={styles.nextPulseDot} />
                    <Text style={styles.nextClassHeading}>Upcoming Next Class</Text>
                  </View>
                  <View style={styles.startsInPill}>
                    <MaterialIcons name="hourglass-top" size={13} color={Colors.secondary} />
                    <Text style={styles.startsInPillText}>
                      Starts in {todayData.heroClass.startsIn || '45m'}
                    </Text>
                  </View>
                </View>

                <View style={styles.nextClassBody}>
                  <View style={styles.nextPeriodRow}>
                    <View style={styles.nextPeriodBadge}>
                      <Text style={styles.nextPeriodBadgeText}>
                        {todayData.heroClass.period}
                      </Text>
                    </View>
                    <Text style={styles.nextPeriodTimeText}>
                      {todayData.heroClass.startTime} – {todayData.heroClass.endTime}
                    </Text>
                    <View style={styles.nextSectionBadge}>
                      <Text style={styles.nextSectionBadgeText}>
                        {todayData.heroClass.classSection}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.nextCourseTitle}>
                    {todayData.heroClass.courseCode} — {todayData.heroClass.courseName}
                  </Text>
                  <Text style={styles.nextCourseCategory}>
                    Professional Elective • Semester V
                  </Text>

                  <View style={styles.nextMetaGrid}>
                    <View style={styles.nextMetaBox}>
                      <MaterialIcons name="meeting-room" size={18} color={Colors.secondary} />
                      <View>
                        <Text style={styles.nextMetaLabel}>ALLOCATED VENUE</Text>
                        <Text style={styles.nextMetaVal}>
                          Room {todayData.heroClass.room}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.nextMetaBox}>
                      <MaterialIcons name="desktop-windows" size={18} color={Colors.secondary} />
                      <View>
                        <Text style={styles.nextMetaLabel}>FACILITY TYPE</Text>
                        <Text style={styles.nextMetaVal}>
                          {todayData.heroClass.roomType}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.nextClassFooter}>
                    <View style={styles.studentsRow}>
                      <MaterialIcons name="groups" size={14} color={Colors.onTertiaryContainer} />
                      <Text style={styles.studentsText}>Strength: 58 Students registered</Text>
                    </View>
                    <Text style={styles.sessionPlanText}>Session Plan #14</Text>
                  </View>
                </View>
              </Card>
            )}

            {/* Daily Timeline Breakdown (Data-Derived from todayData.sessions) */}
            <Card style={styles.timelineListCard}>
              <View style={styles.timelineListHeader}>
                <Text style={styles.timelineListHeading}>Wednesday Timeline</Text>
                <Text style={styles.timelineSlotsTag}>SCHEDULED DAY TIMELINE</Text>
              </View>

              {todayData.sessions.map((item, index) => {
                if (item.isBreak || item.isLunch) {
                  return (
                    <View key={`break-${index}`} style={styles.ribbonBreak}>
                      <MaterialIcons
                        name={item.isLunch ? 'restaurant' : 'local-cafe'}
                        size={14}
                        color={Colors.onSurfaceVariant}
                      />
                      <Text style={styles.ribbonBreakText}>
                        {item.title} • {item.time}
                      </Text>
                    </View>
                  );
                }

                const isUpcoming = item.isUpcoming;
                const isDone = item.isDone;
                const isFree = item.isFree;

                return (
                  <View
                    key={`slot-${index}`}
                    style={[
                      styles.slotRow,
                      isUpcoming && styles.slotRowUpcoming,
                      isDone && styles.slotRowCompleted,
                    ]}
                  >
                    <View style={styles.slotLeft}>
                      <View
                        style={[
                          styles.periodSmallBox,
                          isUpcoming && { backgroundColor: Colors.secondaryContainer },
                          isDone && { backgroundColor: Colors.secondaryFixed },
                        ]}
                      >
                        <Text
                          style={[
                            styles.periodSmallText,
                            isUpcoming && { color: Colors.onSecondaryContainer },
                            isDone && { color: Colors.onSecondaryFixed },
                          ]}
                        >
                          {item.period}
                        </Text>
                        <Text
                          style={[
                            styles.timeSmallText,
                            isUpcoming && { color: Colors.onSecondaryContainer },
                            isDone && { color: Colors.onSecondaryFixed },
                          ]}
                        >
                          {item.time?.split(' ')[0]}
                        </Text>
                      </View>

                      <View style={styles.slotDetails}>
                        <View style={styles.slotTopLine}>
                          <Text
                            style={[
                              styles.slotTitle,
                              (isUpcoming || isDone) && { color: Colors.primary, fontWeight: '700' },
                            ]}
                          >
                            {item.title}
                          </Text>
                          {isFree && (
                            <View style={styles.freeChip}>
                              <Text style={styles.freeChipText}>FREE</Text>
                            </View>
                          )}
                          {isDone && (
                            <View style={styles.secChip}>
                              <Text style={styles.secChipText}>DONE</Text>
                            </View>
                          )}
                          {isUpcoming && (
                            <View style={styles.secCChip}>
                              <Text style={styles.secCChipText}>UPCOMING</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.slotSub}>{item.subtitle}</Text>
                      </View>
                    </View>
                    <Text style={styles.slotTimeRange}>{item.time}</Text>
                  </View>
                );
              })}
            </Card>
          </View>
        )}

        {/* ================= TAB 2: WEEKLY SCHEDULE VIEW (Data-Derived) ================= */}
        {activeTab === 'weekly' && (
          <View style={styles.tabContentContainer}>
            {/* Filter Chips Bar */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScroll}
            >
              {filterChips.map((chip) => {
                const isActive = selectedDayFilter === chip.id;
                return (
                  <Pressable
                    key={chip.id}
                    style={[styles.filterPill, isActive && styles.filterPillActive]}
                    onPress={() => setSelectedDayFilter(chip.id)}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
                        isActive && styles.filterPillTextActive,
                      ]}
                    >
                      {chip.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Render Day Cards Dynamically */}
            {visibleDays.map((day) => {
              const daySessions = getFacultySessionsByDay(day.id);
              const hasSessions = daySessions.length > 0;

              return (
                <Card key={day.id} style={styles.dayScheduleCard}>
                  <View style={styles.dayScheduleHeader}>
                    <View style={styles.dayDotRow}>
                      <View
                        style={[
                          styles.secondaryDot,
                          !hasSessions && { backgroundColor: Colors.outline },
                        ]}
                      />
                      <Text style={styles.dayScheduleTitle}>
                        {day.full} {day.id === 'WED' ? '(Today)' : ''}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.dayAssignedBadge,
                        !hasSessions && { backgroundColor: Colors.surfaceContainer },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayAssignedText,
                          !hasSessions && { color: Colors.onSurfaceVariant },
                        ]}
                      >
                        {daySessions.length} {daySessions.length === 1 ? 'PERIOD' : 'PERIODS'} ASSIGNED
                      </Text>
                    </View>
                  </View>

                  {hasSessions ? (
                    <View style={styles.daySessionsList}>
                      {daySessions.map((s) => (
                        <View
                          key={s.id}
                          style={[
                            styles.weekSessionRow,
                            s.isHeroNext && styles.weekSessionHighlight,
                          ]}
                        >
                          <View style={styles.weekSessionLeft}>
                            <View
                              style={[
                                styles.weekPeriodBadge,
                                s.isHeroNext && { backgroundColor: Colors.secondaryContainer },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.weekPeriodText,
                                  s.isHeroNext && { color: Colors.onSecondaryContainer },
                                ]}
                              >
                                {s.period}
                              </Text>
                            </View>
                            <View>
                              <Text
                                style={[
                                  styles.weekCourseTitle,
                                  s.isHeroNext && { color: Colors.primary, fontWeight: '700' },
                                ]}
                              >
                                {s.courseCode} — {s.courseName}
                              </Text>
                              <Text
                                style={[
                                  styles.weekCourseSub,
                                  s.isHeroNext && { color: Colors.secondary, fontWeight: '600' },
                                ]}
                              >
                                {s.classSection} • Room {s.room} {s.isHeroNext ? '(Next Class)' : ''}
                              </Text>
                            </View>
                          </View>
                          <Text
                            style={[
                              styles.weekSessionTime,
                              s.isHeroNext && { color: Colors.secondary, fontWeight: '700' },
                            ]}
                          >
                            {s.startTime} – {s.endTime}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    /* Free Day Empty State (Stitch Design) */
                    <View style={styles.freeDayBox}>
                      <View style={styles.freeDayIconCircle}>
                        <MaterialIcons name="event-available" size={22} color={Colors.secondary} />
                      </View>
                      <Text style={styles.freeDayTitle}>No Teaching Slots Assigned</Text>
                      <Text style={styles.freeDayDesc}>
                        Reserved for Department Research, Final Year Project Guidance, and Autonomous Curriculum Formulation.
                      </Text>
                      <Text style={styles.freeDayTag}>Free Day from Timetable Matrix</Text>
                    </View>
                  )}
                </Card>
              );
            })}
          </View>
        )}

        {/* Read-Only Policy Footer */}
        <View style={styles.policyFooter}>
          <Text style={styles.policyFooterText}>
            NEC Timetable Matrix v4.2 • Autonomous Regulations 2022 • CSE Dept
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
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  syncCard: {
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  syncIconBox: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncTextCol: {
    flex: 1,
  },
  syncStatusTag: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
    letterSpacing: 0.5,
  },
  syncStatusDesc: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    marginTop: 1,
  },
  termPill: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  termPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  profileCard: {
    marginBottom: 12,
    padding: Spacing.md,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatarLarge: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarLargeInitials: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  avatarCheckDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 15,
    height: 15,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.onTertiaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  profileDetailsCol: {
    flex: 1,
  },
  nameIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  facultyNameText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  idChip: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  idChipText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  facultyDeptText: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  publishedStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: BorderRadius.md,
    marginBottom: 12,
  },
  statusDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greenPulse: {
    width: 7,
    height: 7,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.onTertiaryContainer,
  },
  statusPublishedText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.onSurface,
    fontFamily: Typography.labelMono.fontFamily,
  },
  viewerModeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewerModeText: {
    fontSize: 9,
    color: Colors.onSurfaceVariant,
  },
  workloadStrip: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    padding: 10,
    marginBottom: 12,
    gap: 8,
  },
  workloadStripCol: {
    flex: 1,
  },
  stripLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
    marginBottom: 2,
  },
  stripValuePrimary: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  stripValueSecondary: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.secondary,
  },
  stripSub: {
    fontSize: 9,
    color: Colors.onSurfaceVariant,
    marginTop: 1,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  smallActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceContainer,
    paddingVertical: 7,
    borderRadius: BorderRadius.md,
  },
  smallActionBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
  viewSwitcher: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: BorderRadius.lg,
    padding: 3,
    marginBottom: 12,
  },
  switchTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
  },
  switchTabBtnActive: {
    backgroundColor: '#ffffff',
    ...Shadows.sm,
  },
  switchTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
  },
  switchTabTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  tabCountPill: {
    backgroundColor: Colors.surfaceContainerHighest,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: BorderRadius.full,
  },
  tabCountText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  tabCountPillSecondary: {
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: BorderRadius.full,
  },
  tabCountTextSecondary: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  tabContentContainer: {
    gap: 12,
  },
  nextClassCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
  },
  nextClassHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  nextClassTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nextPulseDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondary,
  },
  nextClassHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.secondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  startsInPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  startsInPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  nextClassBody: {
    gap: 6,
  },
  nextPeriodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nextPeriodBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  nextPeriodBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: Typography.labelMono.fontFamily,
  },
  nextPeriodTimeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  nextSectionBadge: {
    backgroundColor: Colors.surfaceContainerHighest,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  nextSectionBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  nextCourseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  nextCourseCategory: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
  nextMetaGrid: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.md,
    padding: 8,
    gap: 8,
    marginVertical: 4,
  },
  nextMetaBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nextMetaLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  nextMetaVal: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
  nextClassFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  studentsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  studentsText: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
  sessionPlanText: {
    fontSize: 10,
    color: Colors.outline,
    fontFamily: Typography.labelMono.fontFamily,
  },
  timelineListCard: {
    padding: Spacing.md,
  },
  timelineListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerLow,
  },
  timelineListHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  timelineSlotsTag: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  ribbonBreak: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    marginVertical: 4,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.sm,
  },
  ribbonBreakText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerLow,
  },
  slotRowUpcoming: {
    backgroundColor: Colors.surfaceContainerLowest,
  },
  slotRowCompleted: {
    opacity: 0.9,
  },
  slotLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  periodSmallBox: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodSmallText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  timeSmallText: {
    fontSize: 8,
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  slotDetails: {
    flex: 1,
  },
  slotTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  slotTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.onSurface,
  },
  slotSub: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    marginTop: 1,
  },
  slotTimeRange: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  freeChip: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  freeChipText: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  secChip: {
    backgroundColor: Colors.surfaceContainerHighest,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  secChipText: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.onTertiaryContainer,
    fontFamily: Typography.labelMono.fontFamily,
  },
  secCChip: {
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  secCChipText: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.onSecondaryContainer,
    fontFamily: Typography.labelMono.fontFamily,
  },
  filterScroll: {
    gap: 6,
    paddingBottom: 4,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  filterPillTextActive: {
    color: '#ffffff',
  },
  dayScheduleCard: {
    padding: Spacing.md,
  },
  dayScheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerLow,
  },
  dayDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  secondaryDot: {
    width: 7,
    height: 7,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondary,
  },
  dayScheduleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  dayAssignedBadge: {
    backgroundColor: Colors.surfaceContainerHighest,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  dayAssignedText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  daySessionsList: {
    gap: 6,
  },
  weekSessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.md,
  },
  weekSessionHighlight: {
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  weekSessionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  weekPeriodBadge: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekPeriodText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: Typography.labelMono.fontFamily,
  },
  weekCourseTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  weekCourseSub: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    marginTop: 1,
  },
  weekSessionTime: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  freeDayBox: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  freeDayIconCircle: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  freeDayTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  freeDayDesc: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 8,
    maxWidth: 280,
  },
  freeDayTag: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  policyFooter: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  policyFooterText: {
    fontSize: 9,
    color: Colors.outline,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  pressed: {
    opacity: 0.8,
  },
});
