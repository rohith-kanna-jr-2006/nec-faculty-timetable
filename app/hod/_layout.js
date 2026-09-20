import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../../constants/theme';

export default function HODLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="login" options={{ title: 'HOD Executive Portal Login' }} />
      <Stack.Screen name="index" options={{ title: 'HOD Academic Executive Desk' }} />
      <Stack.Screen name="context" options={{ title: 'Academic Context Selection' }} />
      <Stack.Screen name="class-advisor" options={{ title: 'Class Advisor Assignment' }} />
      <Stack.Screen name="faculty-input" options={{ title: 'Course Faculty Input Review' }} />
      <Stack.Screen name="faculty-allocation" options={{ title: 'HOD Faculty Allocation' }} />
      <Stack.Screen name="allocation-review" options={{ title: 'Allocation Pre-Ratification Audit' }} />
      <Stack.Screen name="timetable-review" options={{ title: 'Class Timetable Review' }} />
      <Stack.Screen name="approval" options={{ title: 'HOD Timetable Approval' }} />
      <Stack.Screen name="approval-details" options={{ title: 'HOD Ratified Approval Order' }} />
      <Stack.Screen name="notifications" options={{ title: 'HOD Notifications' }} />
      <Stack.Screen name="profile" options={{ title: 'HOD Executive Identity' }} />
    </Stack>
  );
}
