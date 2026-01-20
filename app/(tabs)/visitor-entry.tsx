import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { useAuthStore } from '@/store/authStore';
import { useVisitorStore } from '@/store/visitorStore';
import { Visitor } from '@/types';
import { NotificationService } from '@/utils/notificationService';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
  const [visitorPhoto, setVisitorPhoto] = useState<string | null>(null);
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

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setVisitorPhoto(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Gallery permission is required to select photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setVisitorPhoto(result.assets[0].uri);
    }
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
        photo: visitorPhoto || '', // Captured photo
        accompanyingPersons: [], // Will be filled based on count
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      // In a real app, this would call the API
      // await apiService.createVisitor(newVisitor);
      addVisitor(newVisitor);

      // Send notification to resident
      NotificationService.sendVisitorNotification(
        'Resident', // In real app, get resident name from flat number
        newVisitor.name,
        'request'
      ).catch(console.error);

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

          <Text style={[styles.label, { color: colors.text }]}>
            Visitor Photo
          </Text>
          <View style={styles.photoSection}>
            {visitorPhoto ? (
              <View style={styles.photoContainer}>
                <Image source={{ uri: visitorPhoto }} style={styles.photo} />
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={() => setVisitorPhoto(null)}
                >
                  <Ionicons name="close-circle" size={24} color="#dc2626" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoButtons}>
                <TouchableOpacity
                  style={[styles.photoButton, { backgroundColor: colors.card }]}
                  onPress={takePhoto}
                >
                  <Ionicons name="camera" size={24} color={colors.primary} />
                  <Text style={[styles.photoButtonText, { color: colors.text }]}>
                    Take Photo
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.photoButton, { backgroundColor: colors.card }]}
                  onPress={pickFromGallery}
                >
                  <Ionicons name="images" size={24} color={colors.primary} />
                  <Text style={[styles.photoButtonText, { color: colors.text }]}>
                    From Gallery
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

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
  photoSection: {
    marginBottom: 16,
  },
  photoContainer: {
    position: 'relative',
    alignSelf: 'center',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  photoButton: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minWidth: 100,
  },
  photoButtonText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
