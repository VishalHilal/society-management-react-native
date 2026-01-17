import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/store/authStore';
import { useVisitorStore } from '@/store/visitorStore';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuthStore();
  const { notifications } = useVisitorStore();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const count = notifications.filter(n => !n.isRead).length;
    setUnreadCount(count);
  }, [notifications]);

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
            name: 'vehicles',
            title: 'Vehicles',
            icon: 'car-outline',
          },
          {
            name: 'complaints',
            title: 'Complaints',
            icon: 'construct-outline',
          },
          {
            name: 'notifications',
            title: 'Alerts',
            icon: 'notifications-outline',
            badge: unreadCount > 0 ? unreadCount : undefined,
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
            name: 'emergency',
            title: 'Emergency',
            icon: 'warning-outline',
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
            name: 'vehicles',
            title: 'Vehicles',
            icon: 'car-outline',
          },
          {
            name: 'visitors',
            title: 'Visitors',
            icon: 'person-outline',
          },
          {
            name: 'complaints',
            title: 'Complaints',
            icon: 'construct-outline',
          },
          {
            name: 'emergency',
            title: 'Emergency',
            icon: 'warning-outline',
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

  const TabBarIcon = ({ color, size, icon, badge }: any) => (
    <View style={{ position: 'relative' }}>
      <Ionicons name={icon} size={size} color={color} />
      {badge && (
        <View
          style={{
            position: 'absolute',
            right: -6,
            top: -3,
            backgroundColor: '#FF3B30',
            borderRadius: 10,
            width: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 12,
              fontWeight: 'bold',
            }}
          >
            {badge > 99 ? '99+' : badge}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#007AFF',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#8E8E93' : '#8E8E93',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
          borderTopColor: colorScheme === 'dark' ? '#38383A' : '#C6C6C8',
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4,
        },
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
              <TabBarIcon 
                color={color} 
                size={size} 
                icon={tab.icon as any}
                badge={tab.badge}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
