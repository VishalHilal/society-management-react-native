import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { QRScanner } from '@/components/qr/QRScanner';
import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function QRScannerScreen() {
  const { colors } = useTheme();
  const { user } = useAuthStore();

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
              Only security personnel can access QR scanner
            </Text>
          </View>
        </Card>
      </View>
    );
  }

  const handleScanSuccess = (data: any) => {
    console.log('QR Scan successful:', data);
  };

  const handleScanError = (error: string) => {
    console.error('QR Scan error:', error);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <QRScanner 
        mode="gate"
        onScanSuccess={handleScanSuccess}
        onScanError={handleScanError}
      />

      <Card title="Scanner Instructions">
        <View style={styles.instructions}>
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#10b981" />
            <Text style={[styles.instructionText, { color: colors.text }]}>
              Position QR code within the frame
            </Text>
          </View>
          
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#10b981" />
            <Text style={[styles.instructionText, { color: colors.text }]}>
              Hold steady until scan is complete
            </Text>
          </View>
          
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#10b981" />
            <Text style={[styles.instructionText, { color: colors.text }]}>
              Verify visitor details before allowing entry
            </Text>
          </View>
          
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#10b981" />
            <Text style={[styles.instructionText, { color: colors.text }]}>
              Log all entries in the system
            </Text>
          </View>
        </View>
      </Card>

      <Card title="Quick Actions">
        <View style={styles.quickActions}>
          <Button
            title="Manual Entry"
            onPress={() => {}}
            variant="secondary"
            style={styles.actionButton}
          />
          <Button
            title="View Recent Logs"
            onPress={() => {}}
            variant="secondary"
            style={styles.actionButton}
          />
        </View>
      </Card>

      <Card title="Security Protocols">
        <View style={styles.protocolItem}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
          <Text style={[styles.protocolText, { color: colors.text }]}>
            Always verify photo ID for visitors
          </Text>
        </View>
        <View style={styles.protocolItem}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
          <Text style={[styles.protocolText, { color: colors.text }]}>
            Check vehicle number for residents
          </Text>
        </View>
        <View style={styles.protocolItem}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
          <Text style={[styles.protocolText, { color: colors.text }]}>
            Report suspicious activity immediately
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
  instructions: {
    gap: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  instructionText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  quickActions: {
    gap: 12,
  },
  actionButton: {
    marginVertical: 4,
  },
  protocolItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 8,
  },
  protocolText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
});
