// App.js
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator'; // Import your AppNavigator

/**
 * Main app content with navigation
 * Wrapped by AuthProvider to access auth state
 */
function AppContent() {
  const { loading, currentUser } = useAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Ghana Promise Guardian</Text>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text style={styles.text}>Loading 2025 & 2026 Promises...</Text>
      </View>
    );
  }

  // Use your AppNavigator which already has all the screens defined
  return <AppNavigator />;
}

/**
 * Root App component
 * Wraps AppContent with AuthProvider to manage auth state globally
 */
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#DC2626', marginBottom: 20 },
  text: { marginTop: 20, fontSize: 16, color: '#065F46' }
});