export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'resident' | 'security' | 'admin';
  flatNumber?: string;
  vehicleNumber?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Visitor {
  id: string;
  name: string;
  phone: string;
  purpose: string;
  flatNumber: string;
  residentId: string;
  photo?: string;
  accompanyingPersons: AccompanyingPerson[];
  status: 'pending' | 'approved' | 'rejected' | 'checked_in' | 'checked_out';
  checkInTime?: string;
  checkOutTime?: string;
  createdAt: string;
}

export interface AccompanyingPerson {
  name: string;
  age: number;
  photo?: string;
}

export interface QRCode {
  id: string;
  userId: string;
  data: string;
  type: 'permanent' | 'temporary';
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

export interface EntryLog {
  id: string;
  userId?: string;
  visitorId?: string;
  type: 'resident' | 'visitor';
  action: 'entry' | 'exit';
  timestamp: string;
  guardId: string;
  photo?: string;
  vehicleNumber?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'visitor_request' | 'visitor_arrived' | 'visitor_departed' | 'security_alert' | 'emergency' | 'announcement' | 'complaint' | 'delivery';
  isRead: boolean;
  createdAt: string;
}

export interface Society {
  id: string;
  name: string;
  address: string;
  totalFlats: number;
  adminId: string;
  settings: SocietySettings;
}

export interface SocietySettings {
  allowVisitorPhotos: boolean;
  requireApproval: boolean;
  autoApproveDelivery: boolean;
  workingHours: {
    start: string;
    end: string;
  };
}

// New types for additional features

export interface EmergencyAlert {
  id: string;
  type: 'medical' | 'fire' | 'security' | 'natural_disaster' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location?: string;
  reportedBy: string;
  status: 'active' | 'resolved' | 'false_alarm';
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface Vehicle {
  id: string;
  ownerId: string;
  type: 'car' | 'bike' | 'scooter' | 'cycle' | 'other';
  make: string;
  model: string;
  color: string;
  registrationNumber: string;
  parkingSlot?: string;
  isParked: boolean;
  createdAt: string;
}

export interface ParkingSlot {
  id: string;
  slotNumber: string;
  type: 'car' | 'bike' | 'visitor' | 'reserved';
  isOccupied: boolean;
  occupiedBy?: string;
  floor?: string;
  section?: string;
}

export interface Complaint {
  id: string;
  residentId: string;
  category: 'plumbing' | 'electrical' | 'carpentry' | 'cleaning' | 'security' | 'other';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'rejected';
  photos?: string[];
  assignedTo?: string;
  estimatedCompletion?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'maintenance' | 'event' | 'urgent' | 'holiday';
  priority: 'low' | 'medium' | 'high';
  attachments?: string[];
  validFrom: string;
  validUntil?: string;
  createdBy: string;
  createdAt: string;
}

export interface Delivery {
  id: string;
  type: 'package' | 'food' | 'document' | 'other';
  deliveryPerson: string;
  deliveryPersonPhone: string;
  recipientId: string;
  recipientFlat: string;
  status: 'pending' | 'arrived' | 'delivered' | 'returned';
  trackingNumber?: string;
  description?: string;
  arrivedAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface Facility {
  id: string;
  name: string;
  type: 'gym' | 'community_hall' | 'swimming_pool' | 'tennis_court' | 'garden' | 'other';
  description: string;
  capacity: number;
  operatingHours: {
    start: string;
    end: string;
  };
  rules: string[];
  photos?: string[];
  isActive: boolean;
  createdAt: string;
}

export interface FacilityBooking {
  id: string;
  facilityId: string;
  residentId: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  purpose: string;
  participants?: number;
  createdAt: string;
}

export interface Payment {
  id: string;
  residentId: string;
  type: 'maintenance' | 'parking' | 'facility' | 'penalty' | 'other';
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  description: string;
  paidAt?: string;
  paymentMethod?: string;
  createdAt: string;
}

export interface VisitorAnalytics {
  date: string;
  totalVisitors: number;
  uniqueVisitors: number;
  averageDuration: number;
  peakHours: number[];
  purposeBreakdown: Record<string, number>;
}
