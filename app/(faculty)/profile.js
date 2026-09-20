import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AppHeader from '../../components/AppHeader';
import Card from '../../components/Card';
import ProfileSection from '../../components/ProfileSection';
import PrimaryButton from '../../components/PrimaryButton';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { FACULTY_PROFILE, getFacultyWorkload } from '../../constants/demoData';

export default function FacultyProfileScreen() {
  const router = useRouter();
  const workload = getFacultyWorkload();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    router.replace('/(auth)/login');
  };

  const institutionalItems = [
    { label: 'Employee ID', value: FACULTY_PROFILE.id, isMono: true },
    { label: 'Designation', value: FACULTY_PROFILE.designation },
    { label: 'Department', value: FACULTY_PROFILE.department },
    { label: 'Academic Term', value: FACULTY_PROFILE.academicYear },
    { label: 'Current Semester', value: FACULTY_PROFILE.semester },
    { label: 'Curriculum Regulation', value: FACULTY_PROFILE.regulation },
    { label: 'System Access Role', value: FACULTY_PROFILE.role, highlight: true },
    { label: 'Academic Coordinator', value: FACULTY_PROFILE.academicCoordinator },
  ];

  const contactItems = [
    { label: 'Campus Email', value: FACULTY_PROFILE.email, isMono: true },
    { label: 'ERP Contact Phone', value: FACULTY_PROFILE.phone },
    { label: 'Faculty Cabin / Desk', value: FACULTY_PROFILE.cabin },
    { label: 'Experience', value: FACULTY_PROFILE.experience },
    { label: 'Specialization Area', value: FACULTY_PROFILE.specialization },
  ];

  const teachingLoadItems = [
    { label: 'Total Weekly Contact Periods', value: `${workload.total} Periods / Week`, isMono: true },
    { label: 'Theory Sessions', value: `${workload.theory} Periods (UI/UX Design)` },
    { label: 'Laboratory Sessions', value: `${workload.lab} Periods` },
    { label: 'Assigned Cohorts', value: 'III Year CSE (Sec B & Sec C)' },
    { label: 'Department Norm Threshold', value: `Max ${workload.maxThreshold} Periods/Wk` },
    { label: 'Compliance Status', value: 'VERIFIED & COMPLIANT', isBadge: true, badgeColor: 'primary' },
  ];

  return (
    <View style={styles.screenContainer}>
      <AppHeader
        title="Faculty Profile"
        subtitle="Staff Information Desk"
        badgeText="PROFILE"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Hero Card */}
        <Card style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarInitials}>{FACULTY_PROFILE.initials}</Text>
              <View style={styles.verifiedCheckDot}>
                <MaterialIcons name="check" size={12} color="#ffffff" />
              </View>
            </View>

            <View style={styles.heroDetailsCol}>
              <View style={styles.heroNameRow}>
                <Text style={styles.facultyNameText}>{FACULTY_PROFILE.name}</Text>
                <View style={styles.idChip}>
                  <Text style={styles.idChipText}>{FACULTY_PROFILE.id}</Text>
                </View>
              </View>

              <Text style={styles.designationText}>
                {FACULTY_PROFILE.designation} • Dept. of CSE
              </Text>
              <Text style={styles.emailText}>{FACULTY_PROFILE.email}</Text>

              <View style={styles.badgesRow}>
                <View style={styles.statusPill}>
                  <View style={styles.pulseDot} />
                  <Text style={styles.statusPillText}>Active Staff</Text>
                </View>
                <View style={styles.rolePill}>
                  <MaterialIcons name="verified" size={11} color={Colors.secondary} />
                  <Text style={styles.rolePillText}>Verified Viewer</Text>
                </View>
              </View>
            </View>
          </View>
        </Card>

        {/* Institutional Credentials */}
        <ProfileSection
          title="Institutional Credentials"
          icon="badge"
          items={institutionalItems}
        />

        {/* Teaching Workload Profile */}
        <ProfileSection
          title="Teaching Allocation & Workload"
          icon="speed"
          items={teachingLoadItems}
        />

        {/* Contact & Faculty Desk */}
        <ProfileSection
          title="Faculty Contact & Location"
          icon="contact-mail"
          items={contactItems}
        />

        {/* System Settings & Actions */}
        <Card style={styles.settingsCard}>
          <Text style={styles.settingsTitle}>Portal Preferences</Text>

          <View style={styles.settingsList}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <MaterialIcons name="notifications-active" size={18} color={Colors.primary} />
                <View>
                  <Text style={styles.settingLabel}>Timetable Change Alerts</Text>
                  <Text style={styles.settingSub}>Instant push notification for slot reassignments</Text>
                </View>
              </View>
              <View style={styles.activeSwitchPill}>
                <Text style={styles.activeSwitchText}>Enabled</Text>
              </View>
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <MaterialIcons name="sync" size={18} color={Colors.primary} />
                <View>
                  <Text style={styles.settingLabel}>Google Calendar Two-Way Sync</Text>
                  <Text style={styles.settingSub}>c.navamani@nandhaengg.org</Text>
                </View>
              </View>
              <View style={styles.activeSwitchPill}>
                <Text style={styles.activeSwitchText}>Synced</Text>
              </View>
            </View>
          </View>

          <PrimaryButton
            title="Switch to AC View (Coordinator Console)"
            variant="secondary"
            icon="dashboard-customize"
            onPress={() => router.push('/coordinator')}
            style={styles.switchACBtn}
          />

          <PrimaryButton
            title="Sign Out from Faculty Portal"
            variant="outline"
            icon="logout"
            iconColor={Colors.error}
            onPress={handleLogout}
            style={styles.logoutBtn}
            textStyle={{ color: Colors.error, fontWeight: '700' }}
          />
        </Card>

        {/* Footer info */}
        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            NANDHA ENGINEERING COLLEGE (AUTONOMOUS) • ERODE
          </Text>
          <Text style={styles.footerSub}>
            IT Cell Academic Timetable Management System v4.2
          </Text>
        </View>
      </ScrollView>

      {/* Sign Out Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdropDismiss}
            onPress={() => setShowLogoutModal(false)}
            accessibilityLabel="Close modal"
          />
          <View style={styles.modalDialog}>
            <View style={styles.modalTopRow}>
              <View style={styles.modalIconContainer}>
                <MaterialIcons name="logout" size={24} color={Colors.error} />
              </View>
              <Pressable
                style={styles.modalCloseIconBtn}
                onPress={() => setShowLogoutModal(false)}
                hitSlop={8}
                accessibilityLabel="Close"
              >
                <MaterialIcons name="close" size={20} color={Colors.outline} />
              </Pressable>
            </View>

            <Text style={styles.modalDialogTitle}>Faculty Sign Out</Text>
            <Text style={styles.modalDialogMessage}>
              Are you sure you want to sign out from the Nandha Engineering College Faculty Timetable Portal? You will need to re-authenticate with your faculty credentials to access your teaching schedule.
            </Text>

            <View style={styles.modalStaffCard}>
              <View style={styles.modalStaffAvatar}>
                <Text style={styles.modalStaffAvatarText}>{FACULTY_PROFILE.initials}</Text>
              </View>
              <View style={styles.modalStaffInfo}>
                <Text style={styles.modalStaffName}>{FACULTY_PROFILE.name}</Text>
                <Text style={styles.modalStaffSub}>
                  {FACULTY_PROFILE.id} • {FACULTY_PROFILE.department}
                </Text>
              </View>
            </View>

            <View style={styles.modalActionButtons}>
              <Pressable
                style={({ pressed }) => [
                  styles.modalCancelButton,
                  pressed && styles.modalBtnPressed,
                ]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.modalConfirmButton,
                  pressed && styles.modalBtnPressed,
                ]}
                onPress={handleConfirmLogout}
              >
                <MaterialIcons name="logout" size={16} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={styles.modalConfirmButtonText}>Sign Out</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  heroCard: {
    marginBottom: Spacing.md,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBox: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...Shadows.sm,
  },
  avatarInitials: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  verifiedCheckDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.tertiaryFixedDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroDetailsCol: {
    flex: 1,
  },
  heroNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  facultyNameText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
    flex: 1,
  },
  idChip: {
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  idChipText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onPrimaryContainer,
    fontFamily: Typography.labelMono.fontFamily,
  },
  designationText: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  emailText: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
    marginTop: 1,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surfaceContainerHighest,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.onTertiaryContainer,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.onTertiaryContainer,
    fontFamily: Typography.labelMono.fontFamily,
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rolePillText: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  settingsCard: {
    marginBottom: Spacing.md,
  },
  settingsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 10,
  },
  settingsList: {
    gap: 10,
    marginBottom: Spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerLow,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 8,
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  settingSub: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginTop: 1,
  },
  activeSwitchPill: {
    backgroundColor: Colors.surfaceContainerHighest,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  activeSwitchText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  switchACBtn: {
    marginBottom: Spacing.sm,
    borderColor: Colors.secondaryFixedDim,
    backgroundColor: Colors.surfaceContainerLow,
  },
  logoutBtn: {
    borderColor: '#ffcdd2',
    backgroundColor: '#fff5f5',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 20, 40, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.margin,
  },
  modalBackdropDismiss: {
    ...StyleSheet.absoluteFillObject,
  },
  modalDialog: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHigh,
    ...Shadows.lg,
    zIndex: 1,
  },
  modalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.errorContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseIconBtn: {
    padding: 4,
  },
  modalDialogTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: -0.2,
    marginBottom: Spacing.xs,
  },
  modalDialogMessage: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing.md,
  },
  modalStaffCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surfaceContainerLow,
    padding: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
    marginBottom: Spacing.lg,
  },
  modalStaffAvatar: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalStaffAvatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalStaffInfo: {
    flex: 1,
  },
  modalStaffName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  modalStaffSub: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
    marginTop: 1,
  },
  modalActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalCancelButton: {
    flex: 1,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceContainer,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  modalConfirmButton: {
    flex: 1.2,
    flexDirection: 'row',
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  modalConfirmButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  footerNote: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    gap: 2,
  },
  footerNoteText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.outline,
    fontFamily: Typography.labelMono.fontFamily,
    letterSpacing: 0.5,
  },
  footerSub: {
    fontSize: 9,
    color: Colors.outline,
    letterSpacing: 0.2,
  },
});
