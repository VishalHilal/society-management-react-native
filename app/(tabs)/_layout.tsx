import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/store/authStore';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuthStore();

  const getTabs = () => {
    if (!user) return [];

    switch (user.role) {
      case 'resident':
        return [
          {
            name: 'index',
            title: 'Home',
            icon: 'home-outline',
          },
          {
            name: 'visitors',
            title: 'Visitors',
            icon: 'people-outline',
          },
          {
            name: 'qr-code',
            title: 'My QR',
            icon: 'qr-code-outline',
          },
          {
            name: 'notifications',
            title: 'Alerts',
            icon: 'notifications-outline',
          },
        ];
      case 'security':
        return [
          {
            name: 'index',
            title: 'Dashboard',
            icon: 'shield-checkmark-outline',
          },
          {
            name: 'qr-scanner',
            title: 'Scan QR',
            icon: 'camera-outline',
          },
          {
            name: 'visitor-entry',
            title: 'Visitor Entry',
            icon: 'person-add-outline',
          },
          {
            name: 'logs',
            title: 'Logs',
            icon: 'document-text-outline',
          },
        ];
      case 'admin':
        return [
          {
            name: 'index',
            title: 'Dashboard',
            icon: 'speedometer-outline',
          },
          {
            name: 'residents',
            title: 'Residents',
            icon: 'people-outline',
          },
          {
            name: 'visitors',
            title: 'Visitors',
            icon: 'person-outline',
          },
          {
            name: 'settings',
            title: 'Settings',
            icon: 'settings-outline',
          },
        ];
      default:
        return [];
    }
  };

  const tabs = getTabs();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#007AFF',
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={tab.icon as any} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
