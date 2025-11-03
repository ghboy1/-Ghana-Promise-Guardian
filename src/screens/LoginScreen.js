// src/screens/LoginScreen.js
//import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from 'firebase/auth';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('email'); // 'email' or 'phone'

  // Email Login
  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in successfully:', userCredential.user);
      Alert.alert('Success', 'Logged in successfully!');
    } catch (error) {
      console.error('Email login error:', error);
      Alert.alert('Login Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Email Signup
  const handleEmailSignup = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password should be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Signed up successfully:', userCredential.user);
      Alert.alert('Success', 'Account created successfully!');
    } catch (error) {
      console.error('Email signup error:', error);
      Alert.alert('Signup Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Phone Login - Send Verification Code
  const handleSendCode = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    // Format phone number for Ghana
    const formattedPhoneNumber = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+233${phoneNumber.replace(/^0/, '')}`;

    setIsLoading(true);
    try {
      // You might need to set up RecaptchaVerifier for web
      // For mobile, Firebase typically handles this automatically
      const confirmation = await signInWithPhoneNumber(auth, formattedPhoneNumber);
      setConfirmationResult(confirmation);
      Alert.alert('Success', 'Verification code sent to your phone');
    } catch (error) {
      console.error('Phone auth error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify Phone Code
  const handleVerifyCode = async () => {
    if (!verificationCode) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    setIsLoading(true);
    try {
      const result = await confirmationResult.confirm(verificationCode);
      console.log('Phone login successful:', result.user);
      Alert.alert('Success', 'Phone verification successful!');
    } catch (error) {
      console.error('Code verification error:', error);
      Alert.alert('Error', 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Ghana Promise Guardian</Text>
      
      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'email' && styles.activeTab]}
          onPress={() => setActiveTab('email')}
        >
          <Text style={[styles.tabText, activeTab === 'email' && styles.activeTabText]}>
            Email Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'phone' && styles.activeTab]}
          onPress={() => setActiveTab('phone')}
        >
          <Text style={[styles.tabText, activeTab === 'phone' && styles.activeTabText]}>
            Phone Login
          </Text>
        </TouchableOpacity>
      </View>

      {/* Email Login Form */}
      {activeTab === 'email' && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleEmailLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login with Email</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton, isLoading && styles.buttonDisabled]}
            onPress={handleEmailSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#0066CC" />
            ) : (
              <Text style={styles.secondaryButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Phone Login Form */}
      {activeTab === 'phone' && (
        <View style={styles.form}>
          <Text style={styles.phoneHint}>
            Enter your Ghana phone number (e.g., 0123456789)
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          
          {!confirmationResult ? (
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSendCode}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send Verification Code</Text>
              )}
            </TouchableOpacity>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter Verification Code"
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="number-pad"
              />
              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleVerifyCode}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Verify Code</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      {/* Test Credentials Hint */}
      <View style={styles.testCredentials}>
        <Text style={styles.testTitle}>For Testing:</Text>
        <Text style={styles.testText}>Email: test@example.com</Text>
        <Text style={styles.testText}>Password: 123456</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 30,
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#0066CC',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0066CC',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0066CC',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#0066CC',
    fontSize: 16,
    fontWeight: 'bold',
  },
  phoneHint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  testCredentials: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  testText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
});

export default LoginScreen;