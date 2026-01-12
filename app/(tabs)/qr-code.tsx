import { Card } from '@/components/common/Card';
import { QRCodeDisplay } from '@/components/qr/QRCodeDisplay';
import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function QRCodeScreen() {
  const { colors } = useTheme();
  const { user } = useAuthStore();

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
              Only residents can access QR codes
            </Text>
          </View>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <QRCodeDisplay type="permanent" />

      <Card title="QR Code Information">
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.text }]}>
              This QR code provides fast access to the society gate
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#10b981" />
            <Text style={[styles.infoText, { color: colors.text }]}>
              Your QR code is encrypted and secure
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="refresh-outline" size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.text }]}>
              QR codes are automatically refreshed for security
            </Text>
          </View>
        </View>
      </Card>

      <Card title="Usage Instructions">
        <View style={styles.instructions}>
          <Text style={[styles.instructionText, { color: colors.text }]}>
            1. Show this QR code at the society gate
          </Text>
          <Text style={[styles.instructionText, { color: colors.text }]}>
            2. Security guard will scan your QR code
          </Text>
          <Text style={[styles.instructionText, { color: colors.text }]}>
            3. Gate will open automatically for authorized access
          </Text>
          <Text style={[styles.instructionText, { color: colors.text }]}>
            4. Entry will be logged in the system
          </Text>
        </View>
      </Card>

      <Card title="Emergency Contact">
        <View style={styles.contactItem}>
          <Ionicons name="call-outline" size={20} color={colors.primary} />
          <Text style={[styles.contactText, { color: colors.text }]}>
            Security Office: +91 12345 67890
          </Text>
        </View>
        <View style={styles.contactItem}>
          <Ionicons name="mail-outline" size={20} color={colors.primary} />
          <Text style={[styles.contactText, { color: colors.text }]}>
            support@smartsociety.com
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
  infoSection: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  instructions: {
    gap: 12,
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  contactText: {
    fontSize: 16,
  },
});
