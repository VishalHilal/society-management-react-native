import { Card } from '@/components/common/Card';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user } = useAuthStore();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Card title="Profile">
        {!user ? (
          <Text style={[styles.value, { color: colors.text }]}>Not signed in</Text>
        ) : (
          <View style={styles.row}>
            <View style={styles.item}>
              <Text style={[styles.label, { color: colors.text + '70' }]}>Name</Text>
              <Text style={[styles.value, { color: colors.text }]}>{user.name}</Text>
            </View>
            <View style={styles.item}>
              <Text style={[styles.label, { color: colors.text + '70' }]}>Role</Text>
              <Text style={[styles.value, { color: colors.text }]}>{user.role}</Text>
            </View>
          </View>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  row: {
    gap: 12,
  },
  item: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
  },
});


