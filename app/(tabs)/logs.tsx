import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { useAuthStore } from '@/store/authStore';
import { useVisitorStore } from '@/store/visitorStore';
import { EntryLog } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function LogsScreen() {
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const { entryLogs, setEntryLogs } = useVisitorStore();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'entry' | 'exit'>('all');

  useEffect(() => {
    loadEntryLogs();
  }, []);

  const loadEntryLogs = async () => {
    try {
      // In a real app, this would call the API
      // const response = await apiService.getEntryLogs();
      // setEntryLogs(response);
      
      // Mock data for development
      const mockLogs: EntryLog[] = [
        {
          id: '1',
          userId: 'resident1',
          type: 'resident',
          action: 'entry',
          timestamp: new Date().toISOString(),
          guardId: user?.id || '',
          vehicleNumber: 'MH-12-AB-1234',
        },
        {
          id: '2',
          visitorId: 'visitor1',
          type: 'visitor',
          action: 'entry',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          guardId: user?.id || '',
        },
        {
          id: '3',
          visitorId: 'visitor1',
          type: 'visitor',
          action: 'exit',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          guardId: user?.id || '',
        },
        {
          id: '4',
          userId: 'resident2',
          type: 'resident',
          action: 'exit',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          guardId: user?.id || '',
        },
      ];
      setEntryLogs(mockLogs);
    } catch (error) {
      console.error('Failed to load entry logs:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEntryLogs();
    setRefreshing(false);
  };

  const getFilteredLogs = () => {
    if (filter === 'all') return entryLogs;
    return entryLogs.filter(log => log.action === filter);
  };

  const getActionIcon = (action: 'entry' | 'exit') => {
    return action === 'entry' ? 'log-in-outline' : 'log-out-outline';
  };

  const getActionColor = (action: 'entry' | 'exit') => {
    return action === 'entry' ? '#10b981' : '#ef4444';
  };

  const getTypeIcon = (type: 'resident' | 'visitor') => {
    return type === 'resident' ? 'person-outline' : 'people-outline';
  };

  const exportLogs = () => {
    // In a real app, this would generate and download a CSV/PDF file
    Alert.alert('Export Logs', 'Logs exported successfully');
  };

  if (!user || user.role !== 'security') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Card>
          <View style={styles.errorContainer}>
            <Ionicons name="warning-outline" size={48} color="#f59e0b" />
            <Text style={[styles.errorText, { color: colors.text }]}>
              Access Denied
            </Text>
            <Text style={[styles.errorSubtext, { color: colors.text + '80' }]}>
              Only security personnel can view entry logs
            </Text>
          </View>
        </Card>
      </View>
    );
  }

  const filteredLogs = getFilteredLogs();

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Card title="Entry/Exit Logs">
        <View style={styles.filterContainer}>
          <Button
            title="All"
            onPress={() => setFilter('all')}
            variant={filter === 'all' ? 'primary' : 'secondary'}
            size="small"
            style={styles.filterButton}
          />
          <Button
            title="Entries"
            onPress={() => setFilter('entry')}
            variant={filter === 'entry' ? 'primary' : 'secondary'}
            size="small"
            style={styles.filterButton}
          />
          <Button
            title="Exits"
            onPress={() => setFilter('exit')}
            variant={filter === 'exit' ? 'primary' : 'secondary'}
            size="small"
            style={styles.filterButton}
          />
        </View>
        
        <View style={styles.headerActions}>
          <Button
            title="Export Logs"
            onPress={exportLogs}
            variant="secondary"
            size="small"
          />
        </View>
      </Card>

      {filteredLogs.length === 0 ? (
        <Card>
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color={colors.text + '40'} />
            <Text style={[styles.emptyText, { color: colors.text + '60' }]}>
              No logs found
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.text + '40' }]}>
              Entry and exit logs will appear here
            </Text>
          </View>
        </Card>
      ) : (
        filteredLogs.map((log) => (
          <Card key={log.id}>
            <View style={styles.logItem}>
              <View style={styles.logHeader}>
                <View style={styles.actionContainer}>
                  <Ionicons 
                    name={getActionIcon(log.action) as any}
                    size={20} 
                    color={getActionColor(log.action)} 
                  />
                  <Text style={[
                    styles.actionText, 
                    { color: getActionColor(log.action) }
                  ]}>
                    {log.action.toUpperCase()}
                  </Text>
                </View>
                
                <View style={styles.typeContainer}>
                  <Ionicons 
                    name={getTypeIcon(log.type) as any}
                    size={16} 
                    color={colors.primary} 
                  />
                  <Text style={[styles.typeText, { color: colors.text }]}>
                    {log.type}
                  </Text>
                </View>
              </View>
              
              <View style={styles.logDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={16} color={colors.text + '60'} />
                  <Text style={[styles.detailText, { color: colors.text }]}>
                    {new Date(log.timestamp).toLocaleString()}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Ionicons name="shield-outline" size={16} color={colors.text + '60'} />
                  <Text style={[styles.detailText, { color: colors.text }]}>
                    Guard ID: {log.guardId}
                  </Text>
                </View>
                
                {log.vehicleNumber && (
                  <View style={styles.detailRow}>
                    <Ionicons name="car-outline" size={16} color={colors.text + '60'} />
                    <Text style={[styles.detailText, { color: colors.text }]}>
                      Vehicle: {log.vehicleNumber}
                    </Text>
                  </View>
                )}
                
                <View style={styles.detailRow}>
                  <Ionicons name="person-outline" size={16} color={colors.text + '60'} />
                  <Text style={[styles.detailText, { color: colors.text }]}>
                    ID: {log.userId || log.visitorId}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        ))
      )}
      
      <Card title="Summary Statistics">
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#10b981' }]}>
              {entryLogs.filter(l => l.action === 'entry').length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>
              Total Entries
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#ef4444' }]}>
              {entryLogs.filter(l => l.action === 'exit').length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>
              Total Exits
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {entryLogs.filter(l => l.type === 'visitor').length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text }]}>
              Visitor Access
            </Text>
          </View>
        </View>
      </Card>
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
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
  logItem: {
    gap: 12,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typeText: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  logDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
});
