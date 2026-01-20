import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  static async requestPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      throw new Error('Permission not granted for notifications');
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#3b82f6',
      });
    }

    return finalStatus;
  }

  static async getExpoPushToken() {
    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  }

  static async sendLocalNotification(title: string, body: string, data?: any) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
      },
      trigger: null, // Send immediately
    });
  }

  static async sendVisitorNotification(
    residentName: string,
    visitorName: string,
    type: 'request' | 'approved' | 'arrived' | 'departed'
  ) {
    let title = '';
    let body = '';

    switch (type) {
      case 'request':
        title = 'New Visitor Request';
        body = `${visitorName} is requesting to visit you.`;
        break;
      case 'approved':
        title = 'Visitor Approved';
        body = `${visitorName}'s visit has been approved.`;
        break;
      case 'arrived':
        title = 'Visitor Arrived';
        body = `${visitorName} has arrived at the society gate.`;
        break;
      case 'departed':
        title = 'Visitor Departed';
        body = `${visitorName} has left the society.`;
        break;
    }

    await this.sendLocalNotification(title, body, {
      type: 'visitor',
      visitorName,
      notificationType: type,
    });
  }

  static async sendEmergencyNotification(
    type: string,
    location: string,
    severity: 'low' | 'medium' | 'high' | 'critical'
  ) {
    const title = 'Emergency Alert';
    const body = `${severity.toUpperCase()} emergency reported at ${location}`;

    await this.sendLocalNotification(title, body, {
      type: 'emergency',
      emergencyType: type,
      location,
      severity,
    });
  }

  static async sendComplaintNotification(
    title: string,
    category: string,
    priority: 'low' | 'medium' | 'high'
  ) {
    const notificationTitle = 'New Complaint';
    const body = `${priority.toUpperCase()} priority ${category} complaint: ${title}`;

    await this.sendLocalNotification(notificationTitle, body, {
      type: 'complaint',
      complaintTitle: title,
      category,
      priority,
    });
  }

  static async sendDeliveryNotification(packageInfo: string, flatNumber: string) {
    const title = 'Package Delivered';
    const body = `A package has been delivered to ${flatNumber}`;

    await this.sendLocalNotification(title, body, {
      type: 'delivery',
      packageInfo,
      flatNumber,
    });
  }
}