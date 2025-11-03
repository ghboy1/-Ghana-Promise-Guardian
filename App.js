// App.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import Firebase (compat mode)
import { auth } from './src/firebase';

// Import Screens
import HomeScreen from './src/screens/HomeScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import MapScreen from './src/screens/MapScreen';
import ReportScreen from './src/screens/ReportScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ========================================
// MAIN TABS (After Login)
// ========================================
function MainTabs({ uid }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Dashboard') iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          else if (route.name === 'Map') iconName = focused ? 'map' : 'map-outline';
          else if (route.name === 'Report') iconName = focused ? 'megaphone' : 'megaphone-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#DC2626',
        tabBarInactiveTintColor: '#6B7280',
        headerStyle: { backgroundColor: '#DC2626' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      })}
    >
      <Tab.Screen name="Home" options={{ title: 'Guardian' }}>
        {(props) => <HomeScreen {...props} uid={uid} />}
      </Tab.Screen>

      <Tab.Screen name="Dashboard" options={{ title: 'Promises' }}>
        {(props) => <DashboardScreen {...props} uid={uid} />}
      </Tab.Screen>

      <Tab.Screen name="Map" options={{ title: 'Live Map' }}>
        {(props) => <MapScreen {...props} uid={uid} />}
      </Tab.Screen>

      <Tab.Screen name="Report" options={{ title: 'Report Issue' }}>
        {(props) => <ReportScreen {...props} uid={uid} />}
      </Tab.Screen>

      <Tab.Screen name="Profile" options={{ title: 'Profile' }}>
        {(props) => <ProfileScreen {...props} uid={uid} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// ========================================
// MAIN APP COMPONENT
// ========================================
export default function App() {
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔄 Setting up auth listener (compat mode)...');

    // Listen to auth state with compat API
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        if (user) {
          console.log('✅ User logged in:', user.uid);
          setUid(user.uid);
          setLoading(false);
        } else {
          console.log('🔑 No user, signing in anonymously...');
          // Sign in anonymously using compat API
          auth.signInAnonymously()
            .then((userCredential) => {
              console.log('✅ Anonymous login success:', userCredential.user.uid);
              setUid(userCredential.user.uid);
              setLoading(false);
            })
            .catch((err) => {
              console.error('❌ Login failed:', err);
              setError('Login failed: ' + err.message);
              setLoading(false);
            });
        }
      },
      (err) => {
        console.error('❌ Auth listener error:', err);
        setError('Auth error: ' + err.message);
        setLoading(false);
      }
    );

    return () => {
      console.log('🧹 Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  // ========================================
  // LOADING SCREEN
  // ========================================
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingTitle}>Ghana Promise Guardian</Text>
        <ActivityIndicator size="large" color="#DC2626" style={{ marginTop: 20 }} />
        <Text style={styles.loadingText}>Connecting to the network...</Text>
      </View>
    );
  }

  // ========================================
  // ERROR SCREEN
  // ========================================
  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
        <Text style={styles.loadingText}>Please restart the app.</Text>
      </View>
    );
  }

  // ========================================
  // NO USER
  // ========================================
  if (!uid) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>
          Unable to connect. Please restart the app.
        </Text>
      </View>
    );
  }

  // ========================================
  // MAIN APP (Logged In)
  // ========================================
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main">
          {() => <MainTabs uid={uid} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ========================================
// STYLES
// ========================================
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    padding: 20,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#065F46',
    marginTop: 20,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#DC2626',
    textAlign: 'center',
    padding: 20,
  },
});