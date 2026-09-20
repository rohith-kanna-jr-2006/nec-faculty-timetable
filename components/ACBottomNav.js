import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius, Shadows } from '../constants/theme';

export default function ACBottomNav({ activeTab = 'dashboard' }) {
  const router = useRouter();

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'grid-view',
      route: '/coordinator',
    },
    {
      id: 'configure',
      label: 'Configure',
      icon: 'tune',
      route: '/coordinator/course-selection',
    },
    {
      id: 'timetable',
      label: 'Solver',
      icon: 'calendar-month',
      route: '/coordinator/optimization',
    },
    {
      id: 'validation',
      label: 'Validation',
      icon: 'verified',
      route: '/coordinator/validation',
    },
  ];

  const handlePress = (tab) => {
    if (tab.id === activeTab) return;
    router.push(tab.route);
  };

  return (
    <View style={styles.navContainer}>
      <View style={styles.grid}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <Pressable
              key={tab.id}
              style={({ pressed }) => [
                styles.tabItem,
                pressed && styles.pressed,
              ]}
              onPress={() => handlePress(tab)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              <MaterialIcons
                name={tab.icon}
                size={22}
                color={isActive ? Colors.secondary : Colors.onSurfaceVariant}
              />
              <Text
                style={[
                  styles.tabLabel,
                  isActive ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainerHigh,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    ...Shadows.md,
  },
  grid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 48,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    gap: 2,
  },
  pressed: {
    opacity: 0.7,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: Typography.labelMono.fontFamily,
  },
  tabLabelActive: {
    color: Colors.secondary,
    fontWeight: '700',
  },
  tabLabelInactive: {
    color: Colors.onSurfaceVariant,
    fontWeight: '500',
  },
});
