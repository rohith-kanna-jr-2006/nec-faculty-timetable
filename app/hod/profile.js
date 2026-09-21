import React from 'react';
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
import { getHODProfile } from '../../constants/demoData';

export default function HODProfileScreen() {
  const router = useRouter();
  const profile = getHODProfile();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out of HOD Portal',
      'Are you sure you want to terminate the Level 01 Executive authenticated session?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => router.replace('/hod/login') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <HODHeader title="Executive Profile" showBack={true} showActions={false} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Executive Banner Card */}
        {profile ? (
          <View style={styles.profileHeroCard}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>{profile.initials || 'HD'}</Text>
            </View>

            <View style={styles.clearanceTag}>
              <MaterialIcons name="security" size={13} color="#38BDF8" />
              <Text style={styles.clearanceTagText}>{profile.clearanceLevel || 'LEVEL 01 STATUTORY EXECUTIVE'}</Text>
            </View>

            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileDesignation}>{profile.designation || 'Head of Department'}</Text>
            <Text style={styles.profileDept}>{profile.department || 'Department of Computer Science & Engineering'}</Text>
          </View>
        ) : (
          <View style={styles.unauthCard}>
            <MaterialIcons name="person-outline" size={48} color={Colors.onSurfaceVariant} />
            <Text style={styles.unauthTitle}>No HOD Profile Available</Text>
            <Text style={styles.unauthSub}>
              No authenticated executive session detected. Authenticate with institutional credentials to view mandate details.
            </Text>
            <Pressable
              style={styles.signInRedirectBtn}
              onPress={() => router.push('/hod/login')}
            >
              <Text style={styles.signInRedirectText}>Authenticate as HOD</Text>
            </Pressable>
          </View>
        )}

        {/* Statutory Governance Details */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>EXECUTIVE MANDATE & GOVERNANCE</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Statutory Authority</Text>
            <Text style={styles.infoVal}>Head of Department (L1 Approver)</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Jurisdiction Scope</Text>
            <Text style={styles.infoVal}>All CSE Cohorts (I - IV Year, All Sections)</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Class Advisor Power</Text>
            <Text style={[styles.infoVal, { color: '#059669', fontWeight: '800' }]}>
              Sole Appointing Authority
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Course Allocation</Text>
            <Text style={[styles.infoVal, { color: '#059669', fontWeight: '800' }]}>
              Binding Faculty Order Decision
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Timetable Release</Text>
            <Text style={[styles.infoVal, { color: '#059669', fontWeight: '800' }]}>
              Official Seal & Ratification
            </Text>
          </View>
        </View>

        {/* Office & Institutional Contact */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>EXECUTIVE OFFICE & CONTACT</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Secretariat Office</Text>
            <Text style={styles.infoVal}>{profile?.cabin}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Official Email</Text>
            <Text style={styles.infoVal}>{profile?.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Intercom / Phone</Text>
            <Text style={styles.infoVal}>{profile?.phone}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Curriculum Regulation</Text>
            <Text style={styles.infoVal}>{profile?.regulation}</Text>
          </View>
        </View>

        {/* Cross-Portal Switch Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>CROSS-PORTAL CONSOLES</Text>

          <Pressable
            style={styles.switchRow}
            onPress={() => router.push('/coordinator')}
          >
            <View style={styles.switchRowLeft}>
              <MaterialIcons name="tune" size={18} color="#2563EB" />
              <View>
                <Text style={styles.switchTitle}>Academic Coordinator Console</Text>
                <Text style={styles.switchSub}>Open operational solver & matrix engine</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={18} color={Colors.outlineVariant} />
          </Pressable>

          <Pressable
            style={styles.switchRow}
            onPress={() => router.push('/(faculty)/dashboard')}
          >
            <View style={styles.switchRowLeft}>
              <MaterialIcons name="person" size={18} color="#475569" />
              <View>
                <Text style={styles.switchTitle}>Faculty / Proctor Portal</Text>
                <Text style={styles.switchSub}>View instructional timetable & workload</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={18} color={Colors.outlineVariant} />
          </Pressable>
        </View>

        {/* Sign Out Action */}
        <Pressable
          style={styles.signOutBtn}
          onPress={handleSignOut}
        >
          <MaterialIcons name="logout" size={18} color="#DC2626" />
          <Text style={styles.signOutText}>Sign Out of HOD Executive Desk</Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Nandha Engineering College • Autonomous Regulation R2022</Text>
          <Text style={styles.footerSubText}>IT Cell Academic Timetable Scheduler Prototype</Text>
        </View>
      </ScrollView>

      <HODBottomNav activeTab="dashboard" />
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
  profileHeroCard: {
    backgroundColor: '#0F2942',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#38BDF8',
    marginBottom: 10,
  },
  avatarLargeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 24,
  },
  clearanceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    gap: 4,
    marginBottom: 8,
  },
  clearanceTagText: {
    color: '#38BDF8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  profileName: {
    ...Typography.titleMedium,
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 2,
  },
  profileDesignation: {
    ...Typography.bodySmall,
    color: '#93C5FD',
    fontWeight: '700',
    fontSize: 12,
    textAlign: 'center',
  },
  profileDept: {
    ...Typography.bodySmall,
    color: '#CBD5E1',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    ...Shadows.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.labelSmall,
    color: Colors.onSurfaceVariant,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 11,
    color: '#0F2942',
    fontWeight: '700',
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  switchRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  switchTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F2942',
  },
  switchSub: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FECACA',
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    gap: 6,
    marginBottom: Spacing.lg,
  },
  signOutText: {
    ...Typography.labelMedium,
    color: '#DC2626',
    fontWeight: '800',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: Spacing.md,
  },
  footerText: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
  },
  footerSubText: {
    fontSize: 9,
    color: Colors.outlineVariant,
    marginTop: 2,
  },
  unauthCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  unauthTitle: {
    ...Typography.titleMedium,
    color: '#0F2942',
    fontWeight: '800',
    fontSize: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  unauthSub: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 14,
  },
  signInRedirectBtn: {
    backgroundColor: '#0F2942',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
  },
  signInRedirectText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
