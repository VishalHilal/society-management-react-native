import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Header } from '@/components/common/Header';
import { useAuthStore } from '@/store/authStore';
import { Complaint } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ComplaintsScreen() {
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    category: 'plumbing' as Complaint['category'],
    title: '',
    description: '',
    priority: 'medium' as Complaint['priority'],
  });

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    // Mock data for development
    const mockComplaints: Complaint[] = [
      {
        id: '1',
        residentId: user?.id || '1',
        category: 'plumbing',
        title: 'Water Leakage in Bathroom',
        description: 'There is a water leakage from the bathroom pipe that needs immediate attention.',
        priority: 'high',
        status: 'in_progress',
        assignedTo: 'Maintenance Team',
        estimatedCompletion: '2024-01-20',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '2',
        residentId: '2',
        category: 'electrical',
        title: 'AC Not Working',
        description: 'The air conditioner in the master bedroom is not cooling properly.',
        priority: 'medium',
        status: 'open',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: '3',
        residentId: '3',
        category: 'cleaning',
        title: 'Common Area Cleaning',
        description: 'The corridor on 3rd floor needs cleaning.',
        priority: 'low',
        status: 'resolved',
        resolvedAt: new Date(Date.now() - 259200000).toISOString(),
        createdAt: new Date(Date.now() - 345600000).toISOString(),
      },
    ];
    setComplaints(mockComplaints);
  };

  const getCategoryIcon = (category: Complaint['category']) => {
    switch (category) {
      case 'plumbing': return 'water-outline';
      case 'electrical': return 'flashlight-outline';
      case 'carpentry': return 'hammer-outline';
      case 'cleaning': return 'sparkles-outline';
      case 'security': return 'shield-outline';
      default: return 'help-circle-outline';
    }
  };

  const getCategoryLabel = (category: Complaint['category']) => {
    switch (category) {
      case 'plumbing': return 'Plumbing';
      case 'electrical': return 'Electrical';
      case 'carpentry': return 'Carpentry';
      case 'cleaning': return 'Cleaning';
      case 'security': return 'Security';
      default: return 'Other';
    }
  };

  const getPriorityColor = (priority: Complaint['priority']) => {
    switch (priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: Complaint['status']) => {
    switch (status) {
      case 'open': return '#f59e0b';
      case 'in_progress': return '#3b82f6';
      case 'resolved': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status: Complaint['status']) => {
    switch (status) {
      case 'open': return 'Open';
      case 'in_progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  const handleCreateComplaint = () => {
    if (!newComplaint.title || !newComplaint.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const complaint: Complaint = {
      id: Date.now().toString(),
      residentId: user?.id || '1',
      category: newComplaint.category,
      title: newComplaint.title,
      description: newComplaint.description,
      priority: newComplaint.priority,
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    setComplaints([complaint, ...complaints]);
    setNewComplaint({
      category: 'plumbing',
      title: '',
      description: '',
      priority: 'medium',
    });
    setShowAddForm(false);
    Alert.alert('Success', 'Complaint registered successfully. We will address it soon.');
  };

  const handleUpdateStatus = (complaintId: string, newStatus: Complaint['status']) => {
    if (user?.role !== 'admin' && user?.role !== 'security') {
      Alert.alert('Access Denied', 'Only administrators can update complaint status');
      return;
    }

    setComplaints(complaints.map(c =>
      c.id === complaintId
        ? {
            ...c,
            status: newStatus,
            resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : undefined,
          }
        : c
    ));
    Alert.alert('Success', `Complaint status updated to ${getStatusLabel(newStatus)}`);
  };

  const myComplaints = complaints.filter(c => c.residentId === user?.id);
  const allComplaints = user?.role === 'admin' || user?.role === 'security' ? complaints : myComplaints;

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Complaints" />
        <Card>
          <View style={styles.errorContainer}>
            <Ionicons name="warning-outline" size={48} color="#f59e0b" />
            <Text style={[styles.errorText, { color: colors.text }]}>
              Please login to access complaint system
            </Text>
          </View>
        </Card>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Complaints & Maintenance" />
      <ScrollView style={styles.content}>
        {/* Add Complaint Form */}
        {user.role === 'resident' && (
          <Card>
            <Button
              title="Register New Complaint"
              onPress={() => setShowAddForm(!showAddForm)}
              style={styles.addButton}
            />
            
            {showAddForm && (
              <View style={styles.addForm}>
                <Text style={[styles.formTitle, { color: colors.text }]}>
                  Register New Complaint
                </Text>
                
                <Text style={[styles.formLabel, { color: colors.text }]}>
                  Category
                </Text>
                <View style={styles.categoryButtons}>
                  {(['plumbing', 'electrical', 'carpentry', 'cleaning', 'security', 'other'] as const).map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryButton,
                        {
                          backgroundColor: newComplaint.category === category ? colors.primary : colors.card,
                          borderColor: colors.border,
                        },
                      ]}
                      onPress={() => setNewComplaint({ ...newComplaint, category })}
                    >
                      <Ionicons
                        name={getCategoryIcon(category)}
                        size={20}
                        color={newComplaint.category === category ? '#ffffff' : colors.text}
                      />
                      <Text
                        style={[
                          styles.categoryButtonText,
                          { color: newComplaint.category === category ? '#ffffff' : colors.text },
                        ]}
                      >
                        {getCategoryLabel(category)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.formLabel, { color: colors.text }]}>
                  Priority
                </Text>
                <View style={styles.priorityButtons}>
                  {(['low', 'medium', 'high'] as const).map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        styles.priorityButton,
                        {
                          backgroundColor: getPriorityColor(priority),
                          borderWidth: newComplaint.priority === priority ? 2 : 0,
                          borderColor: colors.text,
                        },
                      ]}
                      onPress={() => setNewComplaint({ ...newComplaint, priority })}
                    >
                      <Text style={styles.priorityButtonText}>
                        {priority.toUpperCase()}
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
                  placeholder="Brief title of the issue"
                  placeholderTextColor={colors.text + '60'}
                  value={newComplaint.title}
                  onChangeText={(value) => setNewComplaint({ ...newComplaint, title: value })}
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
                  placeholder="Detailed description of the issue..."
                  placeholderTextColor={colors.text + '60'}
                  value={newComplaint.description}
                  onChangeText={(value) => setNewComplaint({ ...newComplaint, description: value })}
                  multiline
                  numberOfLines={4}
                />
                
                <View style={styles.formActions}>
                  <Button
                    title="Submit Complaint"
                    onPress={handleCreateComplaint}
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

        {/* Complaint Statistics */}
        {(user.role === 'admin' || user.role === 'security') && (
          <Card title="Complaint Statistics">
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#f59e0b' }]}>
                  {complaints.filter(c => c.status === 'open').length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.text + '60' }]}>
                  Open
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#3b82f6' }]}>
                  {complaints.filter(c => c.status === 'in_progress').length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.text + '60' }]}>
                  In Progress
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#10b981' }]}>
                  {complaints.filter(c => c.status === 'resolved').length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.text + '60' }]}>
                  Resolved
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Complaints List */}
        <Card title={user.role === 'resident' ? 'My Complaints' : 'All Complaints'}>
          {allComplaints.map((complaint) => (
            <View key={complaint.id} style={styles.complaintCard}>
              <View style={styles.complaintHeader}>
                <View style={styles.complaintInfo}>
                  <View style={styles.complaintTitleRow}>
                    <Ionicons
                      name={getCategoryIcon(complaint.category)}
                      size={20}
                      color={colors.primary}
                    />
                    <Text style={[styles.complaintTitle, { color: colors.text }]}>
                      {complaint.title}
                    </Text>
                  </View>
                  <View style={styles.complaintBadges}>
                    <View style={[
                      styles.priorityBadge,
                      { backgroundColor: getPriorityColor(complaint.priority) }
                    ]}>
                      <Text style={styles.badgeText}>
                        {complaint.priority.toUpperCase()}
                      </Text>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(complaint.status) }
                    ]}>
                      <Text style={styles.badgeText}>
                        {getStatusLabel(complaint.status)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              
              <Text style={[styles.complaintDescription, { color: colors.text }]}>
                {complaint.description}
              </Text>
              
              <View style={styles.complaintDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="folder-outline" size={16} color={colors.text + '60'} />
                  <Text style={[styles.detailText, { color: colors.text + '80' }]}>
                    {getCategoryLabel(complaint.category)}
                  </Text>
                </View>
                
                {complaint.assignedTo && (
                  <View style={styles.detailRow}>
                    <Ionicons name="person-outline" size={16} color={colors.text + '60'} />
                    <Text style={[styles.detailText, { color: colors.text + '80' }]}>
                      Assigned to: {complaint.assignedTo}
                    </Text>
                  </View>
                )}
                
                {complaint.estimatedCompletion && (
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={16} color={colors.text + '60'} />
                    <Text style={[styles.detailText, { color: colors.text + '80' }]}>
                      Est. Completion: {new Date(complaint.estimatedCompletion).toLocaleDateString()}
                    </Text>
                  </View>
                )}
              </View>
              
              <View style={styles.complaintFooter}>
                <Text style={[styles.complaintTime, { color: colors.text + '60' }]}>
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </Text>
                
                {(user.role === 'admin' || user.role === 'security') && complaint.status !== 'resolved' && (
                  <View style={styles.actionButtons}>
                    {complaint.status === 'open' && (
                      <Button
                        title="Start Work"
                        onPress={() => handleUpdateStatus(complaint.id, 'in_progress')}
                        size="small"
                        style={styles.actionButton}
                      />
                    )}
                    {complaint.status === 'in_progress' && (
                      <Button
                        title="Resolve"
                        onPress={() => handleUpdateStatus(complaint.id, 'resolved')}
                        size="small"
                        style={styles.actionButton}
                      />
                    )}
                  </View>
                )}
              </View>
            </View>
          ))}
        </Card>

        {complaints.length === 0 && (
          <Card>
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-circle-outline" size={48} color={colors.text + '40'} />
              <Text style={[styles.emptyText, { color: colors.text + '60' }]}>
                No complaints registered
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.text + '40' }]}>
                Everything is working perfectly!
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
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  priorityButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
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
  complaintCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  complaintHeader: {
    marginBottom: 12,
  },
  complaintInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  complaintTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  complaintTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  complaintBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
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
  complaintDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  complaintDetails: {
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
  complaintFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  complaintTime: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  actionButton: {
    minWidth: 80,
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
