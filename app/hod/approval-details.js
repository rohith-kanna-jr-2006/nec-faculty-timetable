import React, { useState, useEffect } from 'react';
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
import HODHeader from '../../components/HODHeader';
import HODBottomNav from '../../components/HODBottomNav';
import PrimaryButton from '../../components/PrimaryButton';
import {
  getAcademicContext,
  getTimetableVersion,
  subscribeTimetableVersion,
  getHODProfile,
} from '../../constants/demoData';

export default function ApprovalDetailsScreen() {
  const router = useRouter();
  const context = getAcademicContext();
  const activeSection = context.section || 'CSE-C';
  const hodProfile = getHODProfile();

  const [timetableVersion, setTimetableVersion] = useState(getTimetableVersion());

  useEffect(() => {
    const unsub = subscribeTimetableVersion((v) => setTimetableVersion({ ...v }));
    return unsub;
  }, []);

  const isApproved = timetableVersion.status === 'APPROVED' || timetableVersion.status === 'PUBLISHED';
  const approvalTimestamp = timetableVersion.approvedAt || new Date().toISOString();
  const approver = timetableVersion.approvedBy || hodProfile.name;

  const handlePrintOrder = () => {
    Alert.alert(
      'Official Decree Generated',
      `Executive Order NEC/CSE/TT/2024-25/08 for ${activeSection} compiled and encrypted. PDF signed with HOD institutional certificate.`,
      [{ text: 'Dismiss' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <HODHeader
        title="Ratified Order"
        showBack={true}
        activeCohort={`${context.year || 'III'} / ${context.semester || 'V'} / ${activeSection}`}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isApproved ? (
          <>
            {/* Supreme Digital Seal Header Card */}
            <View style={styles.decreeCard}>
              <View style={styles.crestRow}>
                <MaterialIcons name="verified" size={48} color="#10B981" />
                <View style={styles.decreeHeadInfo}>
                  <Text style={styles.decreeOrderNumber}>OFFICIAL ORDER • NEC/CSE/TT/08</Text>
                  <Text style={styles.decreeTitle}>STATUTORY RATIFICATION DECREE</Text>
                  <Text style={styles.decreeSub}>
                    NANDHA ENGINEERING COLLEGE (AUTONOMOUS)
                  </Text>
                </View>
              </View>

              <View style={styles.decreeDivider} />

              <View style={styles.sealStatusRow}>
                <View style={styles.sealPill}>
                  <MaterialIcons name="check-circle" size={14} color="#059669" />
                  <Text style={styles.sealPillText}>APPROVED BY HOD</Text>
                </View>
                <Text style={styles.orderDateText}>
                  {approvalTimestamp.split('T')[0]}
                </Text>
              </View>
            </View>

            {/* Comprehensive Cohort Context Roster */}
            <View style={styles.detailsCard}>
              <Text style={styles.cardHeader}>RATIFIED COHORT SPECIFICATIONS</Text>

              <View style={styles.infoGrid}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>DEPARTMENT</Text>
                  <Text style={styles.infoValue}>Computer Science and Engineering</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>ACADEMIC YEAR</Text>
                  <Text style={styles.infoValue}>2024 - 2025 (Odd Semester)</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>CURRICULUM REGULATION</Text>
                  <Text style={styles.infoValue}>Autonomous Regulation R2022</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>TARGET CLASS / SECTION</Text>
                  <Text style={[styles.infoValue, styles.highlightText]}>
                    III Year • Semester V • {activeSection} (64 Students)
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>SCHEDULE LOAD</Text>
                  <Text style={styles.infoValue}>35 Periods / Week (100% Scheduled)</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>HARD CONSTRAINTS</Text>
                  <Text style={[styles.infoValue, { color: '#059669' }]}>
                    Zero Conflicts • Strict 4P Continuous Lab Passed
                  </Text>
                </View>
              </View>
            </View>

            {/* Cryptographic Digital Signature Box */}
            <View style={styles.cryptoCard}>
              <View style={styles.cryptoHeader}>
                <MaterialIcons name="fingerprint" size={18} color="#0284C7" />
                <Text style={styles.cryptoHeaderTitle}>DIGITAL STATUTORY ATTESTATION</Text>
              </View>

              <View style={styles.cryptoContent}>
                <Text style={styles.signatoryLabel}>EXECUTIVE SIGNATORY:</Text>
                <Text style={styles.signatoryName}>{approver}</Text>
                <Text style={styles.signatoryTitle}>
                  Professor & Head of Department • Department of CSE
                </Text>

                <View style={styles.hashBox}>
                  <Text style={styles.hashLabel}>CRYPTOGRAPHIC HASH (SHA-256):</Text>
                  <Text style={styles.hashText}>
                    e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                  </Text>
                </View>

                <Text style={styles.timestampText}>
                  Attested at: {approvalTimestamp}
                </Text>
              </View>
            </View>

            {/* Campus Distribution Broadcast Matrix */}
            <View style={styles.distributionCard}>
              <Text style={styles.cardHeader}>CAMPUS DISTRIBUTION STATUS</Text>

              <View style={styles.distItem}>
                <MaterialIcons name="done-all" size={16} color="#059669" />
                <View style={styles.distTextCol}>
                  <Text style={styles.distTitle}>Autonomous ERP Core Synced</Text>
                  <Text style={styles.distSub}>Master period database updated</Text>
                </View>
              </View>

              <View style={styles.distItem}>
                <MaterialIcons name="done-all" size={16} color="#059669" />
                <View style={styles.distTextCol}>
                  <Text style={styles.distTitle}>Faculty Schedule Viewers Live</Text>
                  <Text style={styles.distSub}>Subject handlers and lab guides notified</Text>
                </View>
              </View>

              <View style={styles.distItem}>
                <MaterialIcons name="done-all" size={16} color="#059669" />
                <View style={styles.distTextCol}>
                  <Text style={styles.distTitle}>Student Notice Board Broadcast</Text>
                  <Text style={styles.distSub}>Class Advisor Ms. C. Navamani designated</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsBox}>
              <PrimaryButton
                title="Download Signed Executive Decree"
                icon="file-download"
                onPress={handlePrintOrder}
                style={styles.downloadBtn}
              />
              <Pressable
                style={styles.returnBtn}
                onPress={() => router.replace('/hod')}
              >
                <Text style={styles.returnBtnText}>Return to HOD Executive Desk</Text>
              </Pressable>
            </View>
          </>
        ) : (
          /* Pre-Approval Fallback State */
          <View style={styles.pendingCard}>
            <MaterialIcons name="hourglass-empty" size={48} color="#D97706" />
            <Text style={styles.pendingTitle}>PENDING HOD APPROVAL</Text>
            <Text style={styles.pendingSub}>
              This timetable draft has not yet been formally ratified by the Head of Department. Approval metadata and digital seal will be generated once executive sanction is granted.
            </Text>
            <PrimaryButton
              title="Go to Timetable Approval Desk"
              icon="gavel"
              iconRight="arrow-forward"
              onPress={() => router.push('/hod/approval')}
              style={styles.goToApproveBtn}
            />
          </View>
        )}
      </ScrollView>

      <HODBottomNav activeTab="approvals" />
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
  decreeCard: {
    backgroundColor: '#0F2942',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  crestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  decreeHeadInfo: {
    flex: 1,
  },
  decreeOrderNumber: {
    fontSize: 9,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.5,
  },
  decreeTitle: {
    ...Typography.titleMedium,
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 15,
    marginTop: 2,
  },
  decreeSub: {
    ...Typography.bodySmall,
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 1,
  },
  decreeDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: 12,
  },
  sealStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sealPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 4,
  },
  sealPillText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '800',
  },
  orderDateText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    ...Shadows.sm,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    ...Typography.labelSmall,
    color: Colors.onSurfaceVariant,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  infoGrid: {
    gap: 8,
  },
  infoRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 6,
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 1,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F2942',
  },
  highlightText: {
    fontWeight: '800',
    color: '#0284C7',
  },
  cryptoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: Spacing.md,
  },
  cryptoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  cryptoHeaderTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  cryptoContent: {
    gap: 3,
  },
  signatoryLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  signatoryName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F2942',
  },
  signatoryTitle: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
  hashBox: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 6,
  },
  hashLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 2,
  },
  hashText: {
    fontSize: 9,
    color: '#0F2942',
    fontFamily: 'monospace',
  },
  timestampText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 4,
  },
  distributionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    ...Shadows.sm,
    marginBottom: Spacing.md,
  },
  distItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  distTextCol: {
    flex: 1,
  },
  distTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F2942',
  },
  distSub: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
  },
  actionsBox: {
    gap: 8,
  },
  downloadBtn: {
    backgroundColor: '#0F2942',
  },
  returnBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.md,
  },
  returnBtnText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '700',
  },
  pendingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    ...Shadows.sm,
  },
  pendingTitle: {
    ...Typography.titleMedium,
    color: '#D97706',
    fontWeight: '900',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 6,
  },
  pendingSub: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.lg,
  },
  goToApproveBtn: {
    backgroundColor: '#0F2942',
    width: '100%',
  },
});
