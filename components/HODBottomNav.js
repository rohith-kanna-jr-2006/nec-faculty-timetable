import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius, Shadows } from '../constants/theme';

export default function HODBottomNav({ activeTab = 'dashboard' }) {
  const router = useRouter();

  const tabs = [
    {
      id: 'dashboard',
      label: 'Desk',
      icon: 'dashboard',
      route: '/hod',
    },
    {
      id: 'scope',
      label: 'Context',
      icon: 'layers',
      route: '/hod/context',
    },
    {
      id: 'advisors',
      label: 'Advisors',
      icon: 'school',
      route: '/hod/class-advisor',
    },
    {
      id: 'allocations',
      label: 'Allocate',
      icon: 'how-to-reg',
      route: '/hod/faculty-allocation',
    },
    {
      id: 'timetable',
      label: 'Timetable',
      icon: 'table-chart',
      route: '/hod/timetable-review',
    },
    {
      id: 'approvals',
      label: 'Approval',
      icon: 'gavel',
      route: '/hod/approval',
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
              <View style={[styles.iconBox, isActive && styles.iconBoxActive]}>
                <MaterialIcons
                  name={tab.icon}
                  size={20}
                  color={isActive ? '#FFFFFF' : Colors.onSurfaceVariant}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.tabLabelActive,
                ]}
                numberOfLines={1}
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
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant,
    paddingBottom: 16,
    paddingTop: 6,
    ...Shadows.md,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  pressed: {
    opacity: 0.6,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  iconBoxActive: {
    backgroundColor: '#0F2942',
  },
  tabLabel: {
    ...Typography.labelSmall,
    color: Colors.onSurfaceVariant,
    fontSize: 10,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#0F2942',
    fontWeight: '800',
  },
});
