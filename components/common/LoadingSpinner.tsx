import { useTheme } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color,
  message,
}) => {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator 
        size={size} 
        color={color || colors.primary} 
      />
      {message && (
        <Text style={{ 
          marginTop: 10, 
          color: colors.text,
          fontSize: 16 
        }}>
          {message}
        </Text>
      )}
    </View>
  );
};
