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
  type: 'visitor_request' | 'visitor_arrived' | 'visitor_departed' | 'security_alert';
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
