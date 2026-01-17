import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Header } from '@/components/common/Header';
import { useAuthStore } from '@/store/authStore';
import { EmergencyAlert } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EmergencyScreen() {
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>([]);
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [selectedType, setSelectedType] = useState<EmergencyAlert['type']>('medical');
  const [selectedSeverity, setSelectedSeverity] = useState<EmergencyAlert['severity']>('high');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    loadEmergencyAlerts();
  }, []);

  const loadEmergencyAlerts = async () => {
    // Mock data for development
    const mockAlerts: EmergencyAlert[] = [
      {
        id: '1',
        type: 'medical',
        severity: 'critical',
        title: 'Medical Emergency - Block A',
        description: 'Elderly resident needs immediate medical attention in Flat A-302',
        location: 'Block A, Flat A-302',
        reportedBy: 'Security Guard',
        status: 'active',
        createdAt: new Date(Date.now() - 300000).toISOString(),
      },
      {
        id: '2',
        type: 'fire',
        severity: 'high',
        title: 'Fire Alarm - Parking Area',
        description: 'Smoke detected in basement parking area',
        location: 'Basement Parking',
        reportedBy: 'Fire Alarm System',
        status: 'resolved',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        resolvedAt: new Date(Date.now() - 1800000).toISOString(),
        resolvedBy: 'Fire Department',
      },
    ];
    setEmergencyAlerts(mockAlerts);
  };

  const getSeverityColor = (severity: EmergencyAlert['severity']) => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getEmergencyIcon = (type: EmergencyAlert['type']) => {
    switch (type) {
      case 'medical': return 'medical-outline';
      case 'fire': return 'flame-outline';
      case 'security': return 'shield-outline';
      case 'natural_disaster': return 'thunderstorm-outline';
      default: return 'warning-outline';
    }
  };

  const getEmergencyTypeLabel = (type: EmergencyAlert['type']) => {
    switch (type) {
      case 'medical': return 'Medical';
      case 'fire': return 'Fire';
      case 'security': return 'Security';
      case 'natural_disaster': return 'Natural Disaster';
      default: return 'Other';
    }
  };

  const handleCreateAlert = () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please provide a description of the emergency');
      return;
    }

    const newAlert: EmergencyAlert = {
      id: Date.now().toString(),
      type: selectedType,
      severity: selectedSeverity,
      title: `${getEmergencyTypeLabel(selectedType)} Emergency${location ? ` - ${location}` : ''}`,
      description: description.trim(),
      location: location.trim() || undefined,
      reportedBy: user?.name || 'Anonymous',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    setEmergencyAlerts([newAlert, ...emergencyAlerts]);
    setShowAlertForm(false);
    setDescription('');
    setLocation('');
    
    Alert.alert('Emergency Alert Sent', 'Your emergency alert has been sent to all residents and security personnel.');
  };

  const handleResolveAlert = (alertId: string) => {
    Alert.alert(
      'Resolve Alert',
      'Are you sure this emergency has been resolved?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Resolve',
          style: 'default',
          onPress: () => {
            setEmergencyAlerts(emergencyAlerts.map(alert =>
              alert.id === alertId
                ? {
                    ...alert,
                    status: 'resolved',
                    resolvedAt: new Date().toISOString(),
                    resolvedBy: user?.name,
                  }
                : alert
            ));
            Alert.alert('Alert Resolved', 'Emergency alert has been marked as resolved.');
          },
        },
      ]
    );
  };

  const activeAlerts = emergencyAlerts.filter(alert => alert.status === 'active');
  const resolvedAlerts = emergencyAlerts.filter(alert => alert.status === 'resolved');

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Emergency" />
        <Card>
          <View style={styles.errorContainer}>
            <Ionicons name="warning-outline" size={48} color="#f59e0b" />
            <Text style={[styles.errorText, { color: colors.text }]}>
              Please login to access emergency features
            </Text>
          </View>
        </Card>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Emergency Alerts" />
      <ScrollView style={styles.content}>
        {/* Emergency Button */}
        <Card>
          <TouchableOpacity
            style={[styles.emergencyButton, { backgroundColor: '#dc2626' }]}
            onPress={() => setShowAlertForm(true)}
          >
            <Ionicons name="warning-outline" size={48} color="#ffffff" />
            <Text style={styles.emergencyButtonText}>REPORT EMERGENCY</Text>
            <Text style={styles.emergencyButtonSubtext}>
              Tap here to report an emergency
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Alert Form */}
        {showAlertForm && (
          <Card title="Report Emergency">
            <View style={styles.form}>
              <Text style={[styles.formLabel, { color: colors.text }]}>
                Emergency Type
              </Text>
              <View style={styles.typeButtons}>
                {(['medical', 'fire', 'security', 'natural_disaster', 'other'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      {
                        backgroundColor: selectedType === type ? colors.primary : colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                    onPress={() => setSelectedType(type)}
                  >
                    <Ionicons
                      name={getEmergencyIcon(type)}
                      size={20}
                      color={selectedType === type ? '#ffffff' : colors.text}
                    />
                    <Text
                      style={[
                        styles.typeButtonText,
                        { color: selectedType === type ? '#ffffff' : colors.text },
                      ]}
                    >
                      {getEmergencyTypeLabel(type)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.formLabel, { color: colors.text }]}>
                Severity Level
              </Text>
              <View style={styles.severityButtons}>
                {(['low', 'medium', 'high', 'critical'] as const).map((severity) => (
                  <TouchableOpacity
                    key={severity}
                    style={[
                      styles.severityButton,
                      {
                        backgroundColor: getSeverityColor(severity),
                        borderWidth: selectedSeverity === severity ? 2 : 0,
                        borderColor: colors.text,
                      },
                    ]}
                    onPress={() => setSelectedSeverity(severity)}
                  >
                    <Text style={styles.severityButtonText}>
                      {severity.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.formLabel, { color: colors.text }]}>
                Description
              </Text>
              <Text style={styles.inputPlaceholder}>
                Please describe the emergency situation in detail
              </Text>

              <Text style={[styles.formLabel, { color: colors.text }]}>
                Location (Optional)
              </Text>
              <Text style={styles.inputPlaceholder}>
                Flat number, block, or specific location
              </Text>

              <View style={styles.formActions}>
                <Button
                  title="Send Alert"
                  onPress={handleCreateAlert}
                  style={styles.sendButton}
                />
                <Button
                  title="Cancel"
                  onPress={() => setShowAlertForm(false)}
                  variant="secondary"
                  style={styles.cancelButton}
                />
              </View>
            </View>
          </Card>
        )}

        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <Card title="Active Emergencies">
            {activeAlerts.map((alert) => (
              <View key={alert.id} style={[styles.alertCard, { borderColor: getSeverityColor(alert.severity) }]}>
                <View style={styles.alertHeader}>
                  <View style={styles.alertInfo}>
                    <View style={styles.alertTitleRow}>
                      <Ionicons
                        name={getEmergencyIcon(alert.type)}
                        size={24}
                        color={getSeverityColor(alert.severity)}
                      />
                      <Text style={[styles.alertTitle, { color: colors.text }]}>
                        {alert.title}
                      </Text>
                    </View>
                    <View style={[
                      styles.severityBadge,
                      { backgroundColor: getSeverityColor(alert.severity) }
                    ]}>
                      <Text style={styles.severityBadgeText}>
                        {alert.severity.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <Text style={[styles.alertDescription, { color: colors.text }]}>
                  {alert.description}
                </Text>
                
                {alert.location && (
                  <View style={styles.alertLocation}>
                    <Ionicons name="location-outline" size={16} color={colors.primary} />
                    <Text style={[styles.alertLocationText, { color: colors.text }]}>
                      {alert.location}
                    </Text>
                  </View>
                )}
                
                <View style={styles.alertFooter}>
                  <Text style={[styles.alertTime, { color: colors.text + '80' }]}>
                    Reported by {alert.reportedBy} • {new Date(alert.createdAt).toLocaleTimeString()}
                  </Text>
                  {(user?.role === 'admin' || user?.role === 'security') && (
                    <Button
                      title="Resolve"
                      onPress={() => handleResolveAlert(alert.id)}
                      size="small"
                      style={styles.resolveButton}
                    />
                  )}
                </View>
              </View>
            ))}
          </Card>
        )}

        {/* Resolved Alerts */}
        {resolvedAlerts.length > 0 && (
          <Card title="Resolved Emergencies">
            {resolvedAlerts.map((alert) => (
              <View key={alert.id} style={[styles.alertCard, styles.resolvedAlert, { borderColor: colors.border }]}>
                <View style={styles.alertHeader}>
                  <View style={styles.alertInfo}>
                    <View style={styles.alertTitleRow}>
                      <Ionicons
                        name={getEmergencyIcon(alert.type)}
                        size={20}
                        color={colors.text + '60'}
                      />
                      <Text style={[styles.alertTitle, { color: colors.text + '80' }]}>
                        {alert.title}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: '#10b981' }]}>
                      <Text style={styles.statusText}>RESOLVED</Text>
                    </View>
                  </View>
                </View>
                
                <Text style={[styles.alertDescription, { color: colors.text + '60' }]}>
                  {alert.description}
                </Text>
                
                <View style={styles.alertFooter}>
                  <Text style={[styles.alertTime, { color: colors.text + '60' }]}>
                    Resolved by {alert.resolvedBy} • {new Date(alert.resolvedAt!).toLocaleString()}
                  </Text>
                </View>
              </View>
            ))}
          </Card>
        )}

        {emergencyAlerts.length === 0 && (
          <Card>
            <View style={styles.emptyContainer}>
              <Ionicons name="shield-checkmark-outline" size={48} color={colors.text + '40'} />
              <Text style={[styles.emptyText, { color: colors.text + '60' }]}>
                No emergency alerts at this time
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.text + '40' }]}>
                Stay safe and report any emergencies immediately
              </Text>
            </View>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emergencyButton: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
  },
  emergencyButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emergencyButtonSubtext: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.9,
  },
  form: {
    gap: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  severityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  severityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  severityButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  inputPlaceholder: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  formActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  sendButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
  },
  alertCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: '#ffffff',
  },
  resolvedAlert: {
    opacity: 0.7,
    borderWidth: 1,
  },
  alertHeader: {
    marginBottom: 12,
  },
  alertInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  alertTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  alertDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  alertLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  alertLocationText: {
    fontSize: 14,
    flex: 1,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertTime: {
    fontSize: 12,
    flex: 1,
  },
  resolveButton: {
    minWidth: 80,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});
