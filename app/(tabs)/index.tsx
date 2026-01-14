import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuthStore();

  const getWelcomeMessage = () => {
    if (!user) return 'Welcome!';
    
    switch (user.role) {
      case 'resident':
        return `Welcome, ${user.name}!`;
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
      <Card title="Quick Actions">
        <View style={styles.quickActions}>
          <Button
            title="Add Visitor"
            onPress={() => {}}
            style={styles.actionButton}
          />
          <Button
            title="View QR Code"
            onPress={() => {}}
            variant="secondary"
            style={styles.actionButton}
          />
        </View>
      </Card>

      <Card title="Today's Status">
        <View style={styles.statusItem}>
          <Ionicons name="people-outline" size={20} color={colors.primary} />
          <Text style={[styles.statusText, { color: colors.text }]}>
            2 Visitors Expected
          </Text>
        </View>
        <View style={styles.statusItem}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#10b981" />
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
