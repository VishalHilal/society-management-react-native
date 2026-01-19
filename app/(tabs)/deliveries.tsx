import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Header } from '@/components/common/Header';
import { useAuthStore } from '@/store/authStore';
import { Delivery } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function DeliveriesScreen() {
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [deliveryPhoto, setDeliveryPhoto] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [newDelivery, setNewDelivery] = useState({
    type: 'package' as Delivery['type'],
    deliveryPerson: '',
    deliveryPersonPhone: '',
    recipientId: user?.id || '1',
    recipientFlat: user?.flatNumber || 'A-101',
    trackingNumber: '',
    description: '',
  });

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    // Mock data for development
    const mockDeliveries: Delivery[] = [
      {
        id: '1',
        type: 'package',
        deliveryPerson: 'Amazon Delivery',
        deliveryPersonPhone: '+91 9876543210',
        recipientId: user?.id || '1',
        recipientFlat: 'A-101',
        status: 'arrived',
        trackingNumber: 'AMZ123456789',
        description: 'Electronics package',
        arrivedAt: new Date(Date.now() - 3600000).toISOString(),
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: '2',
        type: 'food',
        deliveryPerson: 'Zomato Rider',
        deliveryPersonPhone: '+91 9876543211',
        recipientId: '2',
        recipientFlat: 'B-205',
        status: 'delivered',
        description: 'Food order from Pizza Hut',
        arrivedAt: new Date(Date.now() - 1800000).toISOString(),
        deliveredAt: new Date(Date.now() - 900000).toISOString(),
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '3',
        type: 'document',
        deliveryPerson: 'DTDC Courier',
        deliveryPersonPhone: '+91 9876543212',
        recipientId: '3',
        recipientFlat: 'C-302',
        status: 'pending',
        trackingNumber: 'DTDC987654321',
        description: 'Important documents',
        createdAt: new Date(Date.now() - 900000).toISOString(),
      },
    ];
    setDeliveries(mockDeliveries);
  };

  const getDeliveryIcon = (type: Delivery['type']) => {
    switch (type) {
      case 'package': return 'cube-outline';
      case 'food': return 'restaurant-outline';
      case 'document': return 'document-outline';
      default: return 'cube-outline';
    }
  };

  const getDeliveryTypeLabel = (type: Delivery['type']) => {
    switch (type) {
      case 'package': return 'Package';
      case 'food': return 'Food';
      case 'document': return 'Document';
      default: return 'Other';
    }
  };

  const getStatusColor = (status: Delivery['status']) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'arrived': return '#3b82f6';
      case 'delivered': return '#10b981';
      case 'returned': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status: Delivery['status']) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'arrived': return 'Arrived';
      case 'delivered': return 'Delivered';
      case 'returned': return 'Returned';
      default: return 'Unknown';
    }
  };

  const handleCreateDelivery = () => {
    if (!newDelivery.deliveryPerson || !newDelivery.deliveryPersonPhone) {
      Alert.alert('Error', 'Please fill in delivery person details');
      return;
    }

    const delivery: Delivery = {
      id: Date.now().toString(),
      type: newDelivery.type,
      deliveryPerson: newDelivery.deliveryPerson,
      deliveryPersonPhone: newDelivery.deliveryPersonPhone,
      recipientId: newDelivery.recipientId,
      recipientFlat: newDelivery.recipientFlat,
      status: 'pending',
      trackingNumber: newDelivery.trackingNumber,
      description: newDelivery.description,
      createdAt: new Date().toISOString(),
    };

    setDeliveries([delivery, ...deliveries]);
    setNewDelivery({
      type: 'package',
      deliveryPerson: '',
      deliveryPersonPhone: '',
      recipientId: user?.id || '1',
      recipientFlat: user?.flatNumber || 'A-101',
      trackingNumber: '',
      description: '',
    });
    setShowAddForm(false);
    Alert.alert('Success', 'Delivery recorded successfully');
  };

  const handleUpdateStatus = (deliveryId: string, newStatus: Delivery['status']) => {
    if (user?.role !== 'security' && user?.role !== 'admin') {
      Alert.alert('Access Denied', 'Only security personnel can update delivery status');
      return;
    }

    const delivery = deliveries.find(d => d.id === deliveryId);
    if (delivery) {
      setDeliveries(deliveries.map(d =>
        d.id === deliveryId
          ? {
              ...d,
              status: newStatus,
              arrivedAt: newStatus === 'arrived' ? new Date().toISOString() : d.arrivedAt,
              deliveredAt: newStatus === 'delivered' ? new Date().toISOString() : d.deliveredAt,
            }
          : d
      ));
      
      // Send notification to resident
      sendNotification(delivery, newStatus);
      
      Alert.alert('Success', `Delivery status updated to ${getStatusLabel(newStatus)}`);
    }
  };

  const handleCallDeliveryPerson = (phone: string) => {
    Alert.alert(
      'Call Delivery Person',
      `Do you want to call ${phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', style: 'default' },
      ]
    );
  };

  const handleGenerateQR = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setShowQRModal(true);
  };

  const handleCapturePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setDeliveryPhoto(result.assets[0].uri);
        setShowPhotoModal(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture photo');
    }
  };

  const handleSavePhoto = () => {
    if (selectedDelivery && deliveryPhoto) {
      // In a real app, save photo to backend
      Alert.alert('Success', 'Delivery photo saved successfully');
      setShowPhotoModal(false);
      setDeliveryPhoto(null);
    }
  };

  const sendNotification = async (delivery: Delivery, status: Delivery['status']) => {
    // Mock notification sending
    const notificationTitle = status === 'arrived' 
      ? 'Package Arrived!' 
      : status === 'delivered' 
      ? 'Package Delivered!' 
      : 'Delivery Update';

    const notificationBody = status === 'arrived'
      ? `Your ${getDeliveryTypeLabel(delivery.type)} has arrived at the security desk.`
      : status === 'delivered'
      ? `Your ${getDeliveryTypeLabel(delivery.type)} has been delivered to your flat.`
      : `Delivery status updated to ${getStatusLabel(status)}`;

    console.log('Notification:', { title: notificationTitle, body: notificationBody });
  };

  const getDeliveryAnalytics = () => {
    const today = new Date();
    const thisMonth = deliveries.filter(d => 
      new Date(d.createdAt).getMonth() === today.getMonth() &&
      new Date(d.createdAt).getFullYear() === today.getFullYear()
    );

    return {
      totalThisMonth: thisMonth.length,
      deliveredThisMonth: thisMonth.filter(d => d.status === 'delivered').length,
      pendingThisMonth: thisMonth.filter(d => d.status === 'pending').length,
      averageDeliveryTime: '2.5 hours', // Mock calculation
      topDeliveryTypes: {
        package: thisMonth.filter(d => d.type === 'package').length,
        food: thisMonth.filter(d => d.type === 'food').length,
        document: thisMonth.filter(d => d.type === 'document').length,
      }
    };
  };

  const myDeliveries = deliveries.filter(d => d.recipientId === user?.id);
  const allDeliveries = user?.role === 'admin' || user?.role === 'security' ? deliveries : myDeliveries;

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Deliveries" />
        <Card>
          <View style={styles.errorContainer}>
            <Ionicons name="warning-outline" size={48} color="#f59e0b" />
            <Text style={[styles.errorText, { color: colors.text }]}>
              Please login to access delivery management
            </Text>
          </View>
        </Card>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Delivery Management" />
      <ScrollView style={styles.content}>
        {/* Add Delivery Form */}
        {(user.role === 'security' || user.role === 'admin') && (
          <Card>
            <Button
              title="Record New Delivery"
              onPress={() => setShowAddForm(!showAddForm)}
              style={styles.addButton}
            />
            
            {showAddForm && (
              <View style={styles.addForm}>
                <Text style={[styles.formTitle, { color: colors.text }]}>
                  Record New Delivery
                </Text>
                
                <Text style={[styles.formLabel, { color: colors.text }]}>
                  Delivery Type
                </Text>
                <View style={styles.typeButtons}>
                  {(['package', 'food', 'document', 'other'] as const).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeButton,
                        {
                          backgroundColor: newDelivery.type === type ? colors.primary : colors.card,
                          borderColor: colors.border,
                        },
                      ]}
                      onPress={() => setNewDelivery({ ...newDelivery, type })}
                    >
                      <Ionicons
                        name={getDeliveryIcon(type)}
                        size={20}
                        color={newDelivery.type === type ? '#ffffff' : colors.text}
                      />
                      <Text
                        style={[
                          styles.typeButtonText,
                          { color: newDelivery.type === type ? '#ffffff' : colors.text },
                        ]}
                      >
                        {getDeliveryTypeLabel(type)}
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
                  placeholder="Delivery Person Name"
                  placeholderTextColor={colors.text + '60'}
                  value={newDelivery.deliveryPerson}
                  onChangeText={(value) => setNewDelivery({ ...newDelivery, deliveryPerson: value })}
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
                  placeholder="Delivery Person Phone"
                  placeholderTextColor={colors.text + '60'}
                  value={newDelivery.deliveryPersonPhone}
                  onChangeText={(value) => setNewDelivery({ ...newDelivery, deliveryPersonPhone: value })}
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
                  placeholder="Recipient Flat Number"
                  placeholderTextColor={colors.text + '60'}
                  value={newDelivery.recipientFlat}
                  onChangeText={(value) => setNewDelivery({ ...newDelivery, recipientFlat: value })}
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
                  placeholder="Tracking Number (Optional)"
                  placeholderTextColor={colors.text + '60'}
                  value={newDelivery.trackingNumber}
                  onChangeText={(value) => setNewDelivery({ ...newDelivery, trackingNumber: value })}
                />
                
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    { 
                      backgroundColor: colors.card, 
                      borderColor: colors.border,
                      color: colors.text 
                    }
                  ]}
                  placeholder="Description (Optional)"
                  placeholderTextColor={colors.text + '60'}
                  value={newDelivery.description}
                  onChangeText={(value) => setNewDelivery({ ...newDelivery, description: value })}
                  multiline
                  numberOfLines={3}
                />
                
                <View style={styles.formActions}>
                  <Button
                    title="Record Delivery"
                    onPress={handleCreateDelivery}
                    style={styles.submitButton}
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

        {/* Delivery Statistics */}
        {(user.role === 'admin' || user.role === 'security') && (
          <Card>
            <View style={styles.statsHeader}>
              <Text style={[styles.statsTitle, { color: colors.text }]}>
                Delivery Statistics
              </Text>
              <TouchableOpacity
                style={[styles.analyticsButton, { backgroundColor: colors.primary }]}
                onPress={() => setShowAnalytics(true)}
              >
                <Ionicons name="bar-chart-outline" size={16} color="#ffffff" />
                <Text style={styles.analyticsButtonText}>
                  Analytics
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#f59e0b' }]}>
                  {deliveries.filter(d => d.status === 'pending').length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.text + '60' }]}>
                  Pending
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#3b82f6' }]}>
                  {deliveries.filter(d => d.status === 'arrived').length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.text + '60' }]}>
                  Arrived
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#10b981' }]}>
                  {deliveries.filter(d => d.status === 'delivered').length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.text + '60' }]}>
                  Delivered
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#ef4444' }]}>
                  {deliveries.filter(d => d.status === 'returned').length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.text + '60' }]}>
                  Returned
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Deliveries List */}
        <Card title={user.role === 'resident' ? 'My Deliveries' : 'All Deliveries'}>
          {allDeliveries.map((delivery) => (
            <View key={delivery.id} style={styles.deliveryCard}>
              <View style={styles.deliveryHeader}>
                <View style={styles.deliveryInfo}>
                  <View style={styles.deliveryTitleRow}>
                    <Ionicons
                      name={getDeliveryIcon(delivery.type)}
                      size={20}
                      color={colors.primary}
                    />
                    <Text style={[styles.deliveryTitle, { color: colors.text }]}>
                      {getDeliveryTypeLabel(delivery.type)} Delivery
                    </Text>
                  </View>
                  <View style={styles.deliveryBadges}>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(delivery.status) }
                    ]}>
                      <Text style={styles.badgeText}>
                        {getStatusLabel(delivery.status)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              
              {delivery.description && (
                <Text style={[styles.deliveryDescription, { color: colors.text }]}>
                  {delivery.description}
                </Text>
              )}
              
              <View style={styles.deliveryDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="person-outline" size={16} color={colors.text + '60'} />
                  <Text style={[styles.detailText, { color: colors.text + '80' }]}>
                    {delivery.deliveryPerson}
                  </Text>
                  <TouchableOpacity
                    style={styles.callButton}
                    onPress={() => handleCallDeliveryPerson(delivery.deliveryPersonPhone)}
                  >
                    <Ionicons name="call-outline" size={16} color="#10b981" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.detailRow}>
                  <Ionicons name="home-outline" size={16} color={colors.text + '60'} />
                  <Text style={[styles.detailText, { color: colors.text + '80' }]}>
                    {delivery.recipientFlat}
                  </Text>
                </View>
                
                {delivery.trackingNumber && (
                  <View style={styles.detailRow}>
                    <Ionicons name="barcode-outline" size={16} color={colors.text + '60'} />
                    <Text style={[styles.detailText, { color: colors.text + '80' }]}>
                      {delivery.trackingNumber}
                    </Text>
                  </View>
                )}
              </View>
              
              <View style={styles.deliveryFooter}>
                <Text style={[styles.deliveryTime, { color: colors.text + '60' }]}>
                  {new Date(delivery.createdAt).toLocaleDateString()} {new Date(delivery.createdAt).toLocaleTimeString()}
                </Text>
                
                {(user.role === 'admin' || user.role === 'security') && (
                  <View style={styles.actionButtons}>
                    {delivery.status === 'pending' && (
                      <Button
                        title="Mark Arrived"
                        onPress={() => handleUpdateStatus(delivery.id, 'arrived')}
                        size="small"
                        style={styles.actionButton}
                      />
                    )}
                    {delivery.status === 'arrived' && (
                      <Button
                        title="Mark Delivered"
                        onPress={() => handleUpdateStatus(delivery.id, 'delivered')}
                        size="small"
                        style={styles.actionButton}
                      />
                    )}
                    {delivery.status !== 'delivered' && (
                      <Button
                        title="Return"
                        onPress={() => handleUpdateStatus(delivery.id, 'returned')}
                        size="small"
                        variant="secondary"
                        style={styles.actionButton}
                      />
                    )}
                  </View>
                )}
              </View>
            </View>
          ))}
        </Card>

        {allDeliveries.length === 0 && (
          <Card>
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={48} color={colors.text + '40'} />
              <Text style={[styles.emptyText, { color: colors.text + '60' }]}>
                No deliveries found
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.text + '40' }]}>
                {user.role === 'resident' 
                  ? 'Your deliveries will appear here'
                  : 'Record new deliveries using the button above'
                }
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
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  submitButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  analyticsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  analyticsButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  deliveryCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  deliveryHeader: {
    marginBottom: 12,
  },
  deliveryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  deliveryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  deliveryBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  deliveryDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  deliveryDetails: {
    gap: 6,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    flex: 1,
  },
  callButton: {
    padding: 4,
    borderRadius: 4,
  },
  deliveryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliveryTime: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  actionButton: {
    minWidth: 80,
  },
  extraActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  extraActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 4,
  },
  extraActionButtonText: {
    fontSize: 12,
    color: '#6b7280',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  qrCode: {
    marginVertical: 16,
  },
  photoPreview: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginVertical: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  analyticsContainer: {
    padding: 16,
  },
  analyticsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  analyticsGrid: {
    gap: 16,
  },
  analyticsCard: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  analyticsCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  analyticsLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  analyticsValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});
