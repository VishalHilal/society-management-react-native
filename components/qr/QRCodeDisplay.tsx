import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { useAuthStore } from '@/store/authStore';
import { QRGenerator } from '@/utils/qrGenerator';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface QRCodeDisplayProps {
  type?: 'permanent' | 'temporary';
  data?: string;
  title?: string;
  subtitle?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  type = 'permanent',
  data,
  title,
  subtitle,
}) => {
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const [qrData, setQrData] = useState<string>(data || '');
  const [refreshTime, setRefreshTime] = useState<Date>(new Date());

  useEffect(() => {
    if (!data && user) {
      generateQRCode();
    }
  }, [user, type]);

  const generateQRCode = () => {
    if (!user) return;

    let newQrData = '';
    
    if (type === 'permanent' && user.role === 'resident') {
      newQrData = QRGenerator.generatePermanentQR(
        user.id,
        user.flatNumber || '',
        user.vehicleNumber
      );
    } else if (type === 'temporary') {
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      newQrData = QRGenerator.generateTemporaryQR(
        user?.id || '',
        user?.flatNumber || '',
        expiresAt
      );
    }

    setQrData(newQrData);
    setRefreshTime(new Date());
  };

  const getQRTitle = () => {
    if (title) return title;
    
    switch (type) {
      case 'permanent':
        return 'Your Access QR Code';
      case 'temporary':
        return 'Temporary Access QR';
      default:
        return 'QR Code';
    }
  };

  const getQRSubtitle = () => {
    if (subtitle) return subtitle;
    
    switch (type) {
      case 'permanent':
        return 'Scan this at the society gate for quick access';
      case 'temporary':
        return `Valid until: ${refreshTime.toLocaleDateString()}`;
      default:
        return '';
    }
  };

  const qrSize = Dimensions.get('window').width * 0.7;

  return (
    <Card title={getQRTitle()} subtitle={getQRSubtitle()}>
      <View style={styles.qrContainer}>
        {qrData ? (
          <View style={styles.qrWrapper}>
            <QRCode
              value={qrData}
              size={qrSize}
              color={colors.text}
              backgroundColor={colors.background}
            />
            <View style={styles.qrInfo}>
              <View style={styles.infoItem}>
                <Ionicons name="person-outline" size={16} color={colors.primary} />
                <Text style={[styles.infoText, { color: colors.text }]}>
                  {user?.name}
                </Text>
              </View>
              {user?.flatNumber && (
                <View style={styles.infoItem}>
                  <Ionicons name="home-outline" size={16} color={colors.primary} />
                  <Text style={[styles.infoText, { color: colors.text }]}>
                    Flat {user.flatNumber}
                  </Text>
                </View>
              )}
              {user?.vehicleNumber && (
                <View style={styles.infoItem}>
                  <Ionicons name="car-outline" size={16} color={colors.primary} />
                  <Text style={[styles.infoText, { color: colors.text }]}>
                    {user.vehicleNumber}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={[styles.placeholder, { backgroundColor: colors.card }]}>
            <Ionicons name="qr-code-outline" size={80} color={colors.text + '40'} />
            <Text style={[styles.placeholderText, { color: colors.text + '60' }]}>
              Generating QR Code...
            </Text>
          </View>
        )}
      </View>

      {type === 'permanent' && (
        <View style={styles.actions}>
          <Button
            title="Refresh QR Code"
            onPress={generateQRCode}
            variant="secondary"
            size="small"
          />
        </View>
      )}

      <View style={styles.warning}>
        <Ionicons name="warning-outline" size={16} color="#f59e0b" />
        <Text style={[styles.warningText, { color: colors.text + '80' }]}>
          This QR code is for your personal use only. Do not share it with others.
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  qrContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  qrWrapper: {
    alignItems: 'center',
  },
  qrInfo: {
    marginTop: 20,
    width: '100%',
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 16,
  },
  placeholder: {
    width: Dimensions.get('window').width * 0.7,
    height: Dimensions.get('window').width * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 16,
  },
  actions: {
    marginTop: 16,
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
  },
  warningText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
});
