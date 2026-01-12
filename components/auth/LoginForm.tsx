import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { apiService } from '../../utils/api';
import { Button } from '../common/Button';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();
  const { login } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Use mock login for development
      const response = await apiService.mockLogin(email, password);
      
      apiService.setToken(response.token);
      login(response.user, response.token);
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: 'resident' | 'security' | 'admin') => {
    const demoCredentials = {
      resident: { email: 'resident@demo.com', password: 'demo123' },
      security: { email: 'security@demo.com', password: 'demo123' },
      admin: { email: 'admin@demo.com', password: 'demo123' },
    };

    setEmail(demoCredentials[role].email);
    setPassword(demoCredentials[role].password);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Smart Society
      </Text>
      <Text style={[styles.subtitle, { color: colors.text + '80' }]}>
        Entry Management System
      </Text>

      <View style={styles.form}>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: colors.card, 
              borderColor: colors.border,
              color: colors.text 
            }
          ]}
          placeholder="Email"
          placeholderTextColor={colors.text + '60'}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: colors.card, 
              borderColor: colors.border,
              color: colors.text 
            }
          ]}
          placeholder="Password"
          placeholderTextColor={colors.text + '60'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button
          title="Login"
          onPress={handleLogin}
          loading={loading}
          style={styles.loginButton}
        />
      </View>

      <View style={styles.demoSection}>
        <Text style={[styles.demoTitle, { color: colors.text + '80' }]}>
          Demo Accounts:
        </Text>
        <Button
          title="Resident Demo"
          onPress={() => handleDemoLogin('resident')}
          variant="secondary"
          size="small"
          style={styles.demoButton}
        />
        <Button
          title="Security Demo"
          onPress={() => handleDemoLogin('security')}
          variant="secondary"
          size="small"
          style={styles.demoButton}
        />
        <Button
          title="Admin Demo"
          onPress={() => handleDemoLogin('admin')}
          variant="secondary"
          size="small"
          style={styles.demoButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 48,
  },
  form: {
    marginBottom: 32,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  loginButton: {
    marginTop: 8,
  },
  demoSection: {
    marginTop: 32,
  },
  demoTitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  demoButton: {
    marginBottom: 8,
  },
});
