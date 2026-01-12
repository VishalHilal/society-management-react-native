import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { useAuthStore } from '@/store/authStore';
import { useVisitorStore } from '@/store/visitorStore';
import { EntryLog } from '@/types';
import { QRGenerator } from '@/utils/qrGenerator';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { Camera, CameraView } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, Vibration, View } from 'react-native';

interface QRScannerProps {
  onScanSuccess?: (data: any) => void;
  onScanError?: (error: string) => void;
  mode?: 'gate' | 'visitor';
}

export const QRScanner: React.FC<QRScannerProps> = ({
  onScanSuccess,
  onScanError,
  mode = 'gate',
}) => {
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const { addEntryLog } = useVisitorStore();
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || loading) return;

    setScanned(true);
    setLoading(true);
    Vibration.vibrate();

    try {
      const validation = QRGenerator.validateQRCode(data);
      
      if (!validation.valid) {
        const errorMsg = validation.reason || 'Invalid QR code';
        Alert.alert('Invalid QR', errorMsg);
        onScanError?.(errorMsg);
        return;
      }

      const qrData = validation.data;
      
      if (mode === 'gate') {
        await handleGateAccess(qrData);
      } else if (mode === 'visitor') {
        await handleVisitorQR(qrData);
      }

      onScanSuccess?.(qrData);
      
    } catch (error) {
      console.error('QR Scan error:', error);
      Alert.alert('Error', 'Failed to process QR code');
      onScanError?.('Failed to process QR code');
    } finally {
      setLoading(false);
      setTimeout(() => setScanned(false), 2000);
    }
  };

  const handleGateAccess = async (qrData: any) => {
    if (!user || user.role !== 'security') {
      Alert.alert('Access Denied', 'Only security personnel can scan gate access QR codes');
      return;
    }

    if (qrData.type === 'permanent') {
      // Handle resident entry
      Alert.alert(
        'Access Granted',
        `Resident ${qrData.userId} authorized for entry`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Open Gate',
            onPress: () => logEntry(qrData, 'resident'),
          },
        ]
      );
    } else if (qrData.type === 'temporary') {
      // Handle visitor entry
      Alert.alert(
        'Visitor Access',
        `Visitor QR detected. Proceed with visitor check-in process.`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Check In Visitor',
            onPress: () => logEntry(qrData, 'visitor'),
          },
        ]
      );
    }
  };

  const handleVisitorQR = async (qrData: any) => {
    if (qrData.type === 'visitor_form') {
      // Navigate to visitor form
      Alert.alert('Visitor Form', 'Opening visitor registration form...');
      // Navigation logic would go here
    }
  };

  const logEntry = async (qrData: any, type: 'resident' | 'visitor') => {
    try {
      const entryLog: EntryLog = {
        id: Date.now().toString(),
        userId: type === 'resident' ? qrData.userId : undefined,
        visitorId: type === 'visitor' ? qrData.visitorId : undefined,
        type,
        action: 'entry',
        timestamp: new Date().toISOString(),
        guardId: user?.id || '',
        vehicleNumber: qrData.vehicleNumber,
      };

      // In a real app, this would call the API
      // await apiService.createEntryLog(entryLog);
      addEntryLog(entryLog);

      Alert.alert('Success', 'Entry logged successfully');
    } catch (error) {
      console.error('Failed to log entry:', error);
      Alert.alert('Error', 'Failed to log entry');
    }
  };

  if (hasPermission === null) {
    return (
      <Card>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={48} color={colors.primary} />
          <Text style={[styles.permissionText, { color: colors.text }]}>
            Requesting camera permission...
          </Text>
        </View>
      </Card>
    );
  }

  if (hasPermission === false) {
    return (
      <Card>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={48} color="#ef4444" />
          <Text style={[styles.permissionText, { color: colors.text }]}>
            Camera access is required to scan QR codes
          </Text>
          <Button
            title="Grant Permission"
            onPress={requestCameraPermission}
            style={styles.permissionButton}
          />
        </View>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      <Card title="QR Scanner" subtitle="Position QR code within the frame">
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          />
          
          <View style={styles.overlay}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
          </View>

          {scanned && (
            <View style={[styles.scanResult, { backgroundColor: colors.background + 'CC' }]}>
              <Ionicons 
                name={loading ? "sync-outline" : "checkmark-circle-outline"} 
                size={48} 
                color={loading ? colors.primary : "#10b981"} 
              />
              <Text style={[styles.scanResultText, { color: colors.text }]}>
                {loading ? 'Processing...' : 'QR Code Scanned!'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.instructions}>
          <Text style={[styles.instructionText, { color: colors.text + '80' }]}>
            {mode === 'gate' 
              ? 'Scan resident or visitor QR codes for gate access'
              : 'Scan QR codes to register visitors'
            }
          </Text>
        </View>

        {scanned && (
          <Button
            title="Scan Again"
            onPress={() => setScanned(false)}
            variant="secondary"
            style={styles.scanAgainButton}
          />
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 60,
    left: 60,
    width: 40,
    height: 40,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#007AFF',
  },
  cornerTopRight: {
    position: 'absolute',
    top: 60,
    right: 60,
    width: 40,
    height: 40,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#007AFF',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 60,
    left: 60,
    width: 40,
    height: 40,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#007AFF',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 60,
    right: 60,
    width: 40,
    height: 40,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#007AFF',
  },
  scanResult: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanResultText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  instructions: {
    marginTop: 16,
    alignItems: 'center',
  },
  instructionText: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  scanAgainButton: {
    marginTop: 16,
  },
  permissionContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 16,
  },
  permissionText: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
  },
  permissionButton: {
    marginTop: 16,
  },
});
