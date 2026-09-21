import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import {
  getWorkloadMaster,
  getWorkloadSummaryMetrics,
  searchAndFilterWorkload,
} from '../../constants/workloadMasterData';

export default function WorkloadMasterDashboard() {
  const router = useRouter();

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'MATCHED' | 'REVIEW REQUIRED' | 'INCOMPLETE SOURCE DATA'
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'HOD' | 'ACADEMIC_COORDINATOR' | 'CLASS_ADVISOR' | 'PROCTOR' | 'TEACHING_ONLY' | 'RESPONSIBILITIES'
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'UG_THEORY' | 'LAB' | 'PG' | 'OTHERS'

  // Dynamic calculations from authoritative dataset
  const metrics = useMemo(() => getWorkloadSummaryMetrics(), []);

  // Filtered faculty list
  const filteredFaculty = useMemo(() => {
    return searchAndFilterWorkload({
      searchQuery,
      roleFilter,
      categoryFilter,
      statusFilter,
    });
  }, [searchQuery, roleFilter, categoryFilter, statusFilter]);

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setRoleFilter('all');
    setCategoryFilter('all');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    roleFilter !== 'all' ||
    categoryFilter !== 'all';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="arrow-back" size={24} color={Colors.onPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerSubtitle}>CSE DEPARTMENT • AUTONOMOUS R2022</Text>
          <Text style={styles.headerTitle}>Faculty Workload Master</Text>
        </View>

        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>REGISTER</Text>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Core Purpose Banner */}
        <View style={styles.purposeCard}>
          <View style={styles.purposeIconContainer}>
            <MaterialIcons name="assignment-ind" size={24} color={Colors.secondary} />
          </View>
          <View style={styles.purposeTextContainer}>
            <Text style={styles.purposeTitle}>Master Faculty Workload Register</Text>
            <Text style={styles.purposeDescription}>
              Authoritative record of academic allocation, weekly contact hours, and administrative
              responsibilities. Separate from timetable scheduling and HOD allocations.
            </Text>
          </View>
        </View>

        {/* Dashboard Metrics Grid */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>WORKLOAD DASHBOARD METRICS</Text>
          <Text style={styles.sectionCaption}>Authoritative Source Count: {metrics.totalFaculty}</Text>
        </View>

        {/* Top Summary Cards */}
        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, styles.primaryMetricCard]}>
            <View style={styles.metricHeaderRow}>
              <Text style={styles.primaryMetricLabel}>TOTAL FACULTY</Text>
              <MaterialIcons name="people-alt" size={18} color={Colors.onPrimaryContainer} />
            </View>
            <Text style={styles.primaryMetricValue}>{metrics.totalFaculty}</Text>
            <Text style={styles.primaryMetricSubtext}>Records Preserved</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeaderRow}>
              <Text style={styles.metricLabel}>TOTAL ALLOCATED</Text>
              <MaterialIcons name="timer" size={18} color={Colors.secondary} />
            </View>
            <Text style={styles.metricValue}>{metrics.totalAllocatedHours} <Text style={styles.unitText}>hrs/wk</Text></Text>
            <Text style={styles.metricSubtext}>Calculated Weekly Load</Text>
          </View>
        </View>

        {/* Hours Breakdown Cards */}
        <View style={styles.hoursBreakdownRow}>
          <View style={styles.breakdownBox}>
            <View style={styles.breakdownHeader}>
              <View style={[styles.categoryIndicatorDot, { backgroundColor: Colors.secondary }]} />
              <Text style={styles.breakdownLabel}>TEACHING LOAD</Text>
            </View>
            <Text style={styles.breakdownValue}>{metrics.totalTeachingHours} <Text style={styles.smallUnit}>hrs</Text></Text>
            <Text style={styles.breakdownSub}>UG Theory + Lab + PG + Others</Text>
          </View>

          <View style={styles.breakdownBox}>
            <View style={styles.breakdownHeader}>
              <View style={[styles.categoryIndicatorDot, { backgroundColor: Colors.tertiaryContainer }]} />
              <Text style={styles.breakdownLabel}>RESPONSIBILITIES</Text>
            </View>
            <Text style={styles.breakdownValue}>{metrics.totalResponsibilityHours} <Text style={styles.smallUnit}>hrs</Text></Text>
            <Text style={styles.breakdownSub}>Admin & Institutional Roles</Text>
          </View>
        </View>

        {/* Integrity Status Metrics */}
        <View style={styles.integrityContainer}>
          <TouchableOpacity
            style={[styles.integrityPill, statusFilter === 'MATCHED' && styles.integrityPillActive]}
            onPress={() => setStatusFilter(statusFilter === 'MATCHED' ? 'all' : 'MATCHED')}
          >
            <MaterialIcons name="check-circle" size={16} color={Colors.successForest} />
            <Text style={styles.integrityNumber}>{metrics.completeCount}</Text>
            <Text style={styles.integrityLabel}>Complete / Matched</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.integrityPill, statusFilter === 'INCOMPLETE SOURCE DATA' && styles.integrityPillActive]}
            onPress={() =>
              setStatusFilter(statusFilter === 'INCOMPLETE SOURCE DATA' ? 'all' : 'INCOMPLETE SOURCE DATA')
            }
          >
            <MaterialIcons name="warning-amber" size={16} color={Colors.warningAmber} />
            <Text style={styles.integrityNumber}>{metrics.incompleteCount}</Text>
            <Text style={styles.integrityLabel}>Incomplete Data</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.integrityPill, statusFilter === 'REVIEW REQUIRED' && styles.integrityPillActive]}
            onPress={() =>
              setStatusFilter(statusFilter === 'REVIEW REQUIRED' ? 'all' : 'REVIEW REQUIRED')
            }
          >
            <MaterialIcons name="error-outline" size={16} color={Colors.error} />
            <Text style={styles.integrityNumber}>{metrics.discrepancyCount}</Text>
            <Text style={styles.integrityLabel}>Discrepancies</Text>
          </TouchableOpacity>
        </View>

        {/* Validation & Discrepancy Alert Banner */}
        {metrics.incompleteCount > 0 && (
          <View style={styles.alertBanner}>
            <MaterialIcons name="info" size={20} color={Colors.warningAmber} />
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Source Integrity Notice</Text>
              <Text style={styles.alertMessage}>
                {metrics.incompleteCount} records (Mrs. A. Satheesh Kumar, Mr. P. Jaishankar) contain incomplete
                source hour specifications and are preserved without artificial inference.
              </Text>
            </View>
          </View>
        )}

        {/* Dynamic Search Input */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={20} color={Colors.onSurfaceVariant} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search faculty, designation, course code, context, role..."
              placeholderTextColor={Colors.onSurfaceVariant}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialIcons name="cancel" size={18} color={Colors.onSurfaceVariant} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Role & Category Filters */}
        <View style={styles.filtersSection}>
          <Text style={styles.filterGroupTitle}>ROLE / RESPONSIBILITY FILTER</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterPillList}>
            {[
              { id: 'all', label: 'All Faculty' },
              { id: 'HOD', label: 'HOD' },
              { id: 'ACADEMIC_COORDINATOR', label: 'Academic Coordinator' },
              { id: 'CLASS_ADVISOR', label: 'Class Advisor' },
              { id: 'PROCTOR', label: 'Proctor' },
              { id: 'TEACHING_ONLY', label: 'Teaching Only' },
              { id: 'RESPONSIBILITIES', label: 'Responsibilities' },
            ].map((f) => (
              <TouchableOpacity
                key={f.id}
                style={[styles.filterChip, roleFilter === f.id && styles.filterChipActive]}
                onPress={() => setRoleFilter(f.id)}
              >
                <Text style={[styles.filterChipText, roleFilter === f.id && styles.filterChipTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={[styles.filterGroupTitle, { marginTop: Spacing.sm }]}>TEACHING CATEGORY</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterPillList}>
            {[
              { id: 'all', label: 'All Categories' },
              { id: 'UG_THEORY', label: 'UG Theory' },
              { id: 'LAB', label: 'Laboratory' },
              { id: 'PG', label: 'PG Courses' },
              { id: 'OTHERS', label: 'PBL / Others' },
            ].map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryChip, categoryFilter === cat.id && styles.categoryChipActive]}
                onPress={() => setCategoryFilter(cat.id)}
              >
                <Text style={[styles.categoryChipText, categoryFilter === cat.id && styles.categoryChipTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {hasActiveFilters && (
            <TouchableOpacity style={styles.resetFilterRow} onPress={resetFilters}>
              <MaterialIcons name="refresh" size={14} color={Colors.secondary} />
              <Text style={styles.resetFilterText}>Clear Active Filters</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Master List Header */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.listHeaderTitle}>
            FACULTY WORKLOAD MASTER REGISTER ({filteredFaculty.length})
          </Text>
          <Text style={styles.listHeaderSub}>Tap record for complete allocation breakdown</Text>
        </View>

        {/* Faculty Workload Cards List */}
        {filteredFaculty.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="search-off" size={48} color={Colors.outlineVariant} />
            <Text style={styles.emptyStateTitle}>No Faculty Match Your Criteria</Text>
            <Text style={styles.emptyStateSub}>
              Try adjusting your search keywords or clearing active filters.
            </Text>
            <TouchableOpacity style={styles.emptyResetBtn} onPress={resetFilters}>
              <Text style={styles.emptyResetBtnText}>Reset All Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredFaculty.map((faculty, index) => {
            const isMatched = faculty.status === 'MATCHED';
            const isIncomplete = faculty.status === 'INCOMPLETE SOURCE DATA';
            const isDiscrepancy = faculty.status === 'REVIEW REQUIRED';

            return (
              <TouchableOpacity
                key={faculty.facultyId}
                style={styles.facultyCard}
                activeOpacity={0.7}
                onPress={() => router.push(`/workload/${faculty.facultyId}`)}
              >
                {/* Card Top: Index & Status */}
                <View style={styles.facultyCardHeader}>
                  <View style={styles.facultyIndexBadge}>
                    <Text style={styles.facultyIndexText}>#{index + 1}</Text>
                  </View>

                  <View style={styles.facultyTitleBox}>
                    <Text style={styles.facultyName}>{faculty.facultyName}</Text>
                    <Text style={styles.facultyDesignation}>{faculty.designation}</Text>
                  </View>

                  {/* Status Pill */}
                  <View
                    style={[
                      styles.statusPill,
                      isMatched && styles.statusPillMatched,
                      isIncomplete && styles.statusPillIncomplete,
                      isDiscrepancy && styles.statusPillReview,
                    ]}
                  >
                    <MaterialIcons
                      name={isMatched ? 'check-circle' : isIncomplete ? 'help-outline' : 'error'}
                      size={12}
                      color={
                        isMatched
                          ? Colors.successForest
                          : isIncomplete
                          ? Colors.warningAmber
                          : Colors.error
                      }
                    />
                    <Text
                      style={[
                        styles.statusPillText,
                        isMatched && styles.statusTextMatched,
                        isIncomplete && styles.statusTextIncomplete,
                        isDiscrepancy && styles.statusTextReview,
                      ]}
                    >
                      {faculty.status}
                    </Text>
                  </View>
                </View>

                {/* Card Metrics Strip */}
                <View style={styles.facultyMetricsStrip}>
                  <View style={styles.metricColumn}>
                    <Text style={styles.metricColumnLabel}>TEACHING</Text>
                    <Text style={styles.metricColumnValue}>{faculty.teachingHours}h</Text>
                  </View>

                  <View style={styles.stripDivider} />

                  <View style={styles.metricColumn}>
                    <Text style={styles.metricColumnLabel}>RESPONSIBILITIES</Text>
                    <Text style={styles.metricColumnValue}>{faculty.responsibilityHours}h</Text>
                  </View>

                  <View style={styles.stripDivider} />

                  <View style={styles.metricColumn}>
                    <Text style={styles.metricColumnLabel}>SOURCE TOTAL</Text>
                    <Text style={styles.metricColumnValue}>
                      {faculty.sourceTotalHours !== null ? `${faculty.sourceTotalHours}h` : 'N/A'}
                    </Text>
                  </View>

                  <View style={styles.stripDivider} />

                  <View style={styles.metricColumnHighlight}>
                    <Text style={styles.metricColumnLabelHighlight}>CALCULATED</Text>
                    <Text style={styles.metricColumnValueHighlight}>{faculty.calculatedTotalHours}h</Text>
                  </View>
                </View>

                {/* Responsibilities & Allocations Quick Chips */}
                <View style={styles.chipsContainer}>
                  {faculty.responsibilities.slice(0, 3).map((r, rIdx) => (
                    <View key={rIdx} style={styles.roleChip}>
                      <Text style={styles.roleChipText}>{r.role}</Text>
                    </View>
                  ))}
                  {faculty.responsibilities.length > 3 && (
                    <View style={styles.roleChipMore}>
                      <Text style={styles.roleChipMoreText}>+{faculty.responsibilities.length - 3} more</Text>
                    </View>
                  )}
                </View>

                {/* Footer Action */}
                <View style={styles.facultyCardFooter}>
                  <Text style={styles.viewDetailText}>View Full Workload Breakdown</Text>
                  <MaterialIcons name="chevron-right" size={18} color={Colors.secondary} />
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.margin,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryContainer,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.onPrimaryContainer,
    letterSpacing: 0.5,
    fontFamily: Typography.labelMono.fontFamily,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.onPrimary,
  },
  headerBadge: {
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  headerBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.onSecondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.margin,
    paddingBottom: Spacing.xxl * 2,
  },
  purposeCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
    marginBottom: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  purposeIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purposeTextContainer: {
    flex: 1,
  },
  purposeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  purposeDescription: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    lineHeight: 16,
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.5,
    fontFamily: Typography.labelMono.fontFamily,
  },
  sectionCaption: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.secondary,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  metricCard: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
    ...Shadows.sm,
  },
  primaryMetricCard: {
    backgroundColor: Colors.primaryContainer,
    borderColor: Colors.primary,
  },
  metricHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  primaryMetricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.onPrimaryContainer,
    fontFamily: Typography.labelMono.fontFamily,
  },
  primaryMetricValue: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.onPrimary,
  },
  primaryMetricSubtext: {
    fontSize: 10,
    color: Colors.onPrimaryContainer,
    marginTop: 2,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.onSurface,
  },
  unitText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
  },
  metricSubtext: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  hoursBreakdownRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  breakdownBox: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  categoryIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  breakdownLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  breakdownValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.onSurface,
  },
  smallUnit: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.onSurfaceVariant,
  },
  breakdownSub: {
    fontSize: 9,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  integrityContainer: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  integrityPill: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
    alignItems: 'center',
    gap: 2,
  },
  integrityPillActive: {
    borderColor: Colors.secondary,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  integrityNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.onSurface,
  },
  integrityLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  alertBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.warningBg,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: '#fde68a',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    alignItems: 'flex-start',
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.warningAmber,
  },
  alertMessage: {
    fontSize: 11,
    color: '#78350f',
    lineHeight: 16,
    marginTop: 2,
  },
  searchSection: {
    marginBottom: Spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs + 2,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    gap: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.onSurface,
    paddingVertical: 4,
  },
  filtersSection: {
    marginBottom: Spacing.md,
  },
  filterGroupTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.5,
    fontFamily: Typography.labelMono.fontFamily,
    marginBottom: Spacing.xs,
  },
  filterPillList: {
    gap: Spacing.xs,
    paddingBottom: Spacing.xs,
  },
  filterChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  filterChipTextActive: {
    color: Colors.onPrimary,
  },
  categoryChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
  },
  categoryChipActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  categoryChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  categoryChipTextActive: {
    color: Colors.onSecondary,
  },
  resetFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.xs,
    alignSelf: 'flex-start',
  },
  resetFilterText: {
    fontSize: 11,
    color: Colors.secondary,
    fontWeight: '600',
  },
  listHeaderRow: {
    marginBottom: Spacing.sm,
  },
  listHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.onSurface,
    fontFamily: Typography.labelMono.fontFamily,
  },
  listHeaderSub: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  emptyState: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
    marginTop: Spacing.md,
  },
  emptyStateTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onSurface,
    marginTop: Spacing.sm,
  },
  emptyStateSub: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 4,
  },
  emptyResetBtn: {
    marginTop: Spacing.md,
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
  },
  emptyResetBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.onSecondary,
  },
  facultyCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  facultyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  facultyIndexBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  facultyIndexText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  facultyTitleBox: {
    flex: 1,
    marginLeft: 4,
  },
  facultyName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  facultyDesignation: {
    fontSize: 11,
    color: Colors.secondary,
    fontWeight: '600',
    marginTop: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  statusPillMatched: {
    backgroundColor: Colors.successBg,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  statusPillIncomplete: {
    backgroundColor: Colors.warningBg,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  statusPillReview: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '700',
    fontFamily: Typography.labelMono.fontFamily,
  },
  statusTextMatched: {
    color: Colors.successForest,
  },
  statusTextIncomplete: {
    color: Colors.warningAmber,
  },
  statusTextReview: {
    color: Colors.error,
  },
  facultyMetricsStrip: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.md,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    marginBottom: Spacing.xs + 2,
  },
  metricColumn: {
    flex: 1,
    alignItems: 'center',
  },
  metricColumnHighlight: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.secondaryFixed,
    borderRadius: BorderRadius.sm,
    paddingVertical: 2,
  },
  metricColumnLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
    marginBottom: 2,
  },
  metricColumnLabelHighlight: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.onSecondaryFixed,
    fontFamily: Typography.labelMono.fontFamily,
    marginBottom: 2,
  },
  metricColumnValue: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.onSurface,
  },
  metricColumnValueHighlight: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.secondary,
  },
  stripDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.outlineVariant,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
    marginBottom: Spacing.xs,
  },
  roleChip: {
    backgroundColor: Colors.surfaceContainerHighest,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  roleChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
  },
  roleChipMore: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  roleChipMoreText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.secondary,
  },
  facultyCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainer,
    marginTop: 4,
  },
  viewDetailText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.secondary,
  },
});
