import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, Typography, Spacing, Shadows } from '../constants/theme';

export default function TimetableCard({ session, isCurrentNext = false, onPress }) {
  if (!session) return null;

  // Render 4-period laboratory continuous block
  if (session.isSpan && session.sessionType === 'LAB') {
    return (
      <View style={[styles.labContainer, isCurrentNext && styles.heroHighlight]}>
        <View style={styles.labHeaderRow}>
          <View style={styles.labHeaderLeft}>
            <View style={styles.labBadge}>
              <Text style={styles.labBadgeText}>4-PERIOD LAB BLOCK</Text>
            </View>
            <View style={styles.labPeriodBadge}>
              <Text style={styles.labPeriodText}>P1 — P4</Text>
            </View>
          </View>
          <View style={styles.labIconBox}>
            <MaterialIcons name="terminal" size={24} color={Colors.tertiaryFixed} />
          </View>
        </View>

        <Text style={styles.labTitle}>{session.courseCode} — {session.courseName}</Text>
        <Text style={styles.labSub}>{session.startTime} AM – {session.endTime} PM • Concludes before Lunch</Text>

        <View style={styles.labDetailsGrid}>
          <View style={styles.labDetailCol}>
            <Text style={styles.labDetailLabel}>DUAL FACULTY ASSIGNED</Text>
            <Text style={styles.labDetailValue} numberOfLines={1}>
              {session.faculty}
            </Text>
          </View>
          <View style={styles.labDetailCol}>
            <Text style={styles.labDetailLabel}>DEDICATED VENUE</Text>
            <View style={styles.venueRow}>
              <MaterialIcons name="desktop-mac" size={14} color={Colors.tertiaryFixedDim} />
              <Text style={styles.labDetailValue}>{session.room}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Determine styling based on session type
  const isFree = session.isFree || session.courseCode === 'FREE';
  const isElective = session.sessionType === 'ELECTIVE';
  const isDone = session.status === 'Completed' || session.isDone;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.sessionCard,
        isCurrentNext && styles.currentNextCard,
        isDone && styles.doneCard,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.sessionLeftGroup}>
        <View
          style={[
            styles.periodPill,
            isCurrentNext && styles.periodPillUpcoming,
            isDone && styles.periodPillDone,
            isFree && styles.periodPillFree,
          ]}
        >
          <Text
            style={[
              styles.periodLabel,
              isCurrentNext && styles.periodLabelUpcoming,
              isDone && styles.periodLabelDone,
              isFree && styles.periodLabelFree,
            ]}
          >
            {session.period}
          </Text>
          <Text
            style={[
              styles.timeMicro,
              isCurrentNext && styles.periodLabelUpcoming,
              isDone && styles.periodLabelDone,
              isFree && styles.periodLabelFree,
            ]}
          >
            {session.startTime}
          </Text>
        </View>

        <View style={styles.sessionInfo}>
          <View style={styles.codeRow}>
            {session.courseCode && !isFree && (
              <Text style={styles.courseCode}>{session.courseCode}</Text>
            )}
            {session.sessionType && (
              <View
                style={[
                  styles.typeTag,
                  isElective && styles.typeTagElective,
                  isDone && styles.typeTagDone,
                  isFree && styles.typeTagFree,
                ]}
              >
                <Text
                  style={[
                    styles.typeTagText,
                    isElective && styles.typeTagTextElective,
                    isDone && styles.typeTagTextDone,
                    isFree && styles.typeTagTextFree,
                  ]}
                >
                  {isFree ? 'FREE' : session.sessionType}
                </Text>
              </View>
            )}
            {session.classSection && (
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>{session.classSection}</Text>
              </View>
            )}
          </View>

          <Text style={[styles.courseName, isDone && styles.courseNameDone]} numberOfLines={1}>
            {session.courseName || session.title || 'No Teaching Session'}
          </Text>

          <Text style={styles.facultyAndRoom} numberOfLines={1}>
            {isFree
              ? session.subtitle || 'Unassigned Period • Faculty Desk'
              : `${session.faculty || 'Faculty'} • Room ${session.room || 'TBA'}`}
          </Text>
        </View>
      </View>

      <View style={styles.rightAction}>
        <Text style={[styles.timeRange, isCurrentNext && styles.timeRangeUpcoming]}>
          {session.startTime} – {session.endTime}
        </Text>
        {session.isHeroNext && (
          <View style={styles.upcomingPill}>
            <Text style={styles.upcomingPillText}>Next</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sessionCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  currentNextCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderColor: Colors.secondaryContainer,
    ...Shadows.md,
  },
  doneCard: {
    backgroundColor: Colors.surfaceContainerHigh,
    opacity: 0.9,
  },
  sessionLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
    marginRight: 8,
  },
  periodPill: {
    width: 48,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodPillUpcoming: {
    backgroundColor: Colors.secondaryContainer,
  },
  periodPillDone: {
    backgroundColor: Colors.secondaryFixed,
  },
  periodPillFree: {
    backgroundColor: Colors.surfaceContainer,
  },
  periodLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.onPrimary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  periodLabelUpcoming: {
    color: Colors.onSecondaryContainer,
  },
  periodLabelDone: {
    color: Colors.onSecondaryFixed,
  },
  periodLabelFree: {
    color: Colors.onSurfaceVariant,
  },
  timeMicro: {
    fontSize: 8,
    color: Colors.onPrimaryContainer,
    fontFamily: Typography.labelMono.fontFamily,
    marginTop: 1,
  },
  sessionInfo: {
    flex: 1,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  courseCode: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  typeTag: {
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  typeTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  typeTagElective: {
    backgroundColor: Colors.secondaryFixed,
  },
  typeTagTextElective: {
    color: Colors.onSecondaryFixedVariant,
  },
  typeTagDone: {
    backgroundColor: Colors.surfaceContainerHighest,
  },
  typeTagTextDone: {
    color: Colors.onTertiaryContainer,
  },
  typeTagFree: {
    backgroundColor: Colors.surfaceContainer,
  },
  typeTagTextFree: {
    color: Colors.onSurfaceVariant,
  },
  sectionBadge: {
    backgroundColor: Colors.surfaceContainerHighest,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  sectionBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  courseName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 2,
  },
  courseNameDone: {
    color: Colors.onSurface,
  },
  facultyAndRoom: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginTop: 1,
  },
  rightAction: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  timeRange: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  timeRangeUpcoming: {
    color: Colors.secondary,
    fontWeight: '700',
  },
  upcomingPill: {
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.full,
    marginTop: 3,
  },
  upcomingPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onSecondaryContainer,
  },
  pressed: {
    opacity: 0.85,
  },

  // Laboratory Block Styles
  labContainer: {
    backgroundColor: Colors.tertiaryContainer,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: 8,
    ...Shadows.md,
  },
  labHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  labHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  labBadge: {
    backgroundColor: Colors.tertiary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  labBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onTertiaryContainer,
    fontFamily: Typography.labelMono.fontFamily,
  },
  labPeriodBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  labPeriodText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: Typography.labelMono.fontFamily,
  },
  labIconBox: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(0, 23, 13, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: 20,
  },
  labSub: {
    fontSize: 11,
    color: Colors.tertiaryFixedDim,
    marginTop: 2,
  },
  labDetailsGrid: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    padding: 8,
    borderRadius: BorderRadius.md,
    marginTop: 10,
  },
  labDetailCol: {
    flex: 1,
  },
  labDetailLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.tertiaryFixedDim,
    fontFamily: Typography.labelMono.fontFamily,
    marginBottom: 2,
  },
  labDetailValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroHighlight: {
    borderWidth: 1.5,
    borderColor: Colors.tertiaryFixed,
  },
});
