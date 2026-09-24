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
  getClassAdvisors,
  setClassAdvisor,
  subscribeState,
} from '../../constants/demoData';
import { getCSEFacultyFromWorkload } from '../../constants/workloadMasterData';

export default function ClassAdvisorScreen() {
  const router = useRouter();
  const context = getAcademicContext();
  const activeSection = context.section || 'CSE-C';
  const [advisors, setAdvisors] = useState(getClassAdvisors());
  const currentAdvisor = advisors[activeSection];
  const candidates = getCSEFacultyFromWorkload();

  const [selectedFacultyId, setSelectedFacultyId] = useState(
    currentAdvisor?.facultyId || (candidates.length > 0 ? candidates[0].facultyId : null)
  );
  const [isSuccessNotice, setIsSuccessNotice] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState(null);
  const [noticeType, setNoticeType] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeState(() => {
      setAdvisors(getClassAdvisors());
    });
    return unsubscribe;
  }, []);

  const selectedCandidate = candidates.find((f) => f.facultyId === selectedFacultyId);

  const handleConfirmAssignment = () => {
    setNoticeMessage(null);
    setNoticeType(null);

    if (!selectedCandidate) {
      setNoticeType('error');
      setNoticeMessage('Please select an eligible CSE faculty candidate to appoint as Class Advisor.');
      Alert.alert('No Selection', 'Please select an eligible CSE faculty candidate to appoint as Class Advisor.');
      return;
    }

    // Class Advisor cross-section conflict check
    const currentAdvisorsMap = getClassAdvisors();
    const conflictingEntry = Object.entries(currentAdvisorsMap).find(
      ([secKey, adv]) => secKey !== activeSection && adv?.facultyId === selectedCandidate.facultyId
    );

    if (conflictingEntry) {
      const [conflictingSection] = conflictingEntry;
      const msg = `${selectedCandidate.facultyName} (${selectedCandidate.facultyId}) is already assigned as Class Advisor for ${conflictingSection}.\n\nA faculty member cannot be appointed as Class Advisor to multiple sections concurrently.\n\nPlease select another candidate.`;
      setNoticeType('error');
      setNoticeMessage(msg);
      Alert.alert('Class Advisor Conflict', msg, [{ text: 'Acknowledge', style: 'cancel' }]);
      return;
    }

    const workloadDisplay =
      selectedCandidate.status === 'INCOMPLETE SOURCE DATA'
        ? 'Incomplete source data'
        : `Teaching: ${selectedCandidate.calculatedTeachingHours}h, Resp: ${selectedCandidate.calculatedResponsibilityHours}h, Total: ${selectedCandidate.calculatedTotalHours}h`;

    const updated = setClassAdvisor(activeSection, {
      facultyId: selectedCandidate.facultyId,
      facultyName: selectedCandidate.facultyName,
      designation: selectedCandidate.designation,
      workload: workloadDisplay,
      teachingHours: selectedCandidate.calculatedTeachingHours,
      responsibilityHours: selectedCandidate.calculatedResponsibilityHours,
      totalHours: selectedCandidate.calculatedTotalHours,
      status: selectedCandidate.status,
      appointedAt: new Date().toISOString().split('T')[0],
    });

    setAdvisors({ ...updated });
    setIsSuccessNotice(true);
    setNoticeType('success');
    setNoticeMessage(`${selectedCandidate.facultyName} has been formally confirmed as the Class Advisor for ${activeSection}.`);

    setTimeout(() => {
      setIsSuccessNotice(false);
    }, 5000);

    Alert.alert(
      'Class Advisor Appointed',
      `${selectedCandidate.facultyName} has been formally confirmed as the Class Advisor for ${activeSection} under HOD Level 01 Executive Authority.`,
      [
        { text: 'Review Faculty Allocation', onPress: () => router.push('/hod/faculty-allocation') },
        { text: 'Stay Here', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <HODHeader
        title="Class Advisor Assignment"
        showBack={true}
        activeCohort={`${context.year || 'III'} / ${context.semester || 'V'} / ${activeSection}`}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Authority Governance Banner */}
        <View style={styles.authorityBanner}>
          <View style={styles.authorityTopRow}>
            <View style={styles.authorityPill}>
              <MaterialIcons name="security" size={14} color="#FFFFFF" />
              <Text style={styles.authorityPillText}>SOLE STATUTORY AUTHORITY</Text>
            </View>
            <Text style={styles.cohortTag}>{activeSection} COHORT</Text>
          </View>
          <Text style={styles.authorityTitle}>Class Advisor Appointment Desk</Text>
          <Text style={styles.authoritySub}>
            Head of Department holds the statutory executive authority to appoint Class Advisors. The Academic Coordinator operates under this assigned leadership structure.
          </Text>
        </View>

        {/* Current Appointee Status Card */}
        <View style={styles.currentCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>CURRENT CLASS ADVISOR • {activeSection}</Text>
            {currentAdvisor && (
              <View style={styles.confirmedBadge}>
                <MaterialIcons name="check-circle" size={12} color="#059669" />
                <Text style={styles.confirmedBadgeText}>HOD RATIFIED</Text>
              </View>
            )}
          </View>

          {currentAdvisor ? (
            <View style={styles.appointeeRow}>
              <View style={styles.avatarBox}>
                <Text style={styles.avatarText}>
                  {currentAdvisor.facultyName
                    ? currentAdvisor.facultyName.split(' ').map((n) => n[0]).join('').slice(0, 2)
                    : 'FA'}
                </Text>
              </View>
              <View style={styles.appointeeInfo}>
                <Text style={styles.appointeeName}>{currentAdvisor.facultyName}</Text>
                <Text style={styles.appointeeDesig}>
                  {currentAdvisor.designation || 'Faculty'} • Dept. of CSE
                </Text>
                <View style={styles.appointeeMetaRow}>
                  {currentAdvisor.facultyId && (
                    <Text style={styles.metaChip}>ID: {currentAdvisor.facultyId}</Text>
                  )}
                  {currentAdvisor.appointedAt && (
                    <Text style={styles.metaChip}>Appointed: {currentAdvisor.appointedAt}</Text>
                  )}
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.emptyAdvisorBox}>
              <MaterialIcons name="person-outline" size={28} color={Colors.outlineVariant} />
              <Text style={styles.emptyAdvisorTitle}>No Class Advisor Assigned</Text>
              <Text style={styles.emptyAdvisorSub}>
                No faculty member has been ratified as the Class Advisor for {activeSection} yet. Appoint an eligible candidate below.
              </Text>
            </View>
          )}
        </View>

        {/* Eligible Faculty Roster */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>AVAILABLE ELIGIBLE CSE FACULTY POOL</Text>
            <Text style={styles.poolCountText}>{candidates.length} CSE Faculty</Text>
          </View>
          <Text style={styles.helperText}>
            Select a CSE faculty candidate from the Faculty Workload Master to appoint as Class Advisor for {activeSection}:
          </Text>

          {candidates.length === 0 ? (
            <View style={styles.emptyCandidatesBox}>
              <MaterialIcons name="people-outline" size={28} color={Colors.outlineVariant} />
              <Text style={styles.emptyCandidatesTitle}>No faculty available</Text>
              <Text style={styles.emptyCandidatesSub}>
                No CSE faculty records are loaded from the Workload Master.
              </Text>
            </View>
          ) : (
            <View style={styles.candidateList}>
              {candidates.map((faculty) => {
                const isSelected = selectedFacultyId === faculty.facultyId;
                const isCurrentlyActiveAdvisor = currentAdvisor?.facultyId === faculty.facultyId;
                const conflictingSection = Object.keys(advisors).find(
                  (secKey) => secKey !== activeSection && advisors[secKey]?.facultyId === faculty.facultyId
                );
                const isIncomplete = faculty.status === 'INCOMPLETE SOURCE DATA';

                return (
                  <Pressable
                    key={faculty.facultyId}
                    style={[styles.candidateItem, isSelected && styles.candidateItemActive]}
                    onPress={() => setSelectedFacultyId(faculty.facultyId)}
                  >
                    <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                      {isSelected && <View style={styles.radioDot} />}
                    </View>

                    <View style={styles.candidateInfo}>
                      <View style={styles.candidateNameRow}>
                        <Text style={[styles.candidateName, isSelected && styles.candidateNameActive]}>
                          {faculty.facultyName}
                        </Text>
                        <View style={styles.badgeRow}>
                          {isCurrentlyActiveAdvisor && (
                            <View style={styles.currentBadge}>
                              <Text style={styles.currentBadgeText}>Current Advisor ({activeSection})</Text>
                            </View>
                          )}
                          {conflictingSection && (
                            <View style={styles.conflictBadge}>
                              <Text style={styles.conflictBadgeText}>Advisor: {conflictingSection}</Text>
                            </View>
                          )}
                          {isIncomplete && (
                            <View style={styles.incompleteBadge}>
                              <Text style={styles.incompleteBadgeText}>Incomplete Source</Text>
                            </View>
                          )}
                        </View>
                      </View>
                      <Text style={styles.candidateDesig}>
                        {faculty.designation} • ID: {faculty.facultyId}
                      </Text>
                      <View style={styles.workloadInfoRow}>
                        <Text style={styles.workloadInfoText}>
                          {isIncomplete
                            ? `Teaching: ${faculty.calculatedTeachingHours} hrs • Responsibilities: ${faculty.calculatedResponsibilityHours} hrs • Total: Incomplete`
                            : `Teaching: ${faculty.calculatedTeachingHours} hrs • Responsibilities: ${faculty.calculatedResponsibilityHours} hrs • Total: ${faculty.calculatedTotalHours} hrs`}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        {/* Confirmation Action Box */}
        <View style={styles.confirmBox}>
          <View style={styles.confirmHeader}>
            <MaterialIcons name="how-to-reg" size={20} color="#38BDF8" />
            <Text style={styles.confirmTitle}>EXECUTIVE RATIFICATION</Text>
          </View>
          <Text style={styles.confirmDesc}>
            Designating {selectedCandidate?.facultyName || 'Selected Faculty'} as Class Advisor for {activeSection} takes immediate effect across the Academic Coordinator console and Faculty portal.
          </Text>

          {noticeMessage && (
            <View
              style={[
                styles.noticeBox,
                noticeType === 'success' ? styles.noticeSuccess : styles.noticeError,
              ]}
            >
              <MaterialIcons
                name={noticeType === 'success' ? 'check-circle' : 'error-outline'}
                size={16}
                color={noticeType === 'success' ? '#059669' : '#DC2626'}
              />
              <Text
                style={[
                  styles.noticeText,
                  noticeType === 'success' ? styles.noticeTextSuccess : styles.noticeTextError,
                ]}
              >
                {noticeMessage}
              </Text>
            </View>
          )}

          <PrimaryButton
            title="Ratify & Confirm Class Advisor"
            icon="verified"
            iconRight="arrow-forward"
            onPress={handleConfirmAssignment}
            disabled={false}
            style={styles.confirmBtn}
          />
        </View>
      </ScrollView>

      <HODBottomNav activeTab="advisors" />
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
  authorityBanner: {
    backgroundColor: '#0F2942',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  authorityTopRow: {
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
  cohortTag: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
  },
  authorityTitle: {
    ...Typography.titleMedium,
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 17,
    marginBottom: 4,
  },
  authoritySub: {
    ...Typography.bodySmall,
    color: '#CBD5E1',
    fontSize: 11,
    lineHeight: 16,
  },
  currentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    ...Shadows.sm,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardLabel: {
    ...Typography.labelSmall,
    color: Colors.onSurfaceVariant,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  confirmedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  confirmedBadgeText: {
    color: '#059669',
    fontSize: 9,
    fontWeight: '800',
  },
  appointeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0F2942',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  appointeeInfo: {
    flex: 1,
  },
  appointeeName: {
    ...Typography.titleSmall,
    color: '#0F2942',
    fontWeight: '800',
    fontSize: 15,
  },
  appointeeDesig: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
    marginTop: 1,
  },
  appointeeMetaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  metaChip: {
    backgroundColor: '#F1F5F9',
    color: Colors.onSurfaceVariant,
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    ...Shadows.sm,
    marginBottom: Spacing.md,
  },
  poolCountText: {
    ...Typography.labelSmall,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
    fontWeight: '700',
  },
  helperText: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
    marginBottom: 10,
  },
  candidateList: {
    gap: 8,
  },
  candidateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  candidateItemActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#2563EB',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },
  candidateInfo: {
    flex: 1,
  },
  candidateNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  candidateName: {
    ...Typography.bodyMedium,
    color: '#0F2942',
    fontWeight: '700',
    fontSize: 13,
  },
  candidateNameActive: {
    color: '#2563EB',
    fontWeight: '800',
  },
  currentBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  currentBadgeText: {
    color: '#059669',
    fontSize: 9,
    fontWeight: '800',
  },
  candidateDesig: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
    marginTop: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  conflictBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  conflictBadgeText: {
    color: '#D97706',
    fontSize: 9,
    fontWeight: '800',
  },
  incompleteBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  incompleteBadgeText: {
    color: '#DC2626',
    fontSize: 9,
    fontWeight: '800',
  },
  workloadInfoRow: {
    marginTop: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  workloadInfoText: {
    ...Typography.labelSmall,
    color: Colors.onSurfaceVariant,
    fontSize: 10,
    fontWeight: '600',
  },
  confirmBox: {
    backgroundColor: '#0F2942',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.md,
  },
  confirmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  confirmTitle: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  confirmDesc: {
    ...Typography.bodySmall,
    color: '#CBD5E1',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 12,
  },
  confirmBtn: {
    backgroundColor: '#2563EB',
  },
  emptyAdvisorBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
  },
  emptyAdvisorTitle: {
    ...Typography.titleSmall,
    color: Colors.primary,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyAdvisorSub: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
  },
  emptyCandidatesBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
  },
  emptyCandidatesTitle: {
    ...Typography.titleSmall,
    color: Colors.primary,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyCandidatesSub: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: BorderRadius.md,
    marginBottom: 10,
  },
  noticeSuccess: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  noticeError: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  noticeText: {
    ...Typography.bodySmall,
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
  },
  noticeTextSuccess: {
    color: '#065F46',
  },
  noticeTextError: {
    color: '#991B1B',
  },
});
