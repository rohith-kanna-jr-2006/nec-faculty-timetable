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
import { useRouter } from 'expo-router';
import AppHeader from '../../components/AppHeader';
import Card from '../../components/Card';
import WorkloadCard from '../../components/WorkloadCard';
import PrimaryButton from '../../components/PrimaryButton';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import {
  FACULTY_PROFILE,
  VALIDATION_CHECKS,
  getFacultyWorkload,
} from '../../constants/demoData';

export default function WorkloadScreen() {
  const router = useRouter();
  const [showBreakdown, setShowBreakdown] = useState(false);
  const workload = getFacultyWorkload();

  const handleContactAC = () => {
    Alert.alert(
      'Contact Academic Coordinator',
      'Academic Coordinator: Mr. R. Manikandan\nEmail: ac.cse@nandhaengg.org\nPhone: ext 241\nOffice: CSE HOD / Timetable Desk #102',
      [{ text: 'Close' }]
    );
  };

  return (
    <View style={styles.screenContainer}>
      <AppHeader
        title="Nandha Engg College"
        subtitle="CSE Dept • Ms. C. Navamani"
        badgeText="VALIDATION"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Status Strip */}
        <View style={styles.topStatusStrip}>
          <View style={styles.statusRefRow}>
            <View style={styles.blueDot} />
            <Text style={styles.refText}>Audit Ref: NEC-CSE-VAL-882</Text>
          </View>
          <View style={styles.publishedPill}>
            <MaterialIcons name="verified" size={13} color={Colors.onTertiaryFixed} />
            <Text style={styles.publishedPillText}>OFFICIAL TIMETABLE • PUBLISHED</Text>
          </View>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.mainHeading}>Timetable Validation</Text>
          <Text style={styles.subHeading}>Faculty Verification Desk • AY 2024–25 (Odd)</Text>
        </View>

        {/* Hero Status Card */}
        <Card style={styles.heroCard}>
          <View style={styles.heroStatusBanner}>
            <View style={styles.heroStatusIcon}>
              <MaterialIcons name="task-alt" size={22} color="#ffffff" />
            </View>
            <View style={styles.heroStatusTextCol}>
              <View style={styles.stateTagRow}>
                <Text style={styles.stateTag}>SYSTEM STATE</Text>
                <View style={styles.miniDot} />
                <Text style={styles.syncedTag}>SYNCED</Text>
              </View>
              <Text style={styles.heroStatusTitle}>VERIFIED & CONFLICT-FREE</Text>
            </View>
          </View>

          {/* Compliance Ring & Check Counter */}
          <View style={styles.complianceBox}>
            <View style={styles.complianceLeft}>
              <View style={styles.ringIndicator}>
                <MaterialIcons name="check-circle" size={28} color={Colors.secondary} />
              </View>
              <View>
                <Text style={styles.complianceCount}>5 of 5 Checks Passed</Text>
                <Text style={styles.complianceSub}>100% Institutional Compliance</Text>
              </View>
            </View>
            <View style={styles.okBadge}>
              <Text style={styles.okBadgeText}>100% OK</Text>
            </View>
          </View>

          {/* Metadata Grid */}
          <View style={styles.metaGrid}>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>FACULTY NAME</Text>
              <Text style={styles.metaValue}>{FACULTY_PROFILE.name}</Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>EMPLOYEE ID</Text>
              <Text style={[styles.metaValue, styles.metaMono]}>{FACULTY_PROFILE.id}</Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>ACADEMIC TERM</Text>
              <Text style={styles.metaValue}>{FACULTY_PROFILE.academicYear}</Text>
            </View>
            <View style={styles.metaCol}>
              <Text style={styles.metaLabel}>CURRENT SEMESTER</Text>
              <Text style={styles.metaValue}>{FACULTY_PROFILE.semester}</Text>
            </View>
            <View style={styles.metaFullCol}>
              <Text style={styles.metaLabel}>DEPARTMENT</Text>
              <Text style={styles.metaValue}>Computer Science & Engineering</Text>
            </View>
            <View style={styles.metaFullCol}>
              <View style={styles.loadRow}>
                <Text style={styles.metaLabel}>ASSIGNED WEEKLY LOAD</Text>
                <View style={styles.periodsBadge}>
                  <Text style={styles.periodsBadgeText}>{workload.total} Periods</Text>
                </View>
              </View>
              <Text style={styles.metaValue}>
                Theory: {workload.theory} · Laboratory: {workload.lab}
              </Text>
            </View>
            <View style={styles.metaFullCol}>
              <Text style={styles.metaLabel}>MASTER TIMETABLE VERSION</Text>
              <View style={styles.versionRow}>
                <MaterialIcons name="history-edu" size={15} color={Colors.secondary} />
                <Text style={styles.versionText}>
                  v4.2 (By AC {FACULTY_PROFILE.academicCoordinator})
                </Text>
              </View>
            </View>
          </View>

          {/* Timestamp */}
          <View style={styles.timestampRow}>
            <View style={styles.timestampLeft}>
              <MaterialIcons name="autorenew" size={13} color={Colors.onSurfaceVariant} />
              <Text style={styles.timestampText}>Today, 09:15 AM • Daemon Verified</Text>
            </View>
            <Text style={styles.autoWatchText}>Auto-Watch Active</Text>
          </View>
        </Card>

        {/* Workload Gauge Summary */}
        <WorkloadCard workload={workload} style={styles.workloadCardStyle} />

        {/* Audit Integrity Protocol (5 Checks) */}
        <View style={styles.checksSection}>
          <View style={styles.checksHeaderRow}>
            <View style={styles.checksHeaderLeft}>
              <Text style={styles.checksTitle}>Audit Integrity Protocol</Text>
              <View style={styles.checksCountBadge}>
                <Text style={styles.checksCountText}>5 CHECKS</Text>
              </View>
            </View>
            <Text style={styles.readOnlyText}>Read-Only</Text>
          </View>

          <View style={styles.checksStack}>
            {VALIDATION_CHECKS.map((check) => (
              <Card key={check.id} style={styles.checkCard}>
                <View style={styles.checkTopRow}>
                  <View style={styles.checkTitleRow}>
                    <View style={styles.checkCheckCircle}>
                      <MaterialIcons name="check" size={14} color={Colors.onTertiaryFixed} />
                    </View>
                    <Text style={styles.checkHeading}>{check.title}</Text>
                  </View>
                  <View
                    style={[
                      styles.checkStatusBadge,
                      check.badgeColor === 'secondary' && styles.badgeSecondary,
                    ]}
                  >
                    <Text
                      style={[
                        styles.checkStatusText,
                        check.badgeColor === 'secondary' && styles.badgeSecondaryText,
                      ]}
                    >
                      {check.status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.checkDesc}>{check.desc}</Text>

                <View style={styles.checkMetricRow}>
                  <Text style={styles.metricLabel}>Metric Reference:</Text>
                  <View style={styles.metricBadge}>
                    <Text style={styles.metricValueText}>{check.metric}</Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Advisory & Support Card */}
        <Card variant="high" style={styles.advisoryCard}>
          <View style={styles.advisoryHeader}>
            <MaterialIcons name="info" size={18} color={Colors.secondary} />
            <Text style={styles.advisoryTitle}>Scheduling Advisory & Support</Text>
          </View>
          <Text style={styles.advisoryText}>
            If you identify any personal scheduling discrepancy, room allocation conflict, or leave substitution requirement, please submit an adjustment inquiry directly to your Academic Coordinator.
          </Text>

          <PrimaryButton
            title="Contact Academic Coordinator"
            variant="outline"
            icon="mail"
            onPress={handleContactAC}
            style={styles.contactBtn}
          />
        </Card>

        {/* Quick Actions */}
        <View style={styles.bottomActionsCol}>
          <PrimaryButton
            title="View My Complete Timetable"
            icon="calendar-month"
            onPress={() => router.push('/(faculty)/timetable')}
          />

          <PrimaryButton
            title={showBreakdown ? 'Hide Detailed Session Breakdown' : 'View Detailed Session Breakdown'}
            variant="subtle"
            icon="table-chart"
            onPress={() => setShowBreakdown(!showBreakdown)}
          />

          {showBreakdown && (
            <Card style={styles.breakdownCard}>
              <View style={styles.breakdownHeader}>
                <Text style={styles.breakdownTitle}>Assigned Class Slots</Text>
                <View style={styles.breakdownCode}>
                  <Text style={styles.breakdownCodeText}>22CSX42</Text>
                </View>
              </View>

              <View style={styles.breakdownList}>
                <View style={styles.breakdownItem}>
                  <View>
                    <Text style={styles.breakdownCourse}>III Year CSE - Section B</Text>
                    <Text style={styles.breakdownSlot}>Mon P4, Wed P2 (Done)</Text>
                  </View>
                  <View style={styles.roomPill}><Text style={styles.roomPillText}>Room CSE-202</Text></View>
                </View>

                <View style={styles.breakdownItem}>
                  <View>
                    <Text style={styles.breakdownCourse}>III Year CSE - Section C</Text>
                    <Text style={styles.breakdownSlot}>Tue P6, Wed P4 (Next), Fri P6</Text>
                  </View>
                  <View style={styles.roomPill}><Text style={styles.roomPillText}>Room CSE-204</Text></View>
                </View>
              </View>
            </Card>
          )}
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
  topStatusStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    flexWrap: 'wrap',
    gap: 6,
  },
  statusRefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  blueDot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondary,
  },
  refText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  publishedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.tertiaryFixed,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  publishedPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onTertiaryFixed,
    fontFamily: Typography.labelMono.fontFamily,
  },
  titleSection: {
    marginBottom: Spacing.md,
  },
  mainHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  subHeading: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  heroCard: {
    marginBottom: Spacing.md,
  },
  heroStatusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surfaceContainerLow,
    padding: 10,
    borderRadius: BorderRadius.lg,
    marginBottom: 10,
  },
  heroStatusIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  heroStatusTextCol: {
    flex: 1,
  },
  stateTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  stateTag: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  miniDot: {
    width: 4,
    height: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondaryContainer,
  },
  syncedTag: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  heroStatusTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 1,
  },
  complianceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainer,
    padding: 10,
    borderRadius: BorderRadius.lg,
    marginBottom: 10,
  },
  complianceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ringIndicator: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  complianceCount: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  complianceSub: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
  },
  okBadge: {
    backgroundColor: Colors.surfaceContainerLowest,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    ...Shadows.sm,
  },
  okBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  metaCol: {
    width: '48.5%',
    backgroundColor: Colors.surfaceContainerLow,
    padding: 8,
    borderRadius: BorderRadius.sm,
  },
  metaFullCol: {
    width: '100%',
    backgroundColor: Colors.surfaceContainerLow,
    padding: 8,
    borderRadius: BorderRadius.sm,
  },
  metaLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 2,
  },
  metaMono: {
    fontFamily: Typography.labelMono.fontFamily,
  },
  loadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  periodsBadge: {
    backgroundColor: Colors.secondaryFixed,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  periodsBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onSecondaryFixed,
    fontFamily: Typography.labelMono.fontFamily,
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  versionText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainer,
  },
  timestampLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timestampText: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  autoWatchText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  workloadCardStyle: {
    marginBottom: Spacing.md,
  },
  checksSection: {
    marginBottom: Spacing.md,
  },
  checksHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  checksHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checksTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  checksCountBadge: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  checksCountText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  readOnlyText: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  checksStack: {
    gap: 8,
  },
  checkCard: {
    marginBottom: 0,
  },
  checkTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  checkTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  checkCheckCircle: {
    width: 20,
    height: 20,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.tertiaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  checkStatusBadge: {
    backgroundColor: Colors.tertiaryFixed,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  checkStatusText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onTertiaryFixed,
    fontFamily: Typography.labelMono.fontFamily,
    textTransform: 'uppercase',
  },
  badgeSecondary: {
    backgroundColor: Colors.secondaryFixed,
  },
  badgeSecondaryText: {
    color: Colors.onSecondaryFixed,
  },
  checkDesc: {
    fontSize: 11,
    lineHeight: 16,
    color: Colors.onSurfaceVariant,
    marginLeft: 26,
    marginBottom: 6,
  },
  checkMetricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 26,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainerLow,
  },
  metricLabel: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  metricBadge: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  metricValueText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  advisoryCard: {
    marginBottom: Spacing.md,
  },
  advisoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  advisoryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  advisoryText: {
    fontSize: 11,
    lineHeight: 16,
    color: Colors.onSurfaceVariant,
    marginBottom: 10,
  },
  contactBtn: {
    minHeight: 38,
    paddingVertical: 8,
  },
  bottomActionsCol: {
    gap: 8,
    marginBottom: Spacing.lg,
  },
  breakdownCard: {
    marginTop: 4,
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  breakdownTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  breakdownCode: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  breakdownCodeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  breakdownList: {
    gap: 6,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLow,
    padding: 8,
    borderRadius: BorderRadius.md,
  },
  breakdownCourse: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  breakdownSlot: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    marginTop: 1,
  },
  roomPill: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  roomPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: Typography.labelMono.fontFamily,
  },
});
