// src/navigation/AppNavigator.js
import React from 'react';
import { ScrollView, Text, StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import your screens
import DashboardScreen from '../screens/DashboardScreen';
import MapScreen from '../screens/MapScreen';
import ReportScreen from '../screens/ReportScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminSeedingScreen from '../screens/AdminSeedingScreen';
import EconomicDashboardScreen from '../screens/EconomicDashboardScreen';
import PromiseVerificationCard from '../components/PromiseVerificationCard';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Improved PromiseDetailScreen
function PromiseDetailScreen({ route, navigation }) {
  const { promise } = route.params || {};

  if (!promise) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No promise data provided.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>{promise.title}</Text>
        <Text style={styles.description}>{promise.description}</Text>
        
        {/* Status Badge */}
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(promise.status) }]}>
          <Text style={styles.statusText}>{promise.status?.toUpperCase() || 'PENDING'}</Text>
        </View>

        {/* Promise Verification */}
        <PromiseVerificationCard promise={promise} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper function for status colors
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'fulfilled': return '#4CAF50';
    case 'progress': return '#2196F3';
    case 'broken': return '#F44336';
    case 'partial': return '#FF9800';
    default: return '#9E9E9E';
  }
};

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#006B3F',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Promises',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Economy"
        component={EconomicDashboardScreen}
        options={{
          title: 'Economy',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trending-up" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: 'Live Map',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Report"
        component={ReportScreen}
        options={{
          title: 'Report Issue',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="alert-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Admin"
        component={AdminSeedingScreen}
        options={{
          title: 'Admin',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Main App Navigator
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right'
        }}
      >
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="PromiseDetail"
          component={PromiseDetailScreen}
          options={({ route }) => ({
            headerShown: true,
            title: route?.params?.promise?.title || 'Promise Details',
            headerStyle: {
              backgroundColor: '#006B3F',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        />
        <Stack.Screen 
          name="AdminSeeding" 
          component={AdminSeedingScreen}
          options={{ 
            title: 'Admin Database',
            headerShown: true,
            headerStyle: {
              backgroundColor: '#006B3F',
            },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 16,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});