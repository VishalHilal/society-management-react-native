import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { useAuthStore } from '@/store/authStore';
import { useVisitorStore } from '@/store/visitorStore';
import { Visitor } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function VisitorEntryScreen() {
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const { addVisitor } = useVisitorStore();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    purpose: '',
    flatNumber: '',
    vehicleNumber: '',
    accompanyingCount: '0',
  });
  
  const [loading, setLoading] = useState(false);

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
              Only security personnel can register visitors
            </Text>
          </View>
        </Card>
      </View>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter visitor name');
      return false;
    }
    if (!formData.phone.trim()) {
      Alert.alert('Error', 'Please enter phone number');
      return false;
    }
    if (!formData.purpose.trim()) {
      Alert.alert('Error', 'Please enter purpose of visit');
      return false;
    }
    if (!formData.flatNumber.trim()) {
      Alert.alert('Error', 'Please enter flat number');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const newVisitor: Visitor = {
        id: Date.now().toString(),
        name: formData.name,
        phone: formData.phone,
        purpose: formData.purpose,
        flatNumber: formData.flatNumber,
        residentId: '', // Will be determined by flat number lookup
        photo: '', // Will be captured by camera
        accompanyingPersons: [], // Will be filled based on count
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      // In a real app, this would call the API
      // await apiService.createVisitor(newVisitor);
      addVisitor(newVisitor);

      Alert.alert(
        'Success',
        'Visitor registered successfully. Waiting for resident approval.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setFormData({
                name: '',
                phone: '',
                purpose: '',
                flatNumber: '',
                vehicleNumber: '',
                accompanyingCount: '0',
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error('Failed to register visitor:', error);
      Alert.alert('Error', 'Failed to register visitor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Card title="Visitor Registration">
        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.text }]}>
            Visitor Name *
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: colors.card, 
                borderColor: colors.border,
                color: colors.text 
              }
            ]}
            placeholder="Enter visitor's full name"
            placeholderTextColor={colors.text + '60'}
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
          />

          <Text style={[styles.label, { color: colors.text }]}>
            Phone Number *
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: colors.card, 
                borderColor: colors.border,
                color: colors.text 
              }
            ]}
            placeholder="Enter phone number"
            placeholderTextColor={colors.text + '60'}
            value={formData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            keyboardType="phone-pad"
          />

          <Text style={[styles.label, { color: colors.text }]}>
            Purpose of Visit *
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: colors.card, 
                borderColor: colors.border,
                color: colors.text 
              }
            ]}
            placeholder="e.g., Delivery, Personal Visit, Maintenance"
            placeholderTextColor={colors.text + '60'}
            value={formData.purpose}
            onChangeText={(value) => handleInputChange('purpose', value)}
          />

          <Text style={[styles.label, { color: colors.text }]}>
            Flat Number *
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: colors.card, 
                borderColor: colors.border,
                color: colors.text 
              }
            ]}
            placeholder="e.g., A-101, B-205"
            placeholderTextColor={colors.text + '60'}
            value={formData.flatNumber}
            onChangeText={(value) => handleInputChange('flatNumber', value)}
            autoCapitalize="characters"
          />

          <Text style={[styles.label, { color: colors.text }]}>
            Vehicle Number
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: colors.card, 
                borderColor: colors.border,
                color: colors.text 
              }
            ]}
            placeholder="e.g., MH-12-AB-1234"
            placeholderTextColor={colors.text + '60'}
            value={formData.vehicleNumber}
            onChangeText={(value) => handleInputChange('vehicleNumber', value)}
            autoCapitalize="characters"
          />

          <Text style={[styles.label, { color: colors.text }]}>
            Number of Accompanying Persons
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: colors.card, 
                borderColor: colors.border,
                color: colors.text 
              }
            ]}
            placeholder="0"
            placeholderTextColor={colors.text + '60'}
            value={formData.accompanyingCount}
            onChangeText={(value) => handleInputChange('accompanyingCount', value)}
            keyboardType="numeric"
          />

          <Button
            title="Register Visitor"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
        </View>
      </Card>

      <Card title="Quick Actions">
        <View style={styles.quickActions}>
          <Button
            title="Scan Visitor QR"
            onPress={() => {}}
            variant="secondary"
            style={styles.actionButton}
          />
          <Button
            title="Capture Photo"
            onPress={() => {}}
            variant="secondary"
            style={styles.actionButton}
          />
        </View>
      </Card>

      <Card title="Registration Guidelines">
        <View style={styles.guidelines}>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark-circle-outline" size={16} color="#10b981" />
            <Text style={[styles.guidelineText, { color: colors.text }]}>
              Verify visitor's photo ID
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark-circle-outline" size={16} color="#10b981" />
            <Text style={[styles.guidelineText, { color: colors.text }]}>
              Capture clear photo of visitor
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark-circle-outline" size={16} color="#10b981" />
            <Text style={[styles.guidelineText, { color: colors.text }]}>
              Ensure all information is accurate
            </Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark-circle-outline" size={16} color="#10b981" />
            <Text style={[styles.guidelineText, { color: colors.text }]}>
              Wait for resident approval
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
  form: {
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 16,
  },
  quickActions: {
    gap: 12,
  },
  actionButton: {
    marginVertical: 4,
  },
  guidelines: {
    gap: 12,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  guidelineText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
});
