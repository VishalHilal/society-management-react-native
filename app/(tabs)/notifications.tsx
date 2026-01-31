import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { useAuthStore } from '@/store/authStore';
import { useVisitorStore } from '@/store/visitorStore';
import { Notification } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  RefreshControl,
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  useWindowDimensions,
} from 'react-native';

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const { user } = useAuthStore();
  const { notifications, setNotifications, markNotificationRead } = useVisitorStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        userId: user?.id || '',
        title: 'New Visitor Request',
        message: 'John Smith is waiting for your approval',
        type: 'visitor_request',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        userId: user?.id || '',
        title: 'Visitor Arrived',
        message: 'Sarah Johnson has checked in',
        type: 'visitor_arrived',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ];
    setNotifications(mockNotifications);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'visitor_request': return 'person-add-outline';
      case 'visitor_arrived': return 'log-in-outline';
      case 'visitor_departed': return 'log-out-outline';
      case 'security_alert': return 'warning-outline';
      default: return 'notifications-outline';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'visitor_request': return '#f59e0b';
      case 'visitor_arrived': return '#10b981';
      case 'security_alert': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <Pressable
      onPress={() => !item.isRead && markNotificationRead(item.id)}
      style={[
        styles.notificationCard,
        !item.isRead && { backgroundColor: colors.primary + '10' },
      ]}
    >
      <View style={styles.row}>
        <View style={[styles.iconBox]}>
          <Ionicons
            name={getNotificationIcon(item.type) as any}
            size={24}
            color={getNotificationColor(item.type)}
          />
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.time, { color: colors.text + '60' }]}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
          <Text style={[styles.message, { color: colors.text }]}>
            {item.message}
          </Text>

          {item.type === 'visitor_request' && (
            <View style={styles.actions}>
              <Button title="Approve" size="small" />
              <Button title="Reject" variant="danger" size="small" />
            </View>
          )}
        </View>

        {!item.isRead && <View style={[styles.dot, { backgroundColor: colors.primary }]} />}
      </View>
    </Pressable>
  );

  if (!user || user.role !== 'resident') {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="lock-closed-outline" size={60} color="#f59e0b" />
        <Text style={styles.denied}>Access Denied</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={notifications}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={[
        styles.container,
        { paddingHorizontal: isTablet ? 40 : 16 },
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadNotifications} />
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Ionicons name="notifications-off-outline" size={60} color={colors.text + '40'} />
          <Text style={[styles.emptyText, { color: colors.text + '70' }]}>
            No Notifications
          </Text>
        </View>
      }
    />
  );
}
