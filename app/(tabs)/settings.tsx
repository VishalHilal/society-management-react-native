import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { useAuthStore } from '@/store/authStore';
import { SocietySettings } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { user } = useAuthStore();
  
  const [settings, setSettings] = useState<SocietySettings>({
    allowVisitorPhotos: true,
    requireApproval: true,
    autoApproveDelivery: false,
    workingHours: {
      start: '08:00',
      end: '22:00',
    },
  });

  const handleSettingChange = (key: keyof SocietySettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleWorkingHoursChange = (field: 'start' | 'end', value: string) => {
    setSettings(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [field]: value,
      },
    }));
  };

  const saveSettings = async () => {
    try {
      // In a real app, this would call the API
      // await apiService.updateSocietySettings(settings);
      Alert.alert('Success', 'Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const resetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default values?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setSettings({
              allowVisitorPhotos: true,
              requireApproval: true,
              autoApproveDelivery: false,
              workingHours: {
                start: '08:00',
                end: '22:00',
              },
            });
          },
        },
      ]
    );
  };

  if (!user || user.role !== 'admin') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Card>
          <View style={styles.errorContainer}>
            <Ionicons name="warning-outline" size={48} color="#f59e0b" />
            <Text style={[styles.errorText, { color: colors.text }]}>
              Access Denied
            </Text>
            <Text style={[styles.errorSubtext, { color: colors.text + '80' }]}>
              Only administrators can access settings
            </Text>
          </View>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Card title="Visitor Management">
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>
              Require Visitor Photos
            </Text>
            <Text style={[styles.settingDescription, { color: colors.text + '60' }]}>
              Capture photos of all visitors for security
            </Text>
          </View>
          <Switch
            value={settings.allowVisitorPhotos}
            onValueChange={(value) => handleSettingChange('allowVisitorPhotos', value)}
            trackColor={{ false: colors.border, true: colors.primary + '40' }}
            thumbColor={settings.allowVisitorPhotos ? colors.primary : colors.text + '40'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>
              Require Resident Approval
            </Text>
            <Text style={[styles.settingDescription, { color: colors.text + '60' }]}>
              Visitors need approval before entry
            </Text>
          </View>
          <Switch
            value={settings.requireApproval}
            onValueChange={(value) => handleSettingChange('requireApproval', value)}
            trackColor={{ false: colors.border, true: colors.primary + '40' }}
            thumbColor={settings.requireApproval ? colors.primary : colors.text + '40'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>
              Auto-Approve Deliveries
            </Text>
            <Text style={[styles.settingDescription, { color: colors.text + '60' }]}>
              Automatically approve delivery personnel
            </Text>
          </View>
          <Switch
            value={settings.autoApproveDelivery}
            onValueChange={(value) => handleSettingChange('autoApproveDelivery', value)}
            trackColor={{ false: colors.border, true: colors.primary + '40' }}
            thumbColor={settings.autoApproveDelivery ? colors.primary : colors.text + '40'}
          />
        </View>
      </Card>

      <Card title="Working Hours">
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>
              Gate Opening Time
            </Text>
            <Text style={[styles.settingDescription, { color: colors.text + '60' }]}>
              Society gates open at this time
            </Text>
          </View>
          <Text style={[styles.timeText, { color: colors.primary }]}>
            {settings.workingHours.start}
          </Text>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>
              Gate Closing Time
            </Text>
            <Text style={[styles.settingDescription, { color: colors.text + '60' }]}>
              Society gates close at this time
            </Text>
          </View>
          <Text style={[styles.timeText, { color: colors.primary }]}>
            {settings.workingHours.end}
          </Text>
        </View>
      </Card>

      <Card title="Security Settings">
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
            <Text style={[styles.settingTitle, { color: colors.text }]}>
              Security Level
            </Text>
          </View>
          <Text style={[styles.securityLevel, { color: '#10b981' }]}>
            High
          </Text>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="camera-outline" size={20} color={colors.primary} />
            <Text style={[styles.settingTitle, { color: colors.text }]}>
              CCTV Status
            </Text>
          </View>
          <Text style={[styles.statusText, { color: '#10b981' }]}>
            Active
          </Text>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="wifi-outline" size={20} color={colors.primary} />
            <Text style={[styles.settingTitle, { color: colors.text }]}>
              Network Status
            </Text>
          </View>
          <Text style={[styles.statusText, { color: '#10b981' }]}>
            Connected
          </Text>
        </View>
      </Card>

      <Card title="System Actions">
        <View style={styles.actionButtons}>
          <Button
            title="Save Settings"
            onPress={saveSettings}
            style={styles.saveButton}
          />
          <Button
            title="Reset to Default"
            onPress={resetSettings}
            variant="danger"
            style={styles.resetButton}
          />
        </View>
      </Card>

      <Card title="System Information">
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: colors.text + '60' }]}>
            Version
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            1.0.0
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: colors.text + '60' }]}>
            Last Updated
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {new Date().toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: colors.text + '60' }]}>
            Database Status
          </Text>
          <Text style={[styles.infoValue, { color: '#10b981' }]}>
            Healthy
          </Text>
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  timeText: {
    fontSize: 18,
    fontWeight: '600',
  },
  securityLevel: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    gap: 12,
  },
  saveButton: {
    marginVertical: 4,
  },
  resetButton: {
    marginVertical: 4,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});
