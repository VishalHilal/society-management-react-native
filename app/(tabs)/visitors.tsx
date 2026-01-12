import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { useAuthStore } from '@/store/authStore';
import { useVisitorStore } from '@/store/visitorStore';
import { Visitor } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function VisitorsScreen() {
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const { visitors, setVisitors, loading, setLoading } = useVisitorStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadVisitors();
  }, []);

  const loadVisitors = async () => {
    setLoading(true);
    try {
      // In a real app, this would call the API
      // const response = await apiService.getVisitors(user?.id);
      // setVisitors(response);
      
      // Mock data for development
      const mockVisitors: Visitor[] = [
        {
          id: '1',
          name: 'John Smith',
          phone: '+1234567890',
          purpose: 'Delivery',
          flatNumber: user?.flatNumber || 'A-101',
          residentId: user?.id || '',
          photo: '',
          accompanyingPersons: [],
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          phone: '+0987654321',
          purpose: 'Personal Visit',
          flatNumber: user?.flatNumber || 'A-101',
          residentId: user?.id || '',
          photo: '',
          accompanyingPersons: [
            { name: 'Mike Johnson', age: 25 },
            { name: 'Emma Johnson', age: 22 },
          ],
          status: 'approved',
          checkInTime: new Date().toISOString(),
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ];
      setVisitors(mockVisitors);
    } catch (error) {
      console.error('Failed to load visitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVisitors();
    setRefreshing(false);
  };

  const getStatusColor = (status: Visitor['status']) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'checked_in': return '#3b82f6';
      case 'checked_out': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: Visitor['status']) => {
    switch (status) {
      case 'pending': return 'Pending Approval';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'checked_in': return 'Checked In';
      case 'checked_out': return 'Checked Out';
      default: return 'Unknown';
    }
  };

  const handleApproveVisitor = async (visitorId: string) => {
    try {
      // In a real app, this would call the API
      // await apiService.updateVisitorStatus(visitorId, 'approved');
      
      // Update local state
      const updatedVisitors = visitors.map(v => 
        v.id === visitorId ? { ...v, status: 'approved' as const } : v
      );
      setVisitors(updatedVisitors);
    } catch (error) {
      console.error('Failed to approve visitor:', error);
    }
  };

  const handleRejectVisitor = async (visitorId: string) => {
    try {
      // In a real app, this would call the API
      // await apiService.updateVisitorStatus(visitorId, 'rejected');
      
      // Update local state
      const updatedVisitors = visitors.map(v => 
        v.id === visitorId ? { ...v, status: 'rejected' as const } : v
      );
      setVisitors(updatedVisitors);
    } catch (error) {
      console.error('Failed to reject visitor:', error);
    }
  };

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
              Only residents can manage visitors
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
      <Card title="Visitor Management">
        <View style={styles.headerActions}>
          <Button
            title="Add Pre-Approved Visitor"
            onPress={() => {}}
            style={styles.actionButton}
          />
        </View>
      </Card>

      {visitors.length === 0 ? (
        <Card>
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={colors.text + '40'} />
            <Text style={[styles.emptyText, { color: colors.text + '60' }]}>
              No visitors yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.text + '40' }]}>
              Visitors will appear here when they register
            </Text>
          </View>
        </Card>
      ) : (
        visitors.map((visitor) => (
          <Card key={visitor.id} title={visitor.name} subtitle={visitor.purpose}>
            <View style={styles.visitorInfo}>
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={16} color={colors.primary} />
                <Text style={[styles.infoText, { color: colors.text }]}>
                  {visitor.phone}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="home-outline" size={16} color={colors.primary} />
                <Text style={[styles.infoText, { color: colors.text }]}>
                  Flat {visitor.flatNumber}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={16} color={colors.primary} />
                <Text style={[styles.infoText, { color: colors.text }]}>
                  {new Date(visitor.createdAt).toLocaleString()}
                </Text>
              </View>
              
              {visitor.accompanyingPersons.length > 0 && (
                <View style={styles.infoRow}>
                  <Ionicons name="people-outline" size={16} color={colors.primary} />
                  <Text style={[styles.infoText, { color: colors.text }]}>
                    +{visitor.accompanyingPersons.length} accompanying
                  </Text>
                </View>
              )}
              
              <View style={styles.statusRow}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(visitor.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(visitor.status) }]}>
                    {getStatusText(visitor.status)}
                  </Text>
                </View>
              </View>
              
              {visitor.status === 'pending' && (
                <View style={styles.actionButtons}>
                  <Button
                    title="Approve"
                    onPress={() => handleApproveVisitor(visitor.id)}
                    style={styles.approveButton}
                    size="small"
                  />
                  <Button
                    title="Reject"
                    onPress={() => handleRejectVisitor(visitor.id)}
                    variant="danger"
                    style={styles.rejectButton}
                    size="small"
                  />
                </View>
              )}
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
    marginBottom: 16,
  },
  actionButton: {
    marginVertical: 4,
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
  visitorInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  approveButton: {
    flex: 1,
  },
  rejectButton: {
    flex: 1,
  },
});
