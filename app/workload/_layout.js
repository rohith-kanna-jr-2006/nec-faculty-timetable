import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../../constants/theme';

export default function WorkloadLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Faculty Workload Master Register' }} />
      <Stack.Screen name="[id]" options={{ title: 'Faculty Workload Detail' }} />
    </Stack>
  );
}
