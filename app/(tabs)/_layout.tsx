import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/store/authStore';
import { useVisitorStore } from '@/store/visitorStore';

type Role = 'resident' | 'security' | 'admin';
type TabDef = {
  name: string;
  title: string;
  icon: any;
  activeIcon: any;
  roles: Role[];
  badge?: number;
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuthStore();
  const { notifications } = useVisitorStore();
  const [unreadCount, setUnreadCount] = useState(0);

  const isDark = colorScheme === 'dark';

  useEffect(() => {
    const count = notifications.filter(n => !n.isRead).length;
    setUnreadCount(count);
  }, [notifications]);

  const TAB_DEFS: TabDef[] = [
    { name: 'index', title: 'Home', icon: 'home-outline', activeIcon: 'home', roles: ['resident','security','admin'] },
    { name: 'visitors', title: 'Visitors', icon: 'people-outline', activeIcon: 'people', roles: ['resident'] },
    { name: 'qr-scanner', title: 'Scan', icon: 'scan-outline', activeIcon: 'scan', roles: ['security'] },
    { name: 'residents', title: 'Residents', icon: 'people-outline', activeIcon: 'people', roles: ['admin'] },
    { name: 'emergency', title: 'Emergency', icon: 'warning-outline', activeIcon: 'warning', roles: ['security'] },
    { name: 'notifications', title: 'Alerts', icon: 'notifications-outline', activeIcon: 'notifications', badge: unreadCount || undefined, roles: ['resident'] },
    { name: 'reports', title: 'Reports', icon: 'bar-chart-outline', activeIcon: 'bar-chart', roles: ['admin'] },
    { name: 'profile', title: 'Profile', icon: 'person-circle-outline', activeIcon: 'person-circle', roles: ['resident','security','admin'] },
  ];

  const ALL_TAB_ROUTES = [
    'index','visitors','qr-scanner','residents','emergency',
    'notifications','reports','profile',
    'complaints','deliveries','explore','logs','qr-code','settings','vehicles','visitor-entry'
  ] as const;

  const userRole = user?.role as Role | undefined;
  const tabByName = new Map<string, TabDef>(TAB_DEFS.map(t => [t.name, t]));

  const TabBarIcon = ({ color, size, icon, activeIcon, badge, focused }: any) => (
    <View style={styles.iconContainer}>
      {focused && (
        <View
          style={[
            styles.activeIndicator,
            { backgroundColor: isDark ? '#2C2C2E' : '#E5E5EA' }
          ]}
        />
      )}

      <View style={styles.iconWrapper}>
        <Ionicons
          name={focused ? activeIcon : icon}
          size={focused ? size + 2 : size}
          color={color}
        />

        {badge && (
          <View
            style={[
              styles.badge,
              { 
                borderColor: isDark ? '#1C1C1E' : '#FFFFFF',
                backgroundColor: '#FF3B30',
              }
            ]}
          >
            <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarHideOnKeyboard: Platform.OS === 'android',

        tabBarActiveTintColor: isDark ? '#0A84FF' : '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',

        tabBarStyle: {
          backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
          borderTopColor: isDark ? '#38383A' : '#E5E5EA',
          borderTopWidth: 0.5,
          
          // Fixed positioning for better accessibility
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 8,
          
          // Shadow for depth
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 12,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
          letterSpacing: 0.1,
        },
        
        tabBarIconStyle: {
          marginBottom: 0,
        },
      }}
    >
      {ALL_TAB_ROUTES.map((routeName) => {
        const tab = tabByName.get(routeName);
        const isAllowed = !!tab && !!userRole && tab.roles.includes(userRole);

        if (!tab || !isAllowed) {
          return <Tabs.Screen key={routeName} name={routeName} options={{ href: null }} />;
        }

        return (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              tabBarIcon: ({ color, size, focused }) => (
                <TabBarIcon
                  color={color}
                  size={size}
                  icon={tab.icon}
                  activeIcon={tab.activeIcon}
                  badge={tab.badge}
                  focused={focused}
                />
              ),
            }}
          />
        );
      })}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 40,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    width: 54,
    height: 36,
    borderRadius: 18,
    opacity: 1,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    right: -10,
    top: -6,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 10,
  },
});