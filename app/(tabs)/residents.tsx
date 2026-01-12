import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { useAuthStore } from '@/store/authStore';
import { User } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function ResidentsScreen() {
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const [residents, setResidents] = useState<User[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newResident, setNewResident] = useState({
    name: '',
    email: '',
    phone: '',
    flatNumber: '',
    vehicleNumber: '',
  });

  useEffect(() => {
    loadResidents();
  }, []);

  const loadResidents = async () => {
    try {
      // In a real app, this would call the API
      // const response = await apiService.getResidents();
      // setResidents(response);
      
      // Mock data for development
      const mockResidents: User[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          role: 'resident',
          flatNumber: 'A-101',
          vehicleNumber: 'MH-12-AB-1234',
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+0987654321',
          role: 'resident',
          flatNumber: 'A-102',
          vehicleNumber: 'MH-12-XY-5678',
          isActive: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          phone: '+1122334455',
          role: 'resident',
          flatNumber: 'B-201',
          vehicleNumber: 'MH-12-ZZ-9999',
          isActive: false,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ];
      setResidents(mockResidents);
    } catch (error) {
      console.error('Failed to load residents:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadResidents();
    setRefreshing(false);
  };

  const filteredResidents = residents.filter(resident =>
    resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resident.flatNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resident.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddResident = async () => {
    if (!newResident.name || !newResident.email || !newResident.phone || !newResident.flatNumber) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const resident: User = {
        id: Date.now().toString(),
        name: newResident.name,
        email: newResident.email,
        phone: newResident.phone,
        role: 'resident',
        flatNumber: newResident.flatNumber,
        vehicleNumber: newResident.vehicleNumber,
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      // In a real app, this would call the API
      // await apiService.createResident(resident);
      setResidents([...residents, resident]);

      // Reset form
      setNewResident({
        name: '',
        email: '',
        phone: '',
        flatNumber: '',
        vehicleNumber: '',
      });
      setShowAddForm(false);

      Alert.alert('Success', 'Resident added successfully');
    } catch (error) {
      console.error('Failed to add resident:', error);
      Alert.alert('Error', 'Failed to add resident');
    }
  };

  const handleToggleStatus = async (residentId: string) => {
    try {
      // In a real app, this would call the API
      // await apiService.updateResidentStatus(residentId, !isActive);
      
      setResidents(residents.map(r =>
        r.id === residentId ? { ...r, isActive: !r.isActive } : r
      ));
      
      Alert.alert('Success', 'Resident status updated');
    } catch (error) {
      console.error('Failed to update resident status:', error);
      Alert.alert('Error', 'Failed to update resident status');
    }
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
              Only administrators can manage residents
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
      <Card title="Residents Management">
        <View style={styles.headerActions}>
          <TextInput
            style={[
              styles.searchInput,
              { 
                backgroundColor: colors.card, 
                borderColor: colors.border,
                color: colors.text 
              }
            ]}
            placeholder="Search residents..."
            placeholderTextColor={colors.text + '60'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Button
            title="Add Resident"
            onPress={() => setShowAddForm(!showAddForm)}
            style={styles.addButton}
          />
        </View>

        {showAddForm && (
          <View style={styles.addForm}>
            <Text style={[styles.formTitle, { color: colors.text }]}>
              Add New Resident
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
              placeholder="Full Name"
              placeholderTextColor={colors.text + '60'}
              value={newResident.name}
              onChangeText={(value) => setNewResident({...newResident, name: value})}
            />
            
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: colors.card, 
                  borderColor: colors.border,
                  color: colors.text 
                }
              ]}
              placeholder="Email"
              placeholderTextColor={colors.text + '60'}
              value={newResident.email}
              onChangeText={(value) => setNewResident({...newResident, email: value})}
              keyboardType="email-address"
            />
            
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: colors.card, 
                  borderColor: colors.border,
                  color: colors.text 
                }
              ]}
              placeholder="Phone Number"
              placeholderTextColor={colors.text + '60'}
              value={newResident.phone}
              onChangeText={(value) => setNewResident({...newResident, phone: value})}
              keyboardType="phone-pad"
            />
            
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: colors.card, 
                  borderColor: colors.border,
                  color: colors.text 
                }
              ]}
              placeholder="Flat Number"
              placeholderTextColor={colors.text + '60'}
              value={newResident.flatNumber}
              onChangeText={(value) => setNewResident({...newResident, flatNumber: value})}
            />
            
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: colors.card, 
                  borderColor: colors.border,
                  color: colors.text 
                }
              ]}
              placeholder="Vehicle Number (Optional)"
              placeholderTextColor={colors.text + '60'}
              value={newResident.vehicleNumber}
              onChangeText={(value) => setNewResident({...newResident, vehicleNumber: value})}
            />
            
            <View style={styles.formActions}>
              <Button
                title="Save"
                onPress={handleAddResident}
                style={styles.saveButton}
              />
              <Button
                title="Cancel"
                onPress={() => setShowAddForm(false)}
                variant="secondary"
                style={styles.cancelButton}
              />
            </View>
          </View>
        )}
      </Card>

      {filteredResidents.length === 0 ? (
        <Card>
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={colors.text + '40'} />
            <Text style={[styles.emptyText, { color: colors.text + '60' }]}>
              No residents found
            </Text>
          </View>
        </Card>
      ) : (
        filteredResidents.map((resident) => (
          <Card key={resident.id}>
            <View style={styles.residentItem}>
              <View style={styles.residentHeader}>
                <View style={styles.residentInfo}>
                  <Text style={[styles.residentName, { color: colors.text }]}>
                    {resident.name}
                  </Text>
                  <Text style={[styles.residentFlat, { color: colors.text + '80' }]}>
                    Flat {resident.flatNumber}
                  </Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: resident.isActive ? '#10b981' : '#ef4444' }
                ]}>
                  <Text style={styles.statusText}>
                    {resident.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.residentDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="mail-outline" size={16} color={colors.primary} />
                  <Text style={[styles.detailText, { color: colors.text }]}>
                    {resident.email}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Ionicons name="call-outline" size={16} color={colors.primary} />
                  <Text style={[styles.detailText, { color: colors.text }]}>
                    {resident.phone}
                  </Text>
                </View>
                
                {resident.vehicleNumber && (
                  <View style={styles.detailRow}>
                    <Ionicons name="car-outline" size={16} color={colors.primary} />
                    <Text style={[styles.detailText, { color: colors.text }]}>
                      {resident.vehicleNumber}
                    </Text>
                  </View>
                )}
              </View>
              
              <View style={styles.residentActions}>
                <Button
                  title={resident.isActive ? 'Deactivate' : 'Activate'}
                  onPress={() => handleToggleStatus(resident.id)}
                  variant={resident.isActive ? 'secondary' : 'primary'}
                  size="small"
                  style={styles.actionButton}
                />
              </View>
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
    gap: 12,
    marginBottom: 16,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  addButton: {
    marginVertical: 4,
  },
  addForm: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    gap: 12,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  formActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  saveButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
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
  residentItem: {
    gap: 12,
  },
  residentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  residentInfo: {
    flex: 1,
  },
  residentName: {
    fontSize: 16,
    fontWeight: '600',
  },
  residentFlat: {
    fontSize: 14,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  residentDetails: {
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
  residentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    minWidth: 100,
  },
});
