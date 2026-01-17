import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Header } from '@/components/common/Header';
import { useAuthStore } from '@/store/authStore';
import { ParkingSlot, Vehicle } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function VehiclesScreen() {
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    type: 'car' as Vehicle['type'],
    make: '',
    model: '',
    color: '',
    registrationNumber: '',
  });

  useEffect(() => {
    loadVehicles();
    loadParkingSlots();
  }, []);

  const loadVehicles = async () => {
    // Mock data for development
    const mockVehicles: Vehicle[] = [
      {
        id: '1',
        ownerId: user?.id || '1',
        type: 'car',
        make: 'Toyota',
        model: 'Camry',
        color: 'Silver',
        registrationNumber: 'MH-12-AB-1234',
        parkingSlot: 'A-101',
        isParked: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        ownerId: '2',
        type: 'bike',
        make: 'Honda',
        model: 'Activa',
        color: 'Black',
        registrationNumber: 'MH-12-XY-5678',
        parkingSlot: 'B-205',
        isParked: true,
        createdAt: new Date().toISOString(),
      },
    ];
    setVehicles(mockVehicles);
  };

  const loadParkingSlots = async () => {
    // Mock data for development
    const mockParkingSlots: ParkingSlot[] = [
      { id: '1', slotNumber: 'A-101', type: 'car', isOccupied: true, occupiedBy: '1', floor: 'A', section: 'Regular' },
      { id: '2', slotNumber: 'A-102', type: 'car', isOccupied: false, floor: 'A', section: 'Regular' },
      { id: '3', slotNumber: 'B-205', type: 'bike', isOccupied: true, occupiedBy: '2', floor: 'B', section: 'Bike' },
      { id: '4', slotNumber: 'V-001', type: 'visitor', isOccupied: false, floor: 'Ground', section: 'Visitor' },
      { id: '5', slotNumber: 'R-001', type: 'reserved', isOccupied: true, occupiedBy: '3', floor: 'A', section: 'Reserved' },
    ];
    setParkingSlots(mockParkingSlots);
  };

  const getVehicleIcon = (type: Vehicle['type']) => {
    switch (type) {
      case 'car': return 'car-outline';
      case 'bike': return 'bicycle-outline';
      case 'scooter': return 'car-outline';
      case 'cycle': return 'bicycle-outline';
      default: return 'car-sport-outline';
    }
  };

  const getVehicleTypeLabel = (type: Vehicle['type']) => {
    switch (type) {
      case 'car': return 'Car';
      case 'bike': return 'Bike';
      case 'scooter': return 'Scooter';
      case 'cycle': return 'Cycle';
      default: return 'Other';
    }
  };

  const getParkingTypeColor = (type: ParkingSlot['type']) => {
    switch (type) {
      case 'car': return '#3b82f6';
      case 'bike': return '#10b981';
      case 'visitor': return '#f59e0b';
      case 'reserved': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const handleAddVehicle = () => {
    if (!newVehicle.make || !newVehicle.model || !newVehicle.registrationNumber) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const vehicle: Vehicle = {
      id: Date.now().toString(),
      ownerId: user?.id || '1',
      type: newVehicle.type,
      make: newVehicle.make,
      model: newVehicle.model,
      color: newVehicle.color,
      registrationNumber: newVehicle.registrationNumber,
      isParked: false,
      createdAt: new Date().toISOString(),
    };

    setVehicles([...vehicles, vehicle]);
    setNewVehicle({
      type: 'car',
      make: '',
      model: '',
      color: '',
      registrationNumber: '',
    });
    setShowAddForm(false);
    Alert.alert('Success', 'Vehicle added successfully');
  };

  const handleToggleParking = (vehicleId: string) => {
    setVehicles(vehicles.map(v =>
      v.id === vehicleId ? { ...v, isParked: !v.isParked } : v
    ));
  };

  const handleAssignParking = (vehicleId: string, slotId: string) => {
    const slot = parkingSlots.find(s => s.id === slotId);
    if (!slot) {
      Alert.alert('Error', 'Parking slot not found');
      return;
    }
    if (slot.isOccupied) {
      Alert.alert('Error', 'This parking slot is already occupied');
      return;
    }

    setVehicles(vehicles.map(v =>
      v.id === vehicleId ? { ...v, parkingSlot: slot.slotNumber } : v
    ));
    setParkingSlots(parkingSlots.map(s =>
      s.id === slotId ? { ...s, isOccupied: true, occupiedBy: vehicleId } : s
    ));
    Alert.alert('Success', `Parking slot ${slot.slotNumber} assigned successfully`);
  };

  const myVehicles = vehicles.filter(v => v.ownerId === user?.id);
  const allVehicles = user?.role === 'admin' || user?.role === 'security' ? vehicles : myVehicles;

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Vehicles" />
        <Card>
          <View style={styles.errorContainer}>
            <Ionicons name="warning-outline" size={48} color="#f59e0b" />
            <Text style={[styles.errorText, { color: colors.text }]}>
              Please login to access vehicle management
            </Text>
          </View>
        </Card>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Vehicle Management" />
      <ScrollView style={styles.content}>
        {/* Add Vehicle Form */}
        {(user.role === 'resident' || user.role === 'admin') && (
          <Card>
            <Button
              title="Add New Vehicle"
              onPress={() => setShowAddForm(!showAddForm)}
              style={styles.addButton}
            />
            
            {showAddForm && (
              <View style={styles.addForm}>
                <Text style={[styles.formTitle, { color: colors.text }]}>
                  Add New Vehicle
                </Text>
                
                <View style={styles.typeButtons}>
                  {(['car', 'bike', 'scooter', 'cycle'] as const).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeButton,
                        {
                          backgroundColor: newVehicle.type === type ? colors.primary : colors.card,
                          borderColor: colors.border,
                        },
                      ]}
                      onPress={() => setNewVehicle({ ...newVehicle, type })}
                    >
                      <Ionicons
                        name={getVehicleIcon(type)}
                        size={20}
                        color={newVehicle.type === type ? '#ffffff' : colors.text}
                      />
                      <Text
                        style={[
                          styles.typeButtonText,
                          { color: newVehicle.type === type ? '#ffffff' : colors.text },
                        ]}
                      >
                        {getVehicleTypeLabel(type)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: colors.card, 
                      borderColor: colors.border,
                      color: colors.text 
                    }
                  ]}
                  placeholder="Make (e.g., Toyota, Honda)"
                  placeholderTextColor={colors.text + '60'}
                  value={newVehicle.make}
                  onChangeText={(value) => setNewVehicle({ ...newVehicle, make: value })}
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
                  placeholder="Model (e.g., Camry, Activa)"
                  placeholderTextColor={colors.text + '60'}
                  value={newVehicle.model}
                  onChangeText={(value) => setNewVehicle({ ...newVehicle, model: value })}
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
                  placeholder="Color (e.g., Silver, Black)"
                  placeholderTextColor={colors.text + '60'}
                  value={newVehicle.color}
                  onChangeText={(value) => setNewVehicle({ ...newVehicle, color: value })}
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
                  placeholder="Registration Number (e.g., MH-12-AB-1234)"
                  placeholderTextColor={colors.text + '60'}
                  value={newVehicle.registrationNumber}
                  onChangeText={(value) => setNewVehicle({ ...newVehicle, registrationNumber: value.toUpperCase() })}
                />
                
                <View style={styles.formActions}>
                  <Button
                    title="Add Vehicle"
                    onPress={handleAddVehicle}
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
        )}

        {/* My Vehicles */}
        {myVehicles.length > 0 && (
          <Card title="My Vehicles">
            {myVehicles.map((vehicle) => (
              <View key={vehicle.id} style={styles.vehicleCard}>
                <View style={styles.vehicleHeader}>
                  <View style={styles.vehicleInfo}>
                    <View style={styles.vehicleTitleRow}>
                      <Ionicons
                        name={getVehicleIcon(vehicle.type)}
                        size={24}
                        color={colors.primary}
                      />
                      <Text style={[styles.vehicleTitle, { color: colors.text }]}>
                        {vehicle.make} {vehicle.model}
                      </Text>
                    </View>
                    <View style={[
                      styles.typeBadge,
                      { backgroundColor: colors.primary + '20' }
                    ]}>
                      <Text style={[styles.typeBadgeText, { color: colors.primary }]}>
                        {getVehicleTypeLabel(vehicle.type)}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.vehicleDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="color-palette-outline" size={16} color={colors.text + '60'} />
                    <Text style={[styles.detailText, { color: colors.text }]}>
                      Color: {vehicle.color || 'Not specified'}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="card-outline" size={16} color={colors.text + '60'} />
                    <Text style={[styles.detailText, { color: colors.text }]}>
                      {vehicle.registrationNumber}
                    </Text>
                  </View>
                  
                  {vehicle.parkingSlot && (
                    <View style={styles.detailRow}>
                      <Ionicons name="locate-outline" size={16} color={colors.text + '60'} />
                      <Text style={[styles.detailText, { color: colors.text }]}>
                        Parking: {vehicle.parkingSlot}
                      </Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.vehicleActions}>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: vehicle.isParked ? '#10b981' : '#f59e0b' }
                  ]}>
                    <Text style={styles.statusText}>
                      {vehicle.isParked ? 'Parked' : 'Not Parked'}
                    </Text>
                  </View>
                  <Button
                    title={vehicle.isParked ? 'Check Out' : 'Check In'}
                    onPress={() => handleToggleParking(vehicle.id)}
                    size="small"
                    variant={vehicle.isParked ? 'secondary' : 'primary'}
                  />
                </View>
              </View>
            ))}
          </Card>
        )}

        {/* Parking Overview */}
        {(user.role === 'admin' || user.role === 'security') && (
          <Card title="Parking Overview">
            <View style={styles.parkingStats}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>
                  {parkingSlots.filter(s => s.isOccupied).length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.text + '60' }]}>
                  Occupied
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#10b981' }]}>
                  {parkingSlots.filter(s => !s.isOccupied).length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.text + '60' }]}>
                  Available
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#f59e0b' }]}>
                  {parkingSlots.filter(s => s.type === 'visitor').filter(s => !s.isOccupied).length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.text + '60' }]}>
                  Visitor
                </Text>
              </View>
            </View>

            <View style={styles.parkingGrid}>
              {parkingSlots.map((slot) => (
                <View key={slot.id} style={[
                  styles.parkingSlot,
                  { 
                    backgroundColor: slot.isOccupied ? colors.card : '#10b98120',
                    borderColor: getParkingTypeColor(slot.type),
                  }
                ]}>
                  <Text style={[
                    styles.slotNumber,
                    { color: slot.isOccupied ? colors.text : '#10b981' }
                  ]}>
                    {slot.slotNumber}
                  </Text>
                  <View style={[
                    styles.slotType,
                    { backgroundColor: getParkingTypeColor(slot.type) }
                  ]}>
                    <Text style={styles.slotTypeText}>
                      {slot.type.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  {slot.isOccupied && (
                    <Ionicons
                      name="car-outline"
                      size={16}
                      color={colors.text + '60'}
                    />
                  )}
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* All Vehicles (Admin/Security) */}
        {(user.role === 'admin' || user.role === 'security') && (
          <Card title="All Vehicles">
            {allVehicles.map((vehicle) => (
              <View key={vehicle.id} style={styles.vehicleCard}>
                <View style={styles.vehicleHeader}>
                  <View style={styles.vehicleInfo}>
                    <View style={styles.vehicleTitleRow}>
                      <Ionicons
                        name={getVehicleIcon(vehicle.type)}
                        size={20}
                        color={colors.primary}
                      />
                      <Text style={[styles.vehicleTitle, { color: colors.text }]}>
                        {vehicle.make} {vehicle.model}
                      </Text>
                    </View>
                    <View style={[
                      styles.typeBadge,
                      { backgroundColor: colors.primary + '20' }
                    ]}>
                      <Text style={[styles.typeBadgeText, { color: colors.primary }]}>
                        {getVehicleTypeLabel(vehicle.type)}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <Text style={[styles.registrationNumber, { color: colors.text + '80' }]}>
                  {vehicle.registrationNumber}
                </Text>
                
                <View style={styles.vehicleActions}>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: vehicle.isParked ? '#10b981' : '#f59e0b' }
                  ]}>
                    <Text style={styles.statusText}>
                      {vehicle.isParked ? 'Parked' : 'Not Parked'}
                    </Text>
                  </View>
                  {vehicle.parkingSlot && (
                    <Text style={[styles.parkingSlotText, { color: colors.text + '60' }]}>
                      Slot: {vehicle.parkingSlot}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </Card>
        )}

        {vehicles.length === 0 && (
          <Card>
            <View style={styles.emptyContainer}>
              <Ionicons name="car-outline" size={48} color={colors.text + '40'} />
              <Text style={[styles.emptyText, { color: colors.text + '60' }]}>
                No vehicles registered
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.text + '40' }]}>
                Add your first vehicle to get started
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
  addButton: {
    marginVertical: 4,
  },
  addForm: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    gap: 12,
    marginTop: 12,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
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
  vehicleCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  vehicleHeader: {
    marginBottom: 12,
  },
  vehicleInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  vehicleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  vehicleDetails: {
    gap: 8,
    marginBottom: 12,
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
  registrationNumber: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  vehicleActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  parkingSlotText: {
    fontSize: 12,
  },
  parkingStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  parkingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  parkingSlot: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  slotNumber: {
    fontSize: 12,
    fontWeight: '600',
  },
  slotType: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotTypeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
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
