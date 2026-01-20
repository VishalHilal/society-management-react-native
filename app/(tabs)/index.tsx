import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Header } from '@/components/common/Header';
import { useAuthStore } from '@/store/authStore';
import { useVisitorStore } from '@/store/visitorStore';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp, SlideInRight } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { colors } = useTheme();
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

  const ResidentDashboard = () => (
    <View>
      {/* Stats Overview */}
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <View style={[styles.statIcon, { backgroundColor: '#3b82f620' }]}>
              <Ionicons name="people-outline" size={24} color="#3b82f6" />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {notifications.filter(n => n.type === 'visitor_arrived').length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text + '60' }]}>
              Today's Visitors
            </Text>
          </View>
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <View style={[styles.statIcon, { backgroundColor: '#10b98120' }]}>
              <Ionicons name="car-outline" size={24} color="#10b981" />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              2
            </Text>
            <Text style={[styles.statLabel, { color: colors.text + '60' }]}>
              My Vehicles
            </Text>
          </View>
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <View style={[styles.statIcon, { backgroundColor: '#f59e0b20' }]}>
              <Ionicons name="notifications-outline" size={24} color="#f59e0b" />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {notifications.filter(n => !n.isRead).length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text + '60' }]}>
              Unread Alerts
            </Text>
          </View>
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <View style={[styles.statIcon, { backgroundColor: '#8b5cf620' }]}>
              <Ionicons name="construct-outline" size={24} color="#8b5cf6" />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              1
            </Text>
            <Text style={[styles.statLabel, { color: colors.text + '60' }]}>
              Pending Issues
            </Text>
          </View>
        </Card>
      </View>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <View style={styles.quickActions}>
          <Button
            title="Add Visitor"
            onPress={() => {}}
            style={styles.quickActionButton}
            icon="person-add-outline"
          />
          <Button
            title="My QR Code"
            onPress={() => {}}
            style={styles.quickActionButton}
            icon="qr-code-outline"
          />
          <Button
            title="Report Issue"
            onPress={() => {}}
            style={styles.quickActionButton}
            icon="warning-outline"
          />
          <Button
            title="Emergency"
            onPress={() => {}}
            variant="danger"
            style={styles.quickActionButton}
            icon="warning-outline"
          />
        </View>
      </Card>

      {/* Recent Activity */}
      <Card title="Recent Activity">
        {recentActivities.slice(0, 3).map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: activity.color + '20' }]}>
              <Ionicons name={activity.icon} size={20} color={activity.color} />
            </View>
            <View style={styles.activityContent}>
              <Text style={[styles.activityTitle, { color: colors.text }]}>
                {activity.title}
              </Text>
              <Text style={[styles.activityTime, { color: colors.text + '60' }]}>
                {activity.time}
              </Text>
            </View>
          </View>
        ))}
      </Card>
    </View>
  );

  const SecurityDashboard = () => (
    <View>
      {/* Security Stats */}
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <View style={[styles.statIcon, { backgroundColor: '#dc262620' }]}>
              <Ionicons name="warning-outline" size={24} color="#dc2626" />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {dashboardStats.activeEmergencies}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text + '60' }]}>
              Active Emergencies
            </Text>
          </View>
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <View style={[styles.statIcon, { backgroundColor: '#3b82f620' }]}>
              <Ionicons name="people-outline" size={24} color="#3b82f6" />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {dashboardStats.todayVisitors}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text + '60' }]}>
              Today's Visitors
            </Text>
          </View>
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <View style={[styles.statIcon, { backgroundColor: '#10b98120' }]}>
              <Ionicons name="car-outline" size={24} color="#10b981" />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {dashboardStats.availableParking}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text + '60' }]}>
              Available Parking
            </Text>
          </View>
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <View style={[styles.statIcon, { backgroundColor: '#f59e0b20' }]}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#f59e0b" />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              98%
            </Text>
            <Text style={[styles.statLabel, { color: colors.text + '60' }]}>
              Security Score
            </Text>
          </View>
        </Card>
      </View>

      {/* Security Actions */}
      <Card title="Security Actions">
        <View style={styles.quickActions}>
          <Button
            title="Scan QR"
            onPress={() => {}}
            style={styles.quickActionButton}
            icon="camera-outline"
          />
          <Button
            title="Visitor Entry"
            onPress={() => {}}
            style={styles.quickActionButton}
            icon="person-add-outline"
          />
          <Button
            title="Emergency Alert"
            onPress={() => {}}
            variant="danger"
            style={styles.quickActionButton}
            icon="warning-outline"
          />
          <Button
            title="View Logs"
            onPress={() => {}}
            style={styles.quickActionButton}
            icon="document-text-outline"
          />
        </View>
      </Card>

      {/* Recent Alerts */}
      <Card title="Recent Alerts">
        {recentActivities.filter(a => a.type === 'emergency' || a.type === 'security').map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={[styles.activityIcon, { backgroundColor: activity.color + '20' }]}>
              <Ionicons name={activity.icon} size={20} color={activity.color} />
            </View>
            <View style={styles.activityContent}>
              <Text style={[styles.activityTitle, { color: colors.text }]}>
                {activity.title}
              </Text>
              <Text style={[styles.activityTime, { color: colors.text + '60' }]}>
                {activity.time}
              </Text>
            </View>
          </View>
        ))}
      </Card>
    </View>
  );

  const AdminDashboard = () => (
    <View>
      {/* Admin Stats */}
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <View style={[styles.statIcon, { backgroundColor: '#3b82f620' }]}>
              <Ionicons name="people-outline" size={24} color="#3b82f6" />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              156
            </Text>
            <Text style={[styles.statLabel, { color: colors.text + '60' }]}>
              Total Residents
            </Text>
          </View>
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <View style={[styles.statIcon, { backgroundColor: '#10b98120' }]}>
              <Ionicons name="cash-outline" size={24} color="#10b981" />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              ₹{dashboardStats.monthlyRevenue.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text + '60' }]}>
              Monthly Revenue
            </Text>
          </View>
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <View style={[styles.statIcon, { backgroundColor: '#f59e0b20' }]}>
              <Ionicons name="construct-outline" size={24} color="#f59e0b" />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {dashboardStats.pendingComplaints}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text + '60' }]}>
              Pending Issues
            </Text>
          </View>
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.statContent}>
            <View style={[styles.statIcon, { backgroundColor: '#8b5cf620' }]}>
              <Ionicons name="car-outline" size={24} color="#8b5cf6" />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>
              {dashboardStats.occupancyRate}%
            </Text>
            <Text style={[styles.statLabel, { color: colors.text + '60' }]}>
              Occupancy Rate
            </Text>
          </View>
        </Card>
      </View>

      {/* Admin Actions */}
      <Card title="Management Actions">
        <View style={styles.quickActions}>
          <Button
            title="Manage Residents"
            onPress={() => {}}
            style={styles.quickActionButton}
            icon="people-outline"
          />
          <Button
            title="View Reports"
            onPress={() => {}}
            style={styles.quickActionButton}
            icon="bar-chart-outline"
          />
          <Button
            title="System Settings"
            onPress={() => {}}
            style={styles.quickActionButton}
            icon="settings-outline"
          />
          <Button
            title="Emergency"
            onPress={() => {}}
            variant="danger"
            style={styles.quickActionButton}
            icon="warning-outline"
          />
        </View>
      </Card>

      {/* System Overview */}
      <Card title="System Overview">
        <View style={styles.overviewGrid}>
          <View style={styles.overviewItem}>
            <Text style={[styles.overviewLabel, { color: colors.text + '60' }]}>
              Society Status
            </Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusIndicator, { backgroundColor: '#10b981' }]} />
              <Text style={[styles.statusText, { color: colors.text }]}>
                All Systems Operational
              </Text>
            </View>
          </View>

          <View style={styles.overviewItem}>
            <Text style={[styles.overviewLabel, { color: colors.text + '60' }]}>
              Security Level
            </Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusIndicator, { backgroundColor: '#3b82f6' }]} />
              <Text style={[styles.statusText, { color: colors.text }]}>
                High Security
              </Text>
            </View>
          </View>

          <View style={styles.overviewItem}>
            <Text style={[styles.overviewLabel, { color: colors.text + '60' }]}>
              Last Backup
            </Text>
            <Text style={[styles.statusText, { color: colors.text }]}>
              2 hours ago
            </Text>
          <Text style={[styles.statusText, { color: colors.text }]}>
            1 Visitor Checked In
          </Text>
        </View>
        <View style={styles.statusItem}>
          <Ionicons name="notifications-outline" size={20} color="#f59e0b" />
          <Text style={[styles.statusText, { color: colors.text }]}>
            1 Pending Approval
          </Text>
        </View>
      </Card>

      <Card title="Recent Visitors">
        <Text style={[styles.noDataText, { color: colors.text + '60' }]}>
          No recent visitors today
        </Text>
      </Card>
    </View>
  );

  const SecurityDashboard = () => (
    <View>
      <Card title="Today's Summary">
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: colors.primary }]}>24</Text>
            <Text style={[styles.summaryLabel, { color: colors.text }]}>Entries</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: colors.primary }]}>18</Text>
            <Text style={[styles.summaryLabel, { color: colors.text }]}>Exits</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: colors.primary }]}>6</Text>
            <Text style={[styles.summaryLabel, { color: colors.text }]}>Visitors</Text>
          </View>
        </View>
      </Card>

      <Card title="Quick Actions">
        <View style={styles.quickActions}>
          <Button
            title="Scan QR Code"
            onPress={() => {}}
            style={styles.actionButton}
          />
          <Button
            title="Register Visitor"
            onPress={() => {}}
            variant="secondary"
            style={styles.actionButton}
          />
        </View>
      </Card>

      <Card title="Recent Activity">
        <Text style={[styles.noDataText, { color: colors.text + '60' }]}>
          No recent activity
        </Text>
      </Card>
    </View>
  );

  const AdminDashboard = () => (
    <View>
      <Card title="Society Overview">
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: colors.primary }]}>120</Text>
            <Text style={[styles.summaryLabel, { color: colors.text }]}>Residents</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: colors.primary }]}>45</Text>
            <Text style={[styles.summaryLabel, { color: colors.text }]}>Today's Visitors</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryNumber, { color: colors.primary }]}>98%</Text>
            <Text style={[styles.summaryLabel, { color: colors.text }]}>Security Score</Text>
          </View>
        </View>
      </Card>

      <Card title="Management Actions">
        <View style={styles.quickActions}>
          <Button
            title="Manage Residents"
            onPress={() => {}}
            style={styles.actionButton}
          />
          <Button
            title="View Reports"
            onPress={() => {}}
            variant="secondary"
            style={styles.actionButton}
          />
        </View>
      </Card>

      <Card title="System Status">
        <View style={styles.statusItem}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#10b981" />
          <Text style={[styles.statusText, { color: colors.text }]}>
            All systems operational
          </Text>
        </View>
        <View style={styles.statusItem}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
          <Text style={[styles.statusText, { color: colors.text }]}>
            Security protocols active
          </Text>
        </View>
      </Card>
    </View>
  );

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      <Header title={getWelcomeMessage()} />
      <ScrollView style={styles.container}>
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
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subText: {
    fontSize: 16,
  },
  quickActions: {
    gap: 12,
  },
  actionButton: {
    marginVertical: 4,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  statusText: {
    fontSize: 16,
    flex: 1,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
});
