import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  TextInput,
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
  updateTimetableVersionStatus,
  subscribeTimetableVersion,
  getHODProfile,
  TIMETABLE_STATUSES,
} from '../../constants/demoData';

export default function HODApprovalScreen() {
  const router = useRouter();
  const context = getAcademicContext();
  const activeSection = context.section || 'CSE-C';
  const hodProfile = getHODProfile();

  const [timetableVersion, setTimetableVersion] = useState(getTimetableVersion());
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  useEffect(() => {
    const unsub = subscribeTimetableVersion((v) => setTimetableVersion({ ...v }));
    return unsub;
  }, []);

  const isApproved = timetableVersion.status === 'APPROVED' || timetableVersion.status === 'PUBLISHED';

  const handleApprove = () => {
    updateTimetableVersionStatus(TIMETABLE_STATUSES.APPROVED, {
      approvedBy: hodProfile.name,
      hodReviewer: hodProfile.name,
    });

    Alert.alert(
      'Timetable Ratified',
      `Class timetable for III Year ${activeSection} (AY 2024-25 Odd) has been ratified and signed with HOD Executive Authority seal.`,
      [
        {
          text: 'View Official Approval Order',
          onPress: () => router.push('/hod/approval-details'),
        },
      ]
    );
  };

  const handleReject = () => {
    if (!rejectionNotes.trim()) {
      Alert.alert('Feedback Required', 'Please enter notes for the Academic Coordinator explaining the revision needed.');
      return;
    }

    updateTimetableVersionStatus(TIMETABLE_STATUSES.REJECTED, {
      rejectionReason: rejectionNotes,
    });

    Alert.alert(
      'Revision Requested',
      `The timetable draft has been returned to the Academic Coordinator console with your revision remarks.`,
      [{ text: 'OK', onPress: () => setShowRejectInput(false) }]
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <HODHeader
        title="Timetable Approval Desk"
        showBack={true}
        activeCohort={`${context.year || 'III'} / ${context.semester || 'V'} / ${activeSection}`}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Supreme Executive Authority Card */}
        <View style={styles.authorityCard}>
          <View style={styles.cardTopRow}>
            <View style={styles.authorityPill}>
              <MaterialIcons name="gavel" size={13} color="#FFFFFF" />
              <Text style={styles.authorityPillText}>STATUTORY RATIFICATION DESK</Text>
            </View>
            <Text style={styles.clearanceTag}>LEVEL 01 CLEARANCE</Text>
          </View>
          <Text style={styles.cardHeading}>Executive Timetable Sanction</Text>
          <Text style={styles.cardDesc}>
            Formally ratify or request revision of the compiled weekly schedule. Approval applies the HOD digital cryptographic seal and releases the master timetable to student and faculty portals.
          </Text>
        </View>

        {/* Validation Clearance Audit Box */}
        <View style={styles.auditCard}>
          <View style={styles.auditHeader}>
            <MaterialIcons name="verified" size={18} color="#059669" />
            <Text style={styles.auditHeaderTitle}>ENGINE CONSTRAINT AUDIT REPORT</Text>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricCell}>
              <Text style={styles.cellLabel}>REQUIRED PERIODS</Text>
              <Text style={styles.cellValue}>35 Periods</Text>
            </View>
            <View style={styles.metricCell}>
              <Text style={styles.cellLabel}>SCHEDULED PERIODS</Text>
              <Text style={[styles.cellValue, { color: '#059669' }]}>35 Periods (100%)</Text>
            </View>
            <View style={styles.metricCell}>
              <Text style={styles.cellLabel}>FREE / UNMET SLOTS</Text>
              <Text style={styles.cellValue}>0 Slots</Text>
            </View>
            <View style={styles.metricCell}>
              <Text style={styles.cellLabel}>FACULTY CLASHES</Text>
              <Text style={[styles.cellValue, { color: '#059669' }]}>0 Conflicts</Text>
            </View>
            <View style={styles.metricCell}>
              <Text style={styles.cellLabel}>LAB 4P BLOCKS</Text>
              <Text style={styles.cellValue}>2 Spans Verified</Text>
            </View>
            <View style={styles.metricCell}>
              <Text style={styles.cellLabel}>MAX DAILY LOAD</Text>
              <Text style={styles.cellValue}>Strict 4P Pass</Text>
            </View>
          </View>
        </View>

        {/* Current Approval State Status Banner */}
        <View style={styles.statusBox}>
          <Text style={styles.statusBoxLabel}>GOVERNANCE STATUS</Text>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isApproved ? '#10B981' : '#F59E0B' },
              ]}
            />
            <Text style={styles.statusText}>
              {isApproved
                ? 'TIMETABLE RATIFIED & APPROVED BY HOD'
                : 'PENDING EXECUTIVE HOD SIGN-OFF'}
            </Text>
          </View>
          {isApproved && (
            <Pressable
              onPress={() => router.push('/hod/approval-details')}
              style={styles.viewDetailsLink}
            >
              <Text style={styles.viewDetailsText}>View Digital Approval Decree</Text>
              <MaterialIcons name="chevron-right" size={16} color="#0284C7" />
            </Pressable>
          )}
        </View>

        {/* Primary Action Buttons */}
        {!isApproved ? (
          <View style={styles.actionsContainer}>
            <PrimaryButton
              title="Ratify & Approve Timetable"
              icon="verified"
              iconRight="arrow-forward"
              onPress={handleApprove}
              style={styles.approveBtn}
            />

            {!showRejectInput ? (
              <Pressable
                style={styles.rejectBtn}
                onPress={() => setShowRejectInput(true)}
              >
                <MaterialIcons name="replay" size={18} color="#DC2626" />
                <Text style={styles.rejectBtnText}>Request Revision from AC</Text>
              </Pressable>
            ) : (
              <View style={styles.rejectionInputCard}>
                <Text style={styles.rejectionInputLabel}>REVISION REMARKS FOR AC:</Text>
                <TextInput
                  style={styles.notesInput}
                  placeholder="e.g., Adjust Friday Lab slot due to seminar clash..."
                  placeholderTextColor={Colors.onSurfaceVariant}
                  value={rejectionNotes}
                  onChangeText={setRejectionNotes}
                  multiline
                />
                <View style={styles.rejectionBtnRow}>
                  <Pressable
                    style={styles.cancelRejectBtn}
                    onPress={() => setShowRejectInput(false)}
                  >
                    <Text style={styles.cancelRejectText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={styles.submitRejectBtn}
                    onPress={handleReject}
                  >
                    <Text style={styles.submitRejectText}>Send Revision Order</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.ratifiedContainer}>
            <View style={styles.sealCard}>
              <MaterialIcons name="verified" size={42} color="#059669" />
              <Text style={styles.sealTitle}>STATUTORY SEAL APPLIED</Text>
              <Text style={styles.sealSub}>
                Ratified by Dr. S. Karthik, M.E., Ph.D. • Head of Department
              </Text>
            </View>

            <PrimaryButton
              title="View Approval Decree & Release Order"
              icon="description"
              iconRight="arrow-forward"
              onPress={() => router.push('/hod/approval-details')}
              style={styles.decreeBtn}
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
  authorityCard: {
    backgroundColor: '#0F2942',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  authorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 4,
  },
  authorityPillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  clearanceTag: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
  },
  cardHeading: {
    ...Typography.titleMedium,
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 17,
    marginBottom: 4,
  },
  cardDesc: {
    ...Typography.bodySmall,
    color: '#CBD5E1',
    fontSize: 11,
    lineHeight: 16,
  },
  auditCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    ...Shadows.sm,
    marginBottom: Spacing.md,
  },
  auditHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
    paddingBottom: 8,
  },
  auditHeaderTitle: {
    ...Typography.labelSmall,
    color: '#059669',
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricCell: {
    width: '48.5%',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cellLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 2,
  },
  cellValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F2942',
  },
  statusBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  statusBoxLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.onSurfaceVariant,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    ...Typography.bodyMedium,
    color: '#0F2942',
    fontWeight: '800',
    fontSize: 12,
  },
  viewDetailsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  viewDetailsText: {
    fontSize: 11,
    color: '#0284C7',
    fontWeight: '700',
  },
  actionsContainer: {
    gap: 10,
  },
  approveBtn: {
    backgroundColor: '#059669',
  },
  rejectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FECACA',
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    gap: 6,
  },
  rejectBtnText: {
    ...Typography.labelMedium,
    color: '#DC2626',
    fontWeight: '800',
  },
  rejectionInputCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: BorderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  rejectionInputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#DC2626',
    marginBottom: 6,
  },
  notesInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 10,
    height: 70,
    textAlignVertical: 'top',
    fontSize: 12,
    color: Colors.onSurface,
    marginBottom: 8,
  },
  rejectionBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  cancelRejectBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  cancelRejectText: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    fontWeight: '700',
  },
  submitRejectBtn: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 4,
  },
  submitRejectText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  ratifiedContainer: {
    gap: 12,
  },
  sealCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
  },
  sealTitle: {
    ...Typography.titleMedium,
    color: '#065F46',
    fontWeight: '900',
    fontSize: 16,
    marginTop: 6,
    letterSpacing: 0.5,
  },
  sealSub: {
    ...Typography.bodySmall,
    color: '#047857',
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
  decreeBtn: {
    backgroundColor: '#0F2942',
  },
});
