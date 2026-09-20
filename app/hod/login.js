import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import StitchLogo from '../../components/StitchLogo';
import PrimaryButton from '../../components/PrimaryButton';
import { getHODProfile } from '../../constants/demoData';

export default function HODLoginScreen() {
  const router = useRouter();
  const hodProfile = getHODProfile();

  const [hodId, setHodId] = useState(hodProfile?.email || 'hod.cse@nandhaengg.org');
  const [password, setPassword] = useState('HODExecutive2024#');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!hodId || !password) {
      Alert.alert('Missing Credentials', 'Please enter your HOD executive identity.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/hod');
    }, 700);
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Institutional Crest & Clearance Banner */}
          <View style={styles.brandBox}>
            <View style={styles.logoWrapper}>
              <StitchLogo size={64} />
            </View>

            <View style={styles.tagBadge}>
              <Text style={styles.tagBadgeText}>AUTONOMOUS INSTITUTION • AFFILIATED TO ANNA UNIVERSITY</Text>
            </View>

            <Text style={styles.institutionName}>NANDHA ENGINEERING COLLEGE</Text>
            <Text style={styles.departmentName}>Department of Computer Science & Engineering</Text>

            <View style={styles.clearanceCard}>
              <View style={styles.clearanceDot} />
              <Text style={styles.clearanceText}>PORTAL CLEARANCE LEVEL 01 • EXECUTIVE HOD ACCESS</Text>
            </View>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <View style={styles.portalBadgeRow}>
              <View style={styles.portalTag}>
                <MaterialIcons name="security" size={14} color="#FFFFFF" />
                <Text style={styles.portalTagText}>EXECUTIVE GOVERNANCE DESK</Text>
              </View>
              <View style={styles.duoBadge}>
                <MaterialIcons name="verified-user" size={12} color="#0284C7" />
                <Text style={styles.duoText}>2FA DUO ACTIVE</Text>
              </View>
            </View>

            <Text style={styles.formHeading}>Head of Department Sign-in</Text>
            <Text style={styles.formSub}>
              Sole ratification authority for Class Advisors, Course-Faculty allocations, and Timetable approval.
            </Text>

            {/* Email / ERP ID */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>EXECUTIVE EMAIL / ERP USERNAME</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="mail-outline" size={20} color={Colors.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={hodId}
                  onChangeText={setHodId}
                  placeholder="hod.cse@nandhaengg.org"
                  placeholderTextColor={Colors.onSurfaceVariant}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>SECURITY PASSPHRASE</Text>
                <Text style={styles.securityTag}>RSA-4096 BIT</Text>
              </View>
              <View style={styles.inputContainer}>
                <MaterialIcons name="lock-outline" size={20} color={Colors.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter passphrase"
                  placeholderTextColor={Colors.onSurfaceVariant}
                  secureTextEntry={!showPassword}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                  hitSlop={8}
                >
                  <MaterialIcons
                    name={showPassword ? 'visibility' : 'visibility-off'}
                    size={20}
                    color={Colors.onSurfaceVariant}
                  />
                </Pressable>
              </View>
            </View>

            {/* Remember Device */}
            <Pressable
              style={styles.rememberRow}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                {rememberMe && <MaterialIcons name="check" size={14} color="#FFFFFF" />}
              </View>
              <Text style={styles.rememberText}>Maintain authenticated HOD executive session on this device</Text>
            </Pressable>

            {/* Authenticate Action */}
            <PrimaryButton
              title={isLoading ? 'Verifying Executive Clearance...' : 'Authenticate as Head of Department'}
              icon="admin-panel-settings"
              iconRight="arrow-forward"
              onPress={handleLogin}
              style={styles.loginBtn}
            />
          </View>

          {/* Cross-Portal Switch Links */}
          <View style={styles.switchPortalsBox}>
            <Text style={styles.switchHeading}>SWITCH INSTITUTIONAL WORKSPACE</Text>

            <Pressable
              style={styles.portalRow}
              onPress={() => router.push('/coordinator')}
            >
              <View style={styles.portalRowLeft}>
                <MaterialIcons name="tune" size={18} color="#2563EB" />
                <View>
                  <Text style={styles.portalRowTitle}>Academic Coordinator (AC) Console</Text>
                  <Text style={styles.portalRowSub}>Operational matrix preparation & solver</Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={18} color={Colors.outlineVariant} />
            </Pressable>

            <Pressable
              style={styles.portalRow}
              onPress={() => router.push('/(faculty)/dashboard')}
            >
              <View style={styles.portalRowLeft}>
                <MaterialIcons name="person" size={18} color="#475569" />
                <View>
                  <Text style={styles.portalRowTitle}>Teaching Faculty / Proctor Portal</Text>
                  <Text style={styles.portalRowSub}>Personal workload & assigned schedule</Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={18} color={Colors.outlineVariant} />
            </Pressable>
          </View>

          {/* Statutory Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Autonomous Regulation R2022 • IT Cell Timetable Governance</Text>
            <Text style={styles.footerSubText}>HOD Secretariat • CSE Block Ground Floor • Ext 201</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.margin,
    paddingVertical: Spacing.lg,
  },
  brandBox: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoWrapper: {
    padding: 8,
    marginBottom: 8,
  },
  tagBadge: {
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    marginBottom: 6,
  },
  tagBadgeText: {
    ...Typography.labelSmall,
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.5,
  },
  institutionName: {
    ...Typography.titleMedium,
    color: '#0F2942',
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  departmentName: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 8,
  },
  clearanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F2942',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 6,
  },
  clearanceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
  },
  clearanceText: {
    color: '#E2E8F0',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    ...Shadows.md,
    marginBottom: Spacing.lg,
  },
  portalBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  portalTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F2942',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 5,
  },
  portalTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  duoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    gap: 4,
  },
  duoText: {
    color: '#0369A1',
    fontSize: 10,
    fontWeight: '800',
  },
  formHeading: {
    ...Typography.titleLarge,
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 20,
    marginBottom: 4,
  },
  formSub: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    ...Typography.labelSmall,
    color: Colors.onSurfaceVariant,
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  securityTag: {
    ...Typography.labelSmall,
    color: '#0284C7',
    fontSize: 9,
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    height: 48,
    color: Colors.onSurface,
    ...Typography.bodyMedium,
  },
  eyeBtn: {
    padding: 4,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxActive: {
    backgroundColor: '#0F2942',
    borderColor: '#0F2942',
  },
  rememberText: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontSize: 12,
    flex: 1,
  },
  loginBtn: {
    backgroundColor: '#0F2942',
  },
  switchPortalsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    marginBottom: Spacing.lg,
  },
  switchHeading: {
    ...Typography.labelSmall,
    color: Colors.onSurfaceVariant,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  portalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant,
  },
  portalRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  portalRowTitle: {
    ...Typography.bodyMedium,
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  portalRowSub: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  footerText: {
    ...Typography.bodySmall,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
  },
  footerSubText: {
    ...Typography.bodySmall,
    color: Colors.outlineVariant,
    fontSize: 10,
    marginTop: 2,
  },
});
