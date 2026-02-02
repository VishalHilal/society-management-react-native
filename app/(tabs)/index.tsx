import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Header } from '@/components/common/Header';
import { useAuthStore } from '@/store/authStore';
import { useVisitorStore } from '@/store/visitorStore';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_PADDING = 16;
const CARD_GAP = 12;
const CARDS_PER_ROW = 2;
const CARD_WIDTH = (width - (CARD_PADDING * 2) - CARD_GAP) / CARDS_PER_ROW;

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { user } = useAuthStore();
  const { notifications } = useVisitorStore();
  const [dashboardStats, setDashboardStats] = useState({
    todayVisitors: 0,
    activeEmergencies: 0,
    pendingComplaints: 0,
    availableParking: 0,
    occupancyRate: 0,
    monthlyRevenue: 0,
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Mock dashboard statistics
    setDashboardStats({
      todayVisitors: 24,
      activeEmergencies: 1,
      pendingComplaints: 8,
      availableParking: 15,
      occupancyRate: 78,
      monthlyRevenue: 45000,
    });

    // Mock recent activities
    setRecentActivities([
      {
        id: '1',
        type: 'visitor_checkin',
        title: 'John Doe Checked In',
        time: '2 mins ago',
        icon: 'person-add-outline',
        color: '#10b981',
      },
      {
        id: '2',
        type: 'emergency',
        title: 'Medical Emergency - Block A',
        time: '15 mins ago',
        icon: 'medical-outline',
        color: '#dc2626',
      },
      {
        id: '3',
        type: 'complaint',
        title: 'New Plumbing Complaint',
        time: '1 hour ago',
        icon: 'construct-outline',
        color: '#f59e0b',
      },
      {
        id: '4',
        type: 'delivery',
        title: 'Package Delivered to B-205',
        time: '2 hours ago',
        icon: 'cube-outline',
        color: '#3b82f6',
      },
    ]);
  };

  const getWelcomeMessage = () => {
    if (!user) return 'Welcome!';
    
    const hour = new Date().getHours();
    let greeting = 'Good evening';
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 17) greeting = 'Good afternoon';
    
    switch (user.role) {
      case 'resident':
        return `${greeting}, ${user.name}!`;
      case 'security':
        return 'Security Dashboard';
      case 'admin':
        return 'Admin Dashboard';
      default:
        return 'Welcome!';
    }
  };

  const getDashboardContent = () => {
    if (!user) return null;

    switch (user.role) {
      case 'resident':
        return <ResidentDashboard />;
      case 'security':
        return <SecurityDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return null;
    }
  };

  // Modern Stat Card Component (matching quick action style)
  const StatCard = ({ icon, number, label, color, delay = 0 }: any) => (
    <Animated.View 
      entering={FadeInUp.delay(delay).duration(600)}
      style={[styles.modernStatCard, { backgroundColor: colors.card }]}
    >
      <View style={[styles.modernStatIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={[styles.modernStatNumber, { color: colors.text }]}>
        {number}
      </Text>
      <Text style={[styles.modernStatLabel, { color: colors.text }]} numberOfLines={2}>
        {label}
      </Text>
    </Animated.View>
  );

  // Modern Quick Action Button
  const QuickActionButton = ({ icon, label, onPress, variant = 'primary' }: any) => (
    <TouchableOpacity 
      style={[
        styles.quickActionCard,
        { backgroundColor: colors.card }
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[
        styles.quickActionIconContainer,
        { backgroundColor: variant === 'danger' ? '#dc262610' : '#3b82f610' }
      ]}>
        <Ionicons 
          name={icon} 
          size={24} 
          color={variant === 'danger' ? '#dc2626' : '#3b82f6'} 
        />
      </View>
      <Text style={[styles.quickActionLabel, { color: colors.text }]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const ResidentDashboard = () => (
    <View>
      {/* Stats Overview */}
      <View style={styles.modernStatsGrid}>
        <StatCard
          icon="people-outline"
          number={notifications.filter(n => n.type === 'visitor_arrived').length}
          label="Today's Visitors"
          color="#3b82f6"
          delay={100}
        />
        <StatCard
          icon="car-outline"
          number={2}
          label="My Vehicles"
          color="#10b981"
          delay={200}
        />
        <StatCard
          icon="notifications-outline"
          number={notifications.filter(n => !n.isRead).length}
          label="Unread Alerts"
          color="#f59e0b"
          delay={300}
        />
        <StatCard
          icon="construct-outline"
          number={1}
          label="Pending Issues"
          color="#8b5cf6"
          delay={400}
        />
      </View>

      {/* Quick Actions */}
      <Animated.View entering={FadeInUp.delay(500).duration(600)}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        </View>
        <View style={styles.quickActionsGrid}>
          <QuickActionButton
            icon="person-add-outline"
            label="Add Visitor"
            onPress={() => router.push('/(tabs)/visitors')}
          />
          <QuickActionButton
            icon="qr-code-outline"
            label="My QR Code"
            onPress={() => router.push('/(tabs)/qr-code')}
          />
          <QuickActionButton
            icon="cube-outline"
            label="Deliveries"
            onPress={() => router.push('/(tabs)/deliveries')}
          />
          <QuickActionButton
            icon="chatbubble-ellipses-outline"
            label="Complaints"
            onPress={() => router.push('/(tabs)/complaints')}
          />
        </View>
      </Animated.View>

      {/* Recent Activity */}
      <Animated.View entering={FadeInUp.delay(600).duration(600)}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.text + '60' }]}>
            Last 24 hours
          </Text>
        </View>
        <View style={[styles.activityCard, { backgroundColor: colors.card }]}>
          {recentActivities.slice(0, 3).map((activity, index) => (
            <View 
              key={activity.id} 
              style={[
                styles.modernActivityItem,
                index < 2 && { borderBottomWidth: 1, borderBottomColor: colors.border }
              ]}
            >
              <View style={[styles.modernActivityIcon, { backgroundColor: activity.color + '15' }]}>
                <Ionicons name={activity.icon} size={20} color={activity.color} />
              </View>
              <View style={styles.modernActivityContent}>
                <Text style={[styles.modernActivityTitle, { color: colors.text }]} numberOfLines={1}>
                  {activity.title}
                </Text>
                <Text style={[styles.modernActivityTime, { color: colors.text + '60' }]}>
                  {activity.time}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.text + '40'} />
            </View>
          ))}
        </View>
      </Animated.View>
    </View>
  );

  const SecurityDashboard = () => (
    <View>
      {/* Security Stats */}
      <View style={styles.modernStatsGrid}>
        <StatCard
          icon="warning-outline"
          number={dashboardStats.activeEmergencies}
          label="Active Emergencies"
          color="#dc2626"
          delay={100}
        />
        <StatCard
          icon="people-outline"
          number={dashboardStats.todayVisitors}
          label="Today's Visitors"
          color="#3b82f6"
          delay={200}
        />
        <StatCard
          icon="car-outline"
          number={dashboardStats.availableParking}
          label="Available Parking"
          color="#10b981"
          delay={300}
        />
        <StatCard
          icon="shield-checkmark-outline"
          number="98%"
          label="Security Score"
          color="#f59e0b"
          delay={400}
        />
      </View>

      {/* Security Actions */}
      <Animated.View entering={FadeInUp.delay(500).duration(600)}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Security Actions</Text>
        </View>
        <View style={styles.quickActionsGrid}>
          <QuickActionButton
            icon="scan-outline"
            label="Scan QR"
            onPress={() => router.push('/(tabs)/qr-scanner')}
          />
          <QuickActionButton
            icon="person-add-outline"
            label="Visitor Entry"
            onPress={() => router.push('/(tabs)/visitor-entry')}
          />
          <QuickActionButton
            icon="cube-outline"
            label="Deliveries"
            onPress={() => router.push('/(tabs)/deliveries')}
          />
          <QuickActionButton
            icon="document-text-outline"
            label="View Logs"
            onPress={() => router.push('/(tabs)/logs')}
          />
        </View>
      </Animated.View>

      {/* Recent Alerts */}
      <Animated.View entering={FadeInUp.delay(600).duration(600)}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Alerts</Text>
        </View>
        <View style={[styles.activityCard, { backgroundColor: colors.card }]}>
          {recentActivities
            .filter(a => a.type === 'emergency' || a.type === 'security')
            .map((activity, index, arr) => (
              <View 
                key={activity.id} 
                style={[
                  styles.modernActivityItem,
                  index < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }
                ]}
              >
                <View style={[styles.modernActivityIcon, { backgroundColor: activity.color + '15' }]}>
                  <Ionicons name={activity.icon} size={20} color={activity.color} />
                </View>
                <View style={styles.modernActivityContent}>
                  <Text style={[styles.modernActivityTitle, { color: colors.text }]} numberOfLines={1}>
                    {activity.title}
                  </Text>
                  <Text style={[styles.modernActivityTime, { color: colors.text + '60' }]}>
                    {activity.time}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.text + '40'} />
              </View>
            ))}
        </View>
      </Animated.View>
    </View>
  );

  const AdminDashboard = () => (
    <View>
      {/* Admin Stats */}
      <View style={styles.modernStatsGrid}>
        <StatCard
          icon="people-outline"
          number={156}
          label="Total Residents"
          color="#3b82f6"
          delay={100}
        />
        <StatCard
          icon="cash-outline"
          number={`₹${(dashboardStats.monthlyRevenue / 1000).toFixed(0)}K`}
          label="Monthly Revenue"
          color="#10b981"
          delay={200}
        />
        <StatCard
          icon="construct-outline"
          number={dashboardStats.pendingComplaints}
          label="Pending Issues"
          color="#f59e0b"
          delay={300}
        />
        <StatCard
          icon="home-outline"
          number={`${dashboardStats.occupancyRate}%`}
          label="Occupancy Rate"
          color="#8b5cf6"
          delay={400}
        />
      </View>

      {/* Admin Actions */}
      <Animated.View entering={FadeInUp.delay(500).duration(600)}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Management Actions</Text>
        </View>
        <View style={styles.quickActionsGrid}>
          <QuickActionButton
            icon="people-outline"
            label="Manage Residents"
            onPress={() => router.push('/(tabs)/residents')}
          />
          <QuickActionButton
            icon="eye-outline"
            label="View Visitors"
            onPress={() => router.push('/(tabs)/visitors')}
          />
          <QuickActionButton
            icon="chatbubble-ellipses-outline"
            label="Complaints"
            onPress={() => router.push('/(tabs)/complaints')}
          />
          <QuickActionButton
            icon="alert-circle-outline"
            label="Emergency"
            onPress={() => router.push('/(tabs)/emergency')}
            variant="danger"
          />
        </View>
      </Animated.View>

      {/* System Overview */}
      <Animated.View entering={FadeInUp.delay(600).duration(600)}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>System Overview</Text>
        </View>
        <View style={[styles.systemCard, { backgroundColor: colors.card }]}>
          <View style={styles.systemItem}>
            <View style={styles.systemItemHeader}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={[styles.systemItemLabel, { color: colors.text + '80' }]}>
                Society Status
              </Text>
            </View>
            <Text style={[styles.systemItemValue, { color: colors.text }]}>
              All Systems Operational
            </Text>
          </View>

          <View style={[styles.systemItem, { borderTopWidth: 1, borderTopColor: colors.border }]}>
            <View style={styles.systemItemHeader}>
              <Ionicons name="shield-checkmark" size={20} color="#3b82f6" />
              <Text style={[styles.systemItemLabel, { color: colors.text + '80' }]}>
                Security Level
              </Text>
            </View>
            <Text style={[styles.systemItemValue, { color: colors.text }]}>
              High Security
            </Text>
          </View>

          <View style={[styles.systemItem, { borderTopWidth: 1, borderTopColor: colors.border }]}>
            <View style={styles.systemItemHeader}>
              <Ionicons name="cloud-upload-outline" size={20} color="#8b5cf6" />
              <Text style={[styles.systemItemLabel, { color: colors.text + '80' }]}>
                Last Backup
              </Text>
            </View>
            <Text style={[styles.systemItemValue, { color: colors.text }]}>
              2 hours ago
            </Text>
          </View>

          <View style={[styles.systemItem, { borderTopWidth: 1, borderTopColor: colors.border }]}>
            <View style={styles.systemItemHeader}>
              <Ionicons name="notifications-outline" size={20} color="#f59e0b" />
              <Text style={[styles.systemItemLabel, { color: colors.text + '80' }]}>
                Pending Approvals
              </Text>
            </View>
            <Text style={[styles.systemItemValue, { color: colors.text }]}>
              1 Pending
            </Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );

  if (!user) {
    return (
      <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
        <Header title="Welcome" />
        <View style={styles.container}>
          <View style={[styles.errorCard, { backgroundColor: colors.card }]}>
            <Ionicons name="lock-closed-outline" size={64} color="#f59e0b" />
            <Text style={[styles.errorTitle, { color: colors.text }]}>
              Authentication Required
            </Text>
            <Text style={[styles.errorText, { color: colors.text + '80' }]}>
              Please login to access the dashboard
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      <Header title={getWelcomeMessage()} />
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {getDashboardContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: CARD_PADDING,
    paddingBottom: 32,
  },

  // Modern Stat Cards
  modernStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
    marginBottom: 24,
  },
  modernStatCard: {
    width: CARD_WIDTH,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  modernStatIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modernStatNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  modernStatLabel: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 16,
  },

  // Section Headers
  sectionHeader: {
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },

  // Quick Actions Grid
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
    marginBottom: 24,
  },
  quickActionCard: {
    width: CARD_WIDTH,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickActionLabel: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Activity Card
  activityCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  modernActivityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  modernActivityIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modernActivityContent: {
    flex: 1,
    marginRight: 8,
  },
  modernActivityTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 3,
  },
  modernActivityTime: {
    fontSize: 12,
    fontWeight: '500',
  },

  // System Card
  systemCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  systemItem: {
    padding: 16,
  },
  systemItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  systemItemLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  systemItemValue: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 28,
  },

  // Error State
  errorCard: {
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
