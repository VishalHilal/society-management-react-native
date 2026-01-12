
export class QRGenerator {
  static generatePermanentQR(userId: string, flatNumber: string, vehicleNumber?: string): string {
    const qrData = {
      type: 'permanent',
      userId,
      flatNumber,
      vehicleNumber,
      timestamp: Date.now(),
      version: '1.0',
    };
    
    return Buffer.from(JSON.stringify(qrData)).toString('base64');
  }

  static generateTemporaryQR(visitorId: string, flatNumber: string, expiresAt: string): string {
    const qrData = {
      type: 'temporary',
      visitorId,
      flatNumber,
      expiresAt,
      timestamp: Date.now(),
      version: '1.0',
    };
    
    return Buffer.from(JSON.stringify(qrData)).toString('base64');
  }

  static parseQRCode(qrData: string): any {
    try {
      const decoded = Buffer.from(qrData, 'base64').toString('utf-8');
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Invalid QR code format:', error);
      return null;
    }
  }

  static validateQRCode(qrData: string): { valid: boolean; reason?: string; data?: any } {
    const parsed = this.parseQRCode(qrData);
    
    if (!parsed) {
      return { valid: false, reason: 'Invalid QR code format' };
    }

    if (!parsed.type || !parsed.timestamp) {
      return { valid: false, reason: 'Missing required fields' };
    }

    if (parsed.type === 'temporary' && parsed.expiresAt) {
      const expiryTime = new Date(parsed.expiresAt).getTime();
      const currentTime = Date.now();
      
      if (currentTime > expiryTime) {
        return { valid: false, reason: 'QR code has expired' };
      }
    }

    return { valid: true, data: parsed };
  }

  static generateVisitorFormQR(visitorId: string): string {
    const formData = {
      type: 'visitor_form',
      visitorId,
      timestamp: Date.now(),
      version: '1.0',
    };
    
    return Buffer.from(JSON.stringify(formData)).toString('base64');
  }
}
