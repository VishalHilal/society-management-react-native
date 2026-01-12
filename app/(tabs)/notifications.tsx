import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { useAuthStore } from '@/store/authStore';
import { useVisitorStore } from '@/store/visitorStore';
import { Notification } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const { notifications, setNotifications, markNotificationRead } = useVisitorStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      // In a real app, this would call the API
      // const response = await apiService.getNotifications(user?.id);
      // setNotifications(response);
      
      // Mock data for development
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
          message: 'Sarah Johnson has checked in at the gate',
          type: 'visitor_arrived',
          isRead: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: '3',
          userId: user?.id || '',
          title: 'Visitor Departed',
          message: 'Mike Johnson has checked out',
          type: 'visitor_departed',
          isRead: true,
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: '4',
          userId: user?.id || '',
          title: 'Security Alert',
          message: 'Unauthorized access attempt detected at main gate',
          type: 'security_alert',
          isRead: true,
          createdAt: new Date(Date.now() - 10800000).toISOString(),
        },
      ];
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        // In a real app, this would call the API
        // await apiService.markNotificationRead(notification.id);
        markNotificationRead(notification.id);
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
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
      case 'visitor_departed': return '#6b7280';
      case 'security_alert': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const clearAllNotifications = () => {
    // In a real app, this would call the API
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!user || user.role !== 'resident') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Card>
          <View style={styles.errorContainer}>
            <Ionicons name="warning-outline" size={48} color="#f59e0b" />
            <Text style={[styles.errorText, { color: colors.text }]}>
              Access Denied
            </Text>
            <Text style={[styles.errorSubtext, { color: colors.text + '80' }]}>
              Only residents can view notifications
            </Text>
          </View>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Card title={`Notifications ${unreadCount > 0 ? `(${unreadCount})` : ''}`}>
        {unreadCount > 0 && (
          <View style={styles.headerActions}>
            <Button
              title="Mark All as Read"
              onPress={() => {
                notifications.forEach(n => !n.isRead && markNotificationRead(n.id));
              }}
              variant="secondary"
              size="small"
            />
            <Button
              title="Clear All"
              onPress={clearAllNotifications}
              variant="danger"
              size="small"
            />
          </View>
        )}
      </Card>

      {notifications.length === 0 ? (
        <Card>
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={48} color={colors.text + '40'} />
            <Text style={[styles.emptyText, { color: colors.text + '60' }]}>
              No notifications
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.text + '40' }]}>
              You'll see updates about visitors and security here
            </Text>
          </View>
        </Card>
      ) : (
        notifications.map((notification) => (
          <Card key={notification.id}>
            <View 
              style={[
                styles.notificationItem,
                !notification.isRead && { backgroundColor: colors.primary + '10' }
              ]}
              onTouchEnd={() => handleNotificationPress(notification)}
            >
              <View style={styles.notificationHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons 
                    name={getNotificationIcon(notification.type) as any}
                    size={24} 
                    color={getNotificationColor(notification.type)} 
                  />
                </View>
                <View style={styles.notificationMeta}>
                  <Text style={[styles.notificationTitle, { color: colors.text }]}>
                    {notification.title}
                  </Text>
                  <Text style={[styles.notificationTime, { color: colors.text + '60' }]}>
                    {new Date(notification.createdAt).toLocaleString()}
                  </Text>
                </View>
                {!notification.isRead && (
                  <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
                )}
              </View>
              
              <Text style={[styles.notificationMessage, { color: colors.text }]}>
                {notification.message}
              </Text>
              
              <View style={styles.notificationActions}>
                {notification.type === 'visitor_request' && (
                  <View style={styles.actionButtons}>
                    <Button
                      title="Approve"
                      onPress={() => {}}
                      size="small"
                      style={styles.approveButton}
                    />
                    <Button
                      title="Reject"
                      onPress={() => {}}
                      variant="danger"
                      size="small"
                      style={styles.rejectButton}
                    />
                  </View>
                )}
              </View>
            </View>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
  },
  errorSubtext: {
    fontSize: 16,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  notificationItem: {
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationMeta: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  notificationActions: {
    marginTop: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  approveButton: {
    flex: 1,
  },
  rejectButton: {
    flex: 1,
  },
});
