import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useProfileStore } from '../store/useProfileStore';

// Local Gateway Proxy URL (points to Kong port 8000)
// On Android emulator, localhost translates to 10.0.2.2.
const API_GATEWAY = 'http://10.197.56.226:8000';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const loginSuccess = useProfileStore((state) => state.loginSuccess);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both email and password fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_GATEWAY}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // 1. Sync authentication tokens in Zustand
      loginSuccess(data.token, data.parent.email);

      // 2. Route to Home profiles selector
      navigation.replace('Home');
    } catch (err) {
      Alert.alert('Login Failed', err.message || 'Could not connect to authentication services.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View className="p-6 text-center" style={styles.content}>
        <Text style={styles.title}>शुभानु</Text>
        <Text style={styles.subtitle}>PARENT AUTHENTICATION</Text>

        <TextInput
          placeholder="Parent Email"
          placeholderTextColor="#3E272366"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#3E272366"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Log In & Start Adventure</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Powered by Fastify, Prisma, & AWS EKS Gateway
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '85%',
    alignItems: 'center',
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'normal',
    fontSize: 42,
    fontWeight: '900',
    color: '#3E2723',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: '#FF6B6B',
    letterSpacing: 2,
    fontWeight: '900',
    marginBottom: 36,
  },
  input: {
    width: '100%',
    height: 52,
    backgroundColor: '#FFFDF9',
    borderWidth: 3,
    borderColor: '#3E2723',
    borderRadius: 16,
    paddingHorizontal: 16,
    color: '#3E2723',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 16,
  },
  button: {
    width: '100%',
    height: 54,
    backgroundColor: '#FF6B6B',
    borderWidth: 3,
    borderColor: '#3E2723',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#3E2723',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  buttonText: {
    color: '#3E2723',
    fontSize: 15,
    fontWeight: '900',
  },
  footerText: {
    fontSize: 10,
    color: '#3E2723',
    opacity: 0.6,
    marginTop: 40,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
});
