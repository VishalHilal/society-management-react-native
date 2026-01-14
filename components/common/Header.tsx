import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showLogoutButton?: boolean;
  onBackPress?: () => void;
  onLogoutPress?: () => void;
  rightComponent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  showLogoutButton = true,
  onBackPress,
  onLogoutPress,
  rightComponent,
}) => {
  const { colors } = useTheme();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    if (onLogoutPress) {
      onLogoutPress();
    } else {
      logout();
    }
  };

  const getUserRoleColor = () => {
    switch (user?.role) {
      case 'resident': return '#10b981';
      case 'security': return '#3b82f6';
      case 'admin': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getUserRoleText = () => {
    switch (user?.role) {
      case 'resident': return 'Resident';
      case 'security': return 'Security';
      case 'admin': return 'Admin';
      default: return 'User';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      <View style={styles.leftSection}>
        {showBackButton && (
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.background }]}
            onPress={onBackPress}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerSection}>
        {title && (
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        )}
        {user && (
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user.name}
            </Text>
            <View style={[styles.roleBadge, { backgroundColor: getUserRoleColor() + '20' }]}>
              <Text style={[styles.roleText, { color: getUserRoleColor() }]}>
                {getUserRoleText()}
              </Text>
            </View>
            {user.flatNumber && (
              <Text style={[styles.flatNumber, { color: colors.text + '80' }]}>
                Flat {user.flatNumber}
              </Text>
            )}
          </View>
        )}
      </View>

      <View style={styles.rightSection}>
        {rightComponent || (
          showLogoutButton && (
            <TouchableOpacity
              style={[styles.logoutButton, { backgroundColor: colors.background }]}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color={colors.text} />
            </TouchableOpacity>
          )
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    minHeight: 60,
  },
  leftSection: {
    width: 50,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    width: 50,
    alignItems: 'flex-end',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 2,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '600',
  },
  flatNumber: {
    fontSize: 12,
    marginTop: 2,
  },
});
