import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '../constants/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor={Colors.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
        <Stack.Screen name="(faculty)" options={{ animation: 'fade' }} />
        <Stack.Screen name="coordinator" options={{ animation: 'fade' }} />
        <Stack.Screen name="hod" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="workload" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
