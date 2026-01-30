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
            name: 'vehicles',
            title: 'Vehicles',
            icon: 'car-outline',
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
            title: 'Scan',
            icon: 'camera-outline',
          },
          {
            name: 'visitor-entry',
            title: 'Entry',
            icon: 'person-add-outline',
          },
          {
            name: 'emergency',
            title: 'Emergency',
            icon: 'warning-outline',
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
            right: -8,
            top: -4,
            backgroundColor: '#FF3B30',
            borderRadius: 8,
            width: 16,
            height: 16,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 10,
              fontWeight: 'bold',
              lineHeight: 10,
            }}
          >
            {badge > 9 ? '9+' : badge}
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
          height: 70,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginBottom: 2,
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
