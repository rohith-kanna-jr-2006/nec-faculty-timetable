import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../../constants/theme';

export default function CoordinatorLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'AC Dashboard' }} />
      <Stack.Screen name="course-selection" options={{ title: 'Course Selection' }} />
      <Stack.Screen name="faculty-assignment" options={{ title: 'Faculty Assignment & Review' }} />
      <Stack.Screen name="optimization" options={{ title: 'Optimization Progress' }} />
      <Stack.Screen name="conflict" options={{ title: 'Faculty Conflict & Regenerate' }} />
      <Stack.Screen name="validation" options={{ title: 'Timetable Validation' }} />
    </Stack>
  );
}
