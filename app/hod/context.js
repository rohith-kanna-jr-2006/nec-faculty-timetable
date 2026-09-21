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
  setAcademicContext,
  getClassAdvisors,
} from '../../constants/demoData';

export default function AcademicContextScreen() {
  const router = useRouter();
  const currentContext = getAcademicContext();
  const advisors = getClassAdvisors();

  const [selectedDept, setSelectedDept] = useState(currentContext.department || 'CSE');
  const [selectedYear, setSelectedYear] = useState(currentContext.year || null);
  const [selectedSemester, setSelectedSemester] = useState(currentContext.semester || null);
  const [selectedSection, setSelectedSection] = useState(currentContext.section || null);

  const years = ['I Year', 'II Year', 'III Year', 'IV Year'];
  const getSemestersForYear = (yr) => {
    switch (yr) {
      case 'I Year': return ['Sem I', 'Sem II'];
      case 'II Year': return ['Sem III', 'Sem IV'];
      case 'III Year': return ['Sem V', 'Sem VI'];
      case 'IV Year': return ['Sem VII', 'Sem VIII'];
      default: return [];
    }
  };
  const semesters = selectedYear ? getSemestersForYear(selectedYear) : [];

  const baseSectionLetters = ['A', 'B', 'C', 'D'];
  const sections = baseSectionLetters.map((letter) => {
    const id = `${selectedDept || 'CSE'}-${letter}`;
    const advisor = advisors[id];
    return {
      id,
      label: `Section ${letter}`,
      advisorName: advisor?.facultyName || null,
      status: advisor ? 'Ratified' : 'Unassigned',
    };
  });

  const isContextConfigured = Boolean(selectedYear && selectedSemester && selectedSection);

  const handleSaveScope = (nextRoute) => {
    if (!isContextConfigured) {
      Alert.alert(
        'Incomplete Context',
        'Please select an Academic Year, Semester, and Section to define the target cohort context.'
      );
      return;
    }

    setAcademicContext({
      department: selectedDept,
      year: selectedYear,
      semester: selectedSemester,
      section: selectedSection,
      academicYear: currentContext.academicYear || 'Academic Year AY-2024-25',
    });

    if (nextRoute) {
      router.push(nextRoute);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <HODHeader
        title="Academic Context"
        showBack={true}
        activeCohort={
          isContextConfigured
            ? `${selectedYear} / ${selectedSemester} / ${selectedSection}`
            : 'No Context Selected'
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Authority Instruction Banner */}
        <View style={styles.authorityBanner}>
          <MaterialIcons name="security" size={20} color="#0F2942" />
          <View style={styles.bannerTextCol}>
            <Text style={styles.bannerTitle}>Executive Scope Selection</Text>
            <Text style={styles.bannerSub}>
              Select the institutional cohort to audit and make binding advisor appointments, faculty allocations, and timetable sign-offs.
            </Text>
          </View>
        </View>

        {/* Department & Regulation Locked Card */}
        <View style={styles.card}>
          <Text style={styles.cardSectionLabel}>DEPARTMENT & REGULATION</Text>
          <View style={styles.deptRow}>
            <View style={styles.deptIconBox}>
              <MaterialIcons name="account-balance" size={22} color="#0F2942" />
            </View>
            <View style={styles.deptInfoCol}>
              <Text style={styles.deptTitle}>Department of Computer Science & Engineering</Text>
              <Text style={styles.deptSub}>Autonomous Regulation R2022 • AY 2024-25 Odd</Text>
            </View>
            <View style={styles.lockedPill}>
              <MaterialIcons name="lock" size={12} color={Colors.onSurfaceVariant} />
              <Text style={styles.lockedText}>L1 Scope</Text>
            </View>
          </View>
        </View>

        {/* Year Selector */}
        <View style={styles.card}>
          <Text style={styles.cardSectionLabel}>ACADEMIC YEAR TIER</Text>
          <View style={styles.segmentedRow}>
            {years.map((yr) => {
              const isSelected = selectedYear === yr;
              return (
                <Pressable
                  key={yr}
                  style={[styles.segmentBtn, isSelected && styles.segmentBtnActive]}
                  onPress={() => setSelectedYear(yr)}
                >
                  <Text style={[styles.segmentBtnText, isSelected && styles.segmentBtnTextActive]}>
                    {yr}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Semester Selector */}
        <View style={styles.card}>
          <Text style={styles.cardSectionLabel}>SEMESTER TERM</Text>
          <View style={styles.segmentedRow}>
            {semesters.map((sem) => {
              const isSelected = selectedSemester === sem;
              return (
                <Pressable
                  key={sem}
                  style={[styles.segmentBtn, isSelected && styles.segmentBtnActive]}
                  onPress={() => setSelectedSemester(sem)}
                >
                  <Text style={[styles.segmentBtnText, isSelected && styles.segmentBtnTextActive]}>
                    {sem}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Section / Cohort Grid */}
        <View style={styles.card}>
          <Text style={styles.cardSectionLabel}>CLASS SECTION / COHORT TARGET</Text>
          <View style={styles.sectionsGrid}>
            {sections.map((sec) => {
              const isSelected = selectedSection === sec.id;
              const advisor = advisors[sec.id]?.facultyName || 'Not Assigned';
              return (
                <Pressable
                  key={sec.id}
                  style={[styles.sectionItemCard, isSelected && styles.sectionItemCardActive]}
                  onPress={() => setSelectedSection(sec.id)}
                >
                  <View style={styles.sectionItemTop}>
                    <Text style={[styles.sectionItemCode, isSelected && styles.sectionItemCodeActive]}>
                      {sec.id}
                    </Text>
                    <View
                      style={[
                        styles.statusPill,
                        sec.status === 'Ratified'
                          ? styles.statusGreen
                          : sec.status === 'Pending Review'
                          ? styles.statusBlue
                          : styles.statusGray,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusPillText,
                          sec.status === 'Ratified'
                            ? styles.statusGreenText
                            : sec.status === 'Pending Review'
                            ? styles.statusBlueText
                            : styles.statusGrayText,
                        ]}
                      >
                        {sec.status}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.sectionItemCount}>
                    {sec.advisorName ? 'Advisor Ratified' : 'Advisor Unassigned'}
                  </Text>
                  <View style={styles.advisorRow}>
                    <MaterialIcons name="school" size={13} color={Colors.onSurfaceVariant} />
                    <Text style={styles.advisorText} numberOfLines={1}>
                      {advisor}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Selected Scope Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <MaterialIcons name="layers" size={18} color="#FFFFFF" />
            <Text style={styles.summaryHeaderText}>TARGET COHORT CONTEXT</Text>
          </View>
          <Text style={styles.summaryTitle}>
            {isContextConfigured
              ? `${selectedDept || 'CSE'} • ${selectedYear} • ${selectedSemester} • ${selectedSection}`
              : 'No Academic Context Selected'}
          </Text>
          <Text style={styles.summaryDesc}>
            {isContextConfigured
              ? 'Downstream operations (Class Advisor assignment, AC input audit, faculty allocation, and timetable ratification) will execute for this target scope.'
              : 'Select an Academic Year tier, Semester term, and Section cohort above to define the institutional operational scope.'}
          </Text>

          <View style={styles.btnRow}>
            <PrimaryButton
              title="Proceed to Class Advisor"
              icon="school"
              iconRight="arrow-forward"
              onPress={() => handleSaveScope('/hod/class-advisor')}
              style={styles.proceedBtn}
            />
            <Pressable
              style={styles.saveReturnBtn}
              onPress={() => handleSaveScope('/hod')}
            >
              <Text style={styles.saveReturnText}>Save Context & Return to Dashboard</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <HODBottomNav activeTab="scope" />
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: BorderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: Spacing.md,
    gap: 10,
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerTitle: {
    ...Typography.titleSmall,
    color: '#0F2942',
    fontWeight: '800',
    fontSize: 13,
  },
  bannerSub: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16,
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
  cardSectionLabel: {
    ...Typography.labelSmall,
    color: Colors.onSurfaceVariant,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  deptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deptIconBox: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deptInfoCol: {
    flex: 1,
  },
  deptTitle: {
    ...Typography.titleSmall,
    color: '#0F2942',
    fontWeight: '800',
    fontSize: 14,
  },
  deptSub: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
    marginTop: 2,
  },
  lockedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 3,
  },
  lockedText: {
    ...Typography.labelSmall,
    color: Colors.onSurfaceVariant,
    fontSize: 9,
    fontWeight: '700',
  },
  segmentedRow: {
    flexDirection: 'row',
    gap: 8,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: {
    backgroundColor: '#0F2942',
    borderColor: '#0F2942',
  },
  segmentBtnText: {
    ...Typography.labelMedium,
    color: Colors.onSurfaceVariant,
    fontWeight: '700',
    fontSize: 12,
  },
  segmentBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  sectionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sectionItemCard: {
    width: '48.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    padding: 12,
  },
  sectionItemCardActive: {
    borderColor: '#0284C7',
    backgroundColor: '#F0F9FF',
  },
  sectionItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionItemCode: {
    ...Typography.titleMedium,
    color: '#0F2942',
    fontWeight: '900',
    fontSize: 15,
  },
  sectionItemCodeActive: {
    color: '#0284C7',
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '800',
  },
  statusGreen: {
    backgroundColor: '#ECFDF5',
  },
  statusGreenText: {
    color: '#059669',
  },
  statusBlue: {
    backgroundColor: '#EFF6FF',
  },
  statusBlueText: {
    color: '#2563EB',
  },
  statusGray: {
    backgroundColor: '#F1F5F9',
  },
  statusGrayText: {
    color: '#64748B',
  },
  sectionItemCount: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
    marginBottom: 6,
  },
  advisorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  advisorText: {
    ...Typography.bodySmall,
    color: '#0F2942',
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  summaryCard: {
    backgroundColor: '#0F2942',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.md,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  summaryHeaderText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  summaryTitle: {
    ...Typography.titleMedium,
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
    marginBottom: 4,
  },
  summaryDesc: {
    ...Typography.bodySmall,
    color: '#CBD5E1',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 12,
  },
  btnRow: {
    gap: 8,
  },
  proceedBtn: {
    backgroundColor: '#2563EB',
  },
  saveReturnBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.md,
  },
  saveReturnText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
  },
});
