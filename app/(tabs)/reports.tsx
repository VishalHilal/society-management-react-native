import { Card } from '@/components/common/Card';
import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ReportsScreen() {
  const { colors } = useTheme();
  const { user } = useAuthStore();

  // This is a placeholder screen so the Admin "Reports" tab doesn't point to a missing route.
  // You can extend this later with analytics, exports, charts, etc.
  if (!user || user.role !== 'admin') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Card>
          <View style={styles.center}>
            <Ionicons name="warning-outline" size={48} color="#f59e0b" />
            <Text style={[styles.title, { color: colors.text }]}>Access Denied</Text>
            <Text style={[styles.subtext, { color: colors.text + '80' }]}>
              Only administrators can access reports
            </Text>
          </View>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Card title="Reports">
        <Text style={[styles.subtext, { color: colors.text + '80' }]}>
          Reports dashboard coming soon.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});


