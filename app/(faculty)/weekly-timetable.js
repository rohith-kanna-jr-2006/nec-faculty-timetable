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
  MASTER_TIMETABLE_SESSIONS,
  getClassSessionsByDay,
} from '../../constants/demoData';

export default function WeeklyTimetableScreen() {
  const [selectedDay, setSelectedDay] = useState('all'); // 'all' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI'

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
    { id: 'TUE', title: 'TUESDAY', slotsText: 'LAB DAY', isLabDay: true },
    { id: 'WED', title: 'WEDNESDAY', slotsText: '7 SLOTS ACTIVE', isLabDay: false },
    { id: 'THU', title: 'THURSDAY', slotsText: 'LAB DAY', isLabDay: true },
    { id: 'FRI', title: 'FRIDAY', slotsText: '7 SLOTS ACTIVE', isLabDay: false },
  ];

  const visibleDays =
    selectedDay === 'all'
      ? daysList
      : daysList.filter((d) => d.id === selectedDay);

  const handleExport = () => {
    Alert.alert(
      'Export Timetable Matrix',
      'Exporting official weekly schedule grid for III Year CSE-C (Semester V, AY 2024-25).',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.screenContainer}>
      <AppHeader
        title="Weekly Timetable"
        subtitle="Department of CSE • Class CSE-C"
        badgeText="III / V / CSE-C"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Card */}
        <Card style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <View style={styles.termInfo}>
              <View style={styles.pulsePill}>
                <View style={styles.blueDot} />
                <Text style={styles.pulsePillText}>SEMESTER V • 2024-2025</Text>
              </View>
              <View style={styles.periodsPill}>
                <Text style={styles.periodsPillText}>35 PERIODS / WK</Text>
              </View>
            </View>

            <View style={styles.exportBtnsRow}>
              <Pressable
                style={({ pressed }) => [styles.exportBtn, pressed && styles.pressed]}
                onPress={handleExport}
              >
                <MaterialIcons name="picture-as-pdf" size={16} color={Colors.primary} />
                <Text style={styles.exportBtnText}>PDF</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.classTitleRow}>
            <Text style={styles.classHeading}>Class Schedule CSE-C</Text>
            <MaterialIcons name="verified" size={18} color={Colors.secondary} />
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
            const sessions = getClassSessionsByDay(day.id, 'CSE-C');

            return (
              <View key={day.id} style={styles.dayCardWrapper}>
                {/* Header Banner */}
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

                {/* Sessions list */}
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
            Autonomous Regulation R2022 • Master Grid v4.2 • Dept of CSE
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
  overviewCard: {
    marginBottom: Spacing.sm,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  termInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  pulsePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  blueDot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondary,
  },
  pulsePillText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  periodsPill: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  periodsPillText: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  exportBtnsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
  },
  exportBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  classTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  classHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  dayTabsScroll: {
    gap: 6,
    paddingTop: 2,
  },
  dayTabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
  },
  dayTabPillActive: {
    backgroundColor: Colors.primary,
    ...Shadows.sm,
  },
  dayTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
  },
  dayTabTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  dayCountBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  dayCountBadgeLab: {
    backgroundColor: 'rgba(33, 161, 115, 0.2)',
  },
  dayCountBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dayCountText: {
    fontSize: 9,
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  dayCountTextLab: {
    color: Colors.onTertiaryContainer,
    fontWeight: '700',
  },
  dayCountTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  legendBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginBottom: Spacing.sm,
    flexWrap: 'wrap',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceContainerLowest,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    ...Shadows.sm,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: BorderRadius.full,
  },
  legendText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  daysListContainer: {
    gap: 14,
  },
  dayCardWrapper: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
  },
  dayCardHeader: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  daySlotsBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  daySlotsBadgeLab: {
    backgroundColor: 'rgba(104, 219, 169, 0.25)',
  },
  daySlotsBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: Typography.labelMono.fontFamily,
  },
  daySlotsBadgeTextLab: {
    color: Colors.tertiaryFixed,
  },
  dayCardBody: {
    padding: Spacing.md,
  },
  breakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    marginVertical: 4,
  },
  breakBannerTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    flex: 1,
    marginLeft: 6,
  },
  breakBannerTime: {
    fontSize: 9,
    color: Colors.outline,
    fontFamily: Typography.labelMono.fontFamily,
  },
  lunchBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.md,
    marginVertical: 4,
  },
  lunchBannerTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    flex: 1,
    marginLeft: 6,
  },
  lunchBannerTime: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  footerNote: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  footerNoteText: {
    fontSize: 9,
    color: Colors.outline,
    fontFamily: Typography.labelMono.fontFamily,
    textTransform: 'uppercase',
  },
  pressed: {
    opacity: 0.8,
  },
});
