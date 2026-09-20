import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius, Shadows } from '../../constants/theme';
import { NOTIFICATIONS_DATA } from '../../constants/demoData';

export default function FacultyLayout() {
  const unreadNotifs = NOTIFICATIONS_DATA.filter((n) => n.status === 'unread').length;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.secondary,
        tabBarInactiveTintColor: Colors.onSurfaceVariant,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name="grid-view"
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="timetable"
        options={{
          title: 'My Schedule',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="calendar-month" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="weekly-timetable"
        options={{
          title: 'Weekly Grid',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="view-week" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="workload"
        options={{
          title: 'Validation',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="verified" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color }) => (
            <View style={styles.iconBadgeWrapper}>
              <MaterialIcons name="notifications" size={22} color={color} />
              {unreadNotifs > 0 && <View style={styles.unreadBadgeDot} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="account-circle" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainerHigh,
    height: Platform.OS === 'ios' ? 84 : 64,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    ...Shadows.md,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: Typography.labelMono.fontFamily,
    marginTop: 2,
  },
  tabBarItem: {
    paddingHorizontal: 2,
  },
  iconBadgeWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadgeDot: {
    position: 'absolute',
    top: -2,
    right: -3,
    width: 7,
    height: 7,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondary,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
});
