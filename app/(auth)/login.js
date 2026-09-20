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

export default function FacultyLogin() {
  const router = useRouter();
  const [facultyId, setFacultyId] = useState('c.navamani@nandhaengg.org');
  const [password, setPassword] = useState('FacultySecure2024!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = () => {
    if (!facultyId || !password) {
      Alert.alert('Missing Fields', 'Please enter your faculty credentials.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.replace('/(faculty)/dashboard');
      }, 600);
    }, 900);
  };

  const handleSwitchAC = () => {
    router.push('/coordinator');
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Institutional Crest & Identity */}
          <View style={styles.crestContainer}>
            <View style={styles.logoWrapper}>
              <StitchLogo size={56} />
            </View>

            <View style={styles.autonomousBadge}>
              <Text style={styles.autonomousBadgeText}>
                AUTONOMOUS INSTITUTION • AFFILIATED TO ANNA UNIVERSITY
              </Text>
            </View>

            <Text style={styles.collegeName}>NANDHA ENGINEERING COLLEGE</Text>
            <Text style={styles.suiteTitle}>Faculty Timetable Orchestration Suite</Text>
          </View>

          {/* Active Portal Indicator Badge */}
          <View style={styles.portalBadgeContainer}>
            <View style={styles.portalBadge}>
              <View style={styles.portalBadgeLeft}>
                <MaterialIcons name="co-present" size={18} color={Colors.secondary} />
                <Text style={styles.portalBadgeText}>FACULTY PORTAL ACCESS</Text>
              </View>
              <View style={styles.activeDot} />
            </View>
          </View>

          {/* Core Login Card */}
          <View style={styles.loginCard}>
            <Text style={styles.cardHeading}>Faculty Sign In</Text>

            {/* Field 1: Faculty Identifier */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>Faculty ID / Institutional Email</Text>
                <View style={styles.erpBadge}>
                  <Text style={styles.erpBadgeText}>STAFF ERP</Text>
                </View>
              </View>
              <View style={styles.inputContainer}>
                <MaterialIcons
                  name="badge"
                  size={18}
                  color={Colors.onSurfaceVariant}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. CSE-FAC-042"
                  placeholderTextColor={Colors.outline}
                  value={facultyId}
                  onChangeText={setFacultyId}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Field 2: Password */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>Portal Password</Text>
                <Pressable
                  onPress={() =>
                    Alert.alert(
                      'Password Reset',
                      'Password reset requested. Verification OTP dispatched to institutional phone & email.'
                    )
                  }
                >
                  <Text style={styles.forgotText}>Forgot?</Text>
                </Pressable>
              </View>
              <View style={styles.inputContainer}>
                <MaterialIcons
                  name="lock"
                  size={18}
                  color={Colors.onSurfaceVariant}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="••••••••••••"
                  placeholderTextColor={Colors.outline}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  accessibilityLabel="Toggle password visibility"
                >
                  <MaterialIcons
                    name={showPassword ? 'visibility-off' : 'visibility'}
                    size={18}
                    color={Colors.onSurfaceVariant}
                  />
                </Pressable>
              </View>
            </View>

            {/* Helper Preferences Checkbox */}
            <View style={styles.checkboxRow}>
              <Pressable
                style={styles.checkboxTouch}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <MaterialIcons name="check" size={12} color="#ffffff" />}
                </View>
                <Text style={styles.checkboxLabel}>Remember this workstation</Text>
              </Pressable>
              <View style={styles.twoFaBadge}>
                <Text style={styles.twoFaBadgeText}>2FA ACTIVE</Text>
              </View>
            </View>

            {/* Primary CTA Submit Button */}
            <PrimaryButton
              title={
                isSuccess
                  ? 'Access Granted! Loading...'
                  : isLoading
                  ? 'Verifying Faculty Credentials...'
                  : 'Sign In to Faculty Portal'
              }
              icon={isSuccess ? 'check-circle' : undefined}
              iconRight={!isSuccess && !isLoading ? 'arrow-forward' : undefined}
              loading={isLoading}
              onPress={handleLogin}
              style={[
                styles.submitButton,
                isSuccess && { backgroundColor: Colors.tertiaryContainer },
              ]}
              textStyle={isSuccess && { color: Colors.tertiaryFixed }}
            />
          </View>

          {/* Switch Portal Card (Academic Coordinator Partition) */}
          <View style={styles.switchPortalCard}>
            <View style={styles.switchPortalTop}>
              <View style={styles.switchIconBox}>
                <MaterialIcons name="dashboard-customize" size={18} color={Colors.primary} />
              </View>
              <View style={styles.switchPortalTextCol}>
                <Text style={styles.switchPortalTitle}>Academic Coordinator (AC) Portal</Text>
                <Text style={styles.switchPortalDesc}>
                  Designated Class Advisors, Timetable Coordinators & HODs manage slot allocations, faculty mappings, and workload balancing in the AC console.
                </Text>
              </View>
            </View>

            <PrimaryButton
              title="Switch to AC View"
              variant="outline"
              iconRight="swap-horiz"
              onPress={handleSwitchAC}
              style={styles.switchBtn}
            />
          </View>

          {/* Quick Academic Calendar Status Chip */}
          <View style={styles.calendarStatusRow}>
            <View style={styles.calendarStatusLeft}>
              <View style={styles.calendarDot} />
              <Text style={styles.calendarTermText}>ODD SEMESTER 2024-25</Text>
            </View>
            <Text style={styles.calendarWeekText}>WEEK 11 (ACTIVE)</Text>
          </View>

          {/* Institutional Footer Info */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerCollege}>Nandha Engineering College • Autonomous</Text>
            <View style={styles.footerDeskRow}>
              <Text style={styles.footerDeskText}>ERP DESK: ext 241</Text>
              <Text style={styles.footerDeskBullet}>•</Text>
              <Text style={styles.footerDeskText}>support-tt@nandhaengg.org</Text>
            </View>
            <Text style={styles.footerFramework}>
              IT Cell Timetable Management Framework
            </Text>
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
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },
  crestContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  logoWrapper: {
    padding: 10,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
    marginBottom: Spacing.sm,
  },
  autonomousBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: BorderRadius.sm,
    marginBottom: 6,
  },
  autonomousBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.secondary,
    letterSpacing: 0.6,
    textAlign: 'center',
    fontFamily: Typography.labelMono.fontFamily,
  },
  collegeName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  suiteTitle: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
    textAlign: 'center',
  },
  portalBadgeContainer: {
    width: '100%',
    maxWidth: 360,
    marginBottom: Spacing.md,
  },
  portalBadge: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  portalBadgeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  portalBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.tertiaryFixedDim,
  },
  loginCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
    ...Shadows.md,
    marginBottom: Spacing.md,
  },
  cardHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  erpBadge: {
    backgroundColor: Colors.surfaceContainerHighest,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  erpBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Typography.labelMono.fontFamily,
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
    paddingHorizontal: 10,
    height: 44,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.onSurface,
    paddingVertical: 8,
  },
  eyeButton: {
    padding: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingTop: 2,
  },
  checkboxTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  checkboxChecked: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  checkboxLabel: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  twoFaBadge: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  twoFaBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  submitButton: {
    marginTop: 4,
  },
  switchPortalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  switchPortalTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  switchIconBox: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchPortalTextCol: {
    flex: 1,
  },
  switchPortalTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  switchPortalDesc: {
    fontSize: 11,
    lineHeight: 16,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  switchBtn: {
    minHeight: 38,
    paddingVertical: 8,
  },
  calendarStatusRow: {
    width: '100%',
    maxWidth: 360,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    marginBottom: Spacing.lg,
  },
  calendarStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  calendarDot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.tertiaryContainer,
  },
  calendarTermText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  calendarWeekText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  footerContainer: {
    alignItems: 'center',
    gap: 3,
  },
  footerCollege: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
  footerDeskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerDeskText: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    fontFamily: Typography.labelMono.fontFamily,
  },
  footerDeskBullet: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
  },
  footerFramework: {
    fontSize: 9,
    color: Colors.outline,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 2,
  },
});
