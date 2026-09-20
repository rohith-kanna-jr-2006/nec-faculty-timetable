import React, { useState, useEffect } from 'react';
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
  getClassTimetable,
  getTimetableVersion,
  subscribeTimetableVersion,
  TIMETABLE_STATUSES,
} from '../../constants/demoData';

export default function WeeklyTimetableScreen() {
  const [selectedDay, setSelectedDay] = useState('all'); // 'all' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI'
  const [activeDepartment, setActiveDepartment] = useState('CSE');
  const [activeYear, setActiveYear] = useState('III Year');
  const [activeSemester, setActiveSemester] = useState('Semester V');
  const [activeSection, setActiveSection] = useState('CSE-C');
  const [timetableVersion, setTimetableVersion] = useState(getTimetableVersion());

  useEffect(() => {
    const unsub = subscribeTimetableVersion((v) => setTimetableVersion({ ...v }));
    return unsub;
  }, []);

  const dayTabs = [
    { id: 'all', label: 'All Days', icon: 'view-week' },
    { id: 'MON', label: 'Mon', count: '7P' },
    { id: 'TUE', label: 'Tue', count: 'Lab', isLab: true },
    { id: 'WED', label: 'Wed', count: '7P' },
    { id: 'THU', label: 'Thu', count: 'Lab', isLab: true },
    { id: 'FRI', label: 'Fri', count: '7P' },
  ];

  const daysList = [
    { id: 'MON', title: 'MONDAY', slotsText: '7 SLOTS ACTIVE', isLabDay: false },
    { id: 'TUE', title: 'TUESDAY', slotsText: 'LAB DAY (FSD LAB)', isLabDay: true },
    { id: 'WED', title: 'WEDNESDAY', slotsText: '7 SLOTS ACTIVE', isLabDay: false },
    { id: 'THU', title: 'THURSDAY', slotsText: 'LAB DAY (OOSE LAB)', isLabDay: true },
    { id: 'FRI', title: 'FRIDAY', slotsText: '7 SLOTS ACTIVE', isLabDay: false },
  ];

  const visibleDays =
    selectedDay === 'all'
      ? daysList
      : daysList.filter((d) => d.id === selectedDay);

  const handleExport = () => {
    Alert.alert(
      'Export Timetable Matrix',
      `Exporting official weekly schedule grid for ${activeYear} ${activeSection} (${activeSemester}, AY 2024-25).\nApproval Status: ${timetableVersion.status}`,
      [{ text: 'OK' }]
    );
  };

  const getStatusBadge = () => {
    switch (timetableVersion.status) {
      case TIMETABLE_STATUSES.PENDING_HOD_APPROVAL:
        return {
          title: 'PENDING HOD APPROVAL',
          sub: 'Draft candidate awaiting review by Dr. S. K. Nandha (HOD / CSE)',
          bg: '#fff7ed',
          border: '#fed7aa',
          color: '#c2410c',
          icon: 'hourglass-top',
        };
      case TIMETABLE_STATUSES.APPROVED:
        return {
          title: 'APPROVED BY HOD',
          sub: `Officially approved by ${timetableVersion.approvedBy || 'Dr. S. K. Nandha (HOD / CSE)'} • Ready for semester rollout`,
          bg: '#ecfdf5',
          border: '#a7f3d0',
          color: '#047857',
          icon: 'verified',
        };
      case TIMETABLE_STATUSES.REJECTED:
        return {
          title: 'REVISION REQUESTED BY HOD',
          sub: timetableVersion.rejectionReason || 'Under revision by Academic Coordinator',
          bg: '#fef2f2',
          border: '#fecaca',
          color: '#b91c1c',
          icon: 'error-outline',
        };
      case TIMETABLE_STATUSES.PUBLISHED:
        return {
          title: 'PUBLISHED & ACTIVE',
          sub: 'Synchronized with Campus ERP, Student App & Digital Display Panels',
          bg: '#eff6ff',
          border: '#bfdbfe',
          color: '#1d4ed8',
          icon: 'check-circle',
        };
      default:
        return {
          title: 'DRAFT TIMETABLE',
          sub: 'Generated candidate grid under academic coordinator review',
          bg: Colors.surfaceContainer,
          border: Colors.outlineVariant,
          color: Colors.primary,
          icon: 'pending',
        };
    }
  };

  const statusInfo = getStatusBadge();

  return (
    <View style={styles.screenContainer}>
      <AppHeader
        title="Class Timetable"
        subtitle={`Department of ${activeDepartment} • Section ${activeSection}`}
        badgeText={`${activeDepartment} • ${activeSection}`}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Governance & Approval State Card */}
        <View style={[styles.governanceCard, { backgroundColor: statusInfo.bg, borderColor: statusInfo.border }]}>
          <View style={styles.govTopRow}>
            <View style={styles.govLeft}>
              <MaterialIcons name={statusInfo.icon} size={18} color={statusInfo.color} />
              <Text style={[styles.govTitle, { color: statusInfo.color }]}>
                {statusInfo.title}
              </Text>
            </View>
            <View style={[styles.govPill, { backgroundColor: statusInfo.border }]}>
              <Text style={[styles.govPillText, { color: statusInfo.color }]}>
                {timetableVersion.versionLabel || 'v4.2'}
              </Text>
            </View>
          </View>
          <Text style={[styles.govSub, { color: statusInfo.color }]}>
            {statusInfo.sub}
          </Text>
        </View>

        {/* Academic Context Selector Card */}
        <Card style={styles.contextCard}>
          <View style={styles.contextHeader}>
            <Text style={styles.contextSectionLabel}>ACADEMIC CONTEXT SELECTOR</Text>
            <Pressable
              style={({ pressed }) => [styles.exportBtn, pressed && styles.pressed]}
              onPress={handleExport}
            >
              <MaterialIcons name="picture-as-pdf" size={14} color={Colors.primary} />
              <Text style={styles.exportBtnText}>Export PDF</Text>
            </Pressable>
          </View>

          {/* Context Chips Grid */}
          <View style={styles.contextChipsRow}>
            <View style={styles.contextChip}>
              <Text style={styles.contextChipKey}>DEPT</Text>
              <Text style={styles.contextChipVal}>{activeDepartment}</Text>
            </View>
            <View style={styles.contextChip}>
              <Text style={styles.contextChipKey}>YEAR</Text>
              <Text style={styles.contextChipVal}>{activeYear}</Text>
            </View>
            <View style={styles.contextChip}>
              <Text style={styles.contextChipKey}>SEM</Text>
              <Text style={styles.contextChipVal}>Sem V</Text>
            </View>
            <View style={[styles.contextChip, styles.contextChipActive]}>
              <Text style={[styles.contextChipKey, styles.contextChipKeyActive]}>SEC</Text>
              <Text style={[styles.contextChipVal, styles.contextChipValActive]}>{activeSection}</Text>
            </View>
          </View>

          {/* Day Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dayTabsScroll}
          >
            {dayTabs.map((tab) => {
              const isActive = selectedDay === tab.id;
              return (
                <Pressable
                  key={tab.id}
                  style={[styles.dayTabPill, isActive && styles.dayTabPillActive]}
                  onPress={() => setSelectedDay(tab.id)}
                >
                  {tab.icon && (
                    <MaterialIcons
                      name={tab.icon}
                      size={14}
                      color={isActive ? '#ffffff' : Colors.onSurfaceVariant}
                    />
                  )}
                  <Text
                    style={[styles.dayTabText, isActive && styles.dayTabTextActive]}
                  >
                    {tab.label}
                  </Text>
                  {tab.count && (
                    <View
                      style={[
                        styles.dayCountBadge,
                        tab.isLab && styles.dayCountBadgeLab,
                        isActive && styles.dayCountBadgeActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayCountText,
                          tab.isLab && styles.dayCountTextLab,
                          isActive && styles.dayCountTextActive,
                        ]}
                      >
                        {tab.count}
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </Card>

        {/* Legend Bar */}
        <View style={styles.legendBar}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.secondary }]} />
            <Text style={styles.legendText}>THEORY</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.onTertiaryContainer }]} />
            <Text style={styles.legendText}>LAB (4-PERIOD)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.secondaryContainer }]} />
            <Text style={styles.legendText}>PROF ELECTIVE</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.surfaceTint }]} />
            <Text style={styles.legendText}>SKILL / OTHER</Text>
          </View>
        </View>

        {/* Timetable List Section */}
        <View style={styles.daysListContainer}>
          {visibleDays.map((day) => {
            // Select sessions strictly from single MASTER_TIMETABLE_SESSIONS
            const sessions = getClassTimetable(
              {
                department: activeDepartment,
                year: activeYear,
                semester: activeSemester,
                section: activeSection,
              },
              { day: day.id }
            );

            return (
              <View key={day.id} style={styles.dayCardWrapper}>
                {/* Day Header Banner */}
                <View
                  style={[
                    styles.dayCardHeader,
                    day.isLabDay && styles.dayCardHeaderLab,
                  ]}
                >
                  <View style={styles.dayCardHeaderLeft}>
                    <MaterialIcons
                      name="calendar-today"
                      size={16}
                      color={day.isLabDay ? Colors.tertiaryFixed : Colors.secondaryFixed}
                    />
                    <Text style={styles.dayCardHeaderTitle}>{day.title}</Text>
                  </View>
                  <View
                    style={[
                      styles.daySlotsBadge,
                      day.isLabDay && styles.daySlotsBadgeLab,
                    ]}
                  >
                    <Text
                      style={[
                        styles.daySlotsBadgeText,
                        day.isLabDay && styles.daySlotsBadgeTextLab,
                      ]}
                    >
                      {day.slotsText}
                    </Text>
                  </View>
                </View>

                {/* Sessions list with interstitial breaks */}
                <View style={styles.dayCardBody}>
                  {sessions.map((session, idx) => (
                    <React.Fragment key={session.id || idx}>
                      <TimetableCard session={session} />

                      {/* Interstitial breaks */}
                      {session.period === 'P2' && (
                        <View style={styles.breakBanner}>
                          <MaterialIcons name="local-cafe" size={14} color={Colors.secondary} />
                          <Text style={styles.breakBannerTitle}>Morning Break</Text>
                          <Text style={styles.breakBannerTime}>10:55 – 11:10 (15m)</Text>
                        </View>
                      )}
                      {(session.period === 'P4' || session.id === 'TUE-P1-P4-LAB' || session.id === 'THU-P1-P4-LAB') && (
                        <View style={styles.lunchBanner}>
                          <MaterialIcons name="restaurant" size={15} color={Colors.secondary} />
                          <Text style={styles.lunchBannerTitle}>Lunch Interval</Text>
                          <Text style={styles.lunchBannerTime}>12:50 – 01:45 (55m)</Text>
                        </View>
                      )}
                      {session.period === 'P6' && (
                        <View style={styles.breakBanner}>
                          <MaterialIcons name="emoji-food-beverage" size={14} color={Colors.secondary} />
                          <Text style={styles.breakBannerTitle}>Evening Break</Text>
                          <Text style={styles.breakBannerTime}>03:25 – 03:40 (15m)</Text>
                        </View>
                      )}
                    </React.Fragment>
                  ))}
                </View>
              </View>
            );
          })}
        </View>

        {/* Footer info */}
        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            Autonomous Regulation R2022 • Master Grid {timetableVersion.versionLabel || 'v4.2'} • Dept of {activeDepartment}
          </Text>
          <Text style={styles.footerSubText}>
            Derived from single MASTER_TIMETABLE_SESSIONS • Shared with Faculty Portal
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
    gap: Spacing.sm,
  },
  governanceCard: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: 3,
  },
  govTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  govLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  govTitle: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: Typography.labelMono.fontFamily,
    letterSpacing: 0.4,
  },
  govPill: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: BorderRadius.full,
  },
  govPillText: {
    fontSize: 8,
    fontWeight: '800',
    fontFamily: Typography.labelMono.fontFamily,
  },
  govSub: {
    fontSize: 11,
    lineHeight: 15,
  },
  contextCard: {
    padding: Spacing.sm,
  },
  contextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  contextSectionLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
    letterSpacing: 0.5,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
  },
  exportBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  contextChipsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  contextChip: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHighest,
  },
  contextChipActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  contextChipKey: {
    fontSize: 7,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  contextChipKeyActive: {
    color: 'rgba(255,255,255,0.8)',
  },
  contextChipVal: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 1,
  },
  contextChipValActive: {
    color: '#ffffff',
  },
  dayTabsScroll: {
    gap: 6,
    paddingTop: 4,
  },
  dayTabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHighest,
  },
  dayTabPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dayTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
  },
  dayTabTextActive: {
    color: '#ffffff',
  },
  dayCountBadge: {
    backgroundColor: Colors.surfaceContainerHighest,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: BorderRadius.full,
  },
  dayCountBadgeLab: {
    backgroundColor: Colors.tertiaryFixedDim,
  },
  dayCountBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dayCountText: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  dayCountTextLab: {
    color: Colors.onTertiaryContainer,
  },
  dayCountTextActive: {
    color: '#ffffff',
  },
  legendBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLowest,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
  },
  legendText: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  daysListContainer: {
    gap: Spacing.md,
  },
  dayCardWrapper: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  dayCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
  },
  dayCardHeaderLab: {
    backgroundColor: Colors.tertiaryContainer,
  },
  dayCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dayCardHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
    fontFamily: Typography.labelMono.fontFamily,
  },
  daySlotsBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  daySlotsBadgeLab: {
    backgroundColor: Colors.tertiaryFixed,
  },
  daySlotsBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#ffffff',
    fontFamily: Typography.labelMono.fontFamily,
  },
  daySlotsBadgeTextLab: {
    color: Colors.onTertiaryContainer,
  },
  dayCardBody: {
    padding: Spacing.sm,
    gap: 8,
  },
  breakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.secondary,
  },
  breakBannerTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.secondary,
  },
  breakBannerTime: {
    fontSize: 9,
    color: Colors.onSurfaceVariant,
    marginLeft: 'auto',
    fontFamily: Typography.labelMono.fontFamily,
  },
  lunchBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.secondaryContainer,
  },
  lunchBannerTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
  },
  lunchBannerTime: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    marginLeft: 'auto',
    fontFamily: Typography.labelMono.fontFamily,
  },
  footerNote: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: 2,
  },
  footerNoteText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  footerSubText: {
    fontSize: 9,
    color: Colors.outline,
  },
  pressed: {
    opacity: 0.8,
  },
});
