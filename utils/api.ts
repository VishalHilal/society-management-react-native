import { EntryLog, Notification, QRCode, User, Visitor } from '../types';

const API_BASE_URL = 'https://your-api-url.com/api'; // Replace with actual API URL

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: Partial<User>): Promise<{ user: User; token: string }> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // QR Code operations
  async generateQRCode(userId: string): Promise<QRCode> {
    return this.request(`/qr/generate/${userId}`, {
      method: 'POST',
    });
  }

  async validateQRCode(qrData: string): Promise<{ valid: boolean; user?: User; type: string }> {
    return this.request('/qr/validate', {
      method: 'POST',
      body: JSON.stringify({ qrData }),
    });
  }

  // Visitor operations
  async createVisitor(visitorData: Partial<Visitor>): Promise<Visitor> {
    return this.request('/visitors', {
      method: 'POST',
      body: JSON.stringify(visitorData),
    });
  }

  async getVisitors(residentId?: string): Promise<Visitor[]> {
    const query = residentId ? `?residentId=${residentId}` : '';
    return this.request(`/visitors${query}`);
  }

  async updateVisitorStatus(visitorId: string, status: Visitor['status']): Promise<Visitor> {
    return this.request(`/visitors/${visitorId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Entry logs
  async getEntryLogs(): Promise<EntryLog[]> {
    return this.request('/entry-logs');
  }

  async createEntryLog(logData: Partial<EntryLog>): Promise<EntryLog> {
    return this.request('/entry-logs', {
      method: 'POST',
      body: JSON.stringify(logData),
    });
  }

  // Notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    return this.request(`/notifications/${userId}`);
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  }

  // Mock functions for development
  async mockLogin(email: string, password: string): Promise<{ user: User; token: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email,
      phone: '+1234567890',
      role: email.includes('admin') ? 'admin' : email.includes('security') ? 'security' : 'resident',
      flatNumber: email.includes('resident') ? 'A-101' : undefined,
      vehicleNumber: email.includes('resident') ? 'MH-12-AB-1234' : undefined,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    return {
      user: mockUser,
      token: 'mock-jwt-token',
    };
  }
}

export const apiService = new ApiService();
