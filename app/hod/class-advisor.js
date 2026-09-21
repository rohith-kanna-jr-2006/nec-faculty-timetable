import React, { useState } from 'react';
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
  getAvailableFacultyCandidates,
} from '../../constants/demoData';

export default function ClassAdvisorScreen() {
  const router = useRouter();
  const context = getAcademicContext();
  const activeSection = context.section || 'CSE-C';
  const advisors = getClassAdvisors();
  const currentAdvisor = advisors[activeSection];
  const candidates = getAvailableFacultyCandidates();

  const [selectedFacultyId, setSelectedFacultyId] = useState(
    currentAdvisor?.facultyId || (candidates.length > 0 ? candidates[0].id : null)
  );
  const [isSuccessNotice, setIsSuccessNotice] = useState(false);

  const selectedCandidate = candidates.find((f) => f.id === selectedFacultyId);

  const handleConfirmAssignment = () => {
    if (!selectedCandidate) {
      Alert.alert('No Selection', 'Please select a faculty candidate to appoint as Class Advisor.');
      return;
    }

    setClassAdvisor(activeSection, {
      facultyId: selectedCandidate.id,
      facultyName: selectedCandidate.name,
      designation: selectedCandidate.designation,
      workload: `${selectedCandidate.currentLoad || 0}/${selectedCandidate.maxLoad || 16}`,
      appointedAt: new Date().toISOString().split('T')[0],
    });

    setIsSuccessNotice(true);
    setTimeout(() => {
      setIsSuccessNotice(false);
      Alert.alert(
        'Class Advisor Appointed',
        `${selectedCandidate.name} has been formally confirmed as the Class Advisor for ${activeSection} under HOD Level 01 Executive Authority.`,
        [
          { text: 'Review AC Faculty Input', onPress: () => router.push('/hod/faculty-input') },
          { text: 'Stay Here', style: 'cancel' },
        ]
      );
    }, 400);
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
            <Text style={styles.cardLabel}>AVAILABLE ELIGIBLE FACULTY POOL</Text>
            <Text style={styles.poolCountText}>{candidates.length} Faculty</Text>
          </View>
          <Text style={styles.helperText}>
            Select a candidate below to ratify as Class Advisor for {activeSection}:
          </Text>

          {candidates.length === 0 ? (
            <View style={styles.emptyCandidatesBox}>
              <MaterialIcons name="people-outline" size={28} color={Colors.outlineVariant} />
              <Text style={styles.emptyCandidatesTitle}>No faculty available</Text>
              <Text style={styles.emptyCandidatesSub}>
                No faculty candidate records are loaded in the current runtime pool.
              </Text>
            </View>
          ) : (
            <View style={styles.candidateList}>
              {candidates.map((faculty) => {
                const isSelected = selectedFacultyId === faculty.id;
                const isCurrentlyActiveAdvisor = currentAdvisor?.facultyId === faculty.id;

                return (
                  <Pressable
                    key={faculty.id}
                    style={[styles.candidateItem, isSelected && styles.candidateItemActive]}
                    onPress={() => setSelectedFacultyId(faculty.id)}
                  >
                    <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                      {isSelected && <View style={styles.radioDot} />}
                    </View>

                    <View style={styles.candidateInfo}>
                      <View style={styles.candidateNameRow}>
                        <Text style={[styles.candidateName, isSelected && styles.candidateNameActive]}>
                          {faculty.name}
                        </Text>
                        {isCurrentlyActiveAdvisor && (
                          <View style={styles.currentBadge}>
                            <Text style={styles.currentBadgeText}>Current Advisor</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.candidateDesig}>
                        {faculty.designation} • {faculty.experience} Experience
                      </Text>
                      <View style={styles.workloadBarRow}>
                        <Text style={styles.workloadLabel}>
                          Matrix Load: {faculty.currentLoad}/{faculty.maxLoad} Periods
                        </Text>
                        <View style={styles.workloadTrack}>
                          <View
                            style={[
                              styles.workloadFill,
                              {
                                width: `${Math.min(100, (faculty.currentLoad / faculty.maxLoad) * 100)}%`,
                                backgroundColor: faculty.currentLoad >= 14 ? '#D97706' : '#2563EB',
                              },
                            ]}
                          />
                        </View>
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
            Designating {selectedCandidate?.name || 'Selected Faculty'} as Class Advisor for {activeSection} takes immediate effect across the Academic Coordinator console and Faculty portal.
          </Text>

          <PrimaryButton
            title="Ratify & Confirm Class Advisor"
            icon="verified"
            iconRight="arrow-forward"
            onPress={handleConfirmAssignment}
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
  workloadBarRow: {
    marginTop: 6,
  },
  workloadLabel: {
    ...Typography.labelSmall,
    color: Colors.onSurfaceVariant,
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 3,
  },
  workloadTrack: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  workloadFill: {
    height: '100%',
    borderRadius: 2,
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
});
