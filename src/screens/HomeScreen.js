// src/screens/HomeScreen.js
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function HomeScreen({ navigation, uid }) {
  // -----------------------------------------------------------------
  // LOGOUT HANDLER
  // -----------------------------------------------------------------
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // After signOut, Firebase will automatically update auth.currentUser
      // Your navigation stack should redirect to the Login screen.
      navigation.replace('Login'); // <-- adjust route name if needed
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Logout failed', error.message);
    }
  };

  // -----------------------------------------------------------------
  // QUICK STATS (replace with real data from Firestore later)
  // -----------------------------------------------------------------
  const quickStats = {
    promises: 45,
    fulfilled: 12,
    inProgress: 28,
    reports: 156,
  };

  // -----------------------------------------------------------------
  // REUSABLE QUICK-ACTION CARD
  // -----------------------------------------------------------------
  const QuickActionCard = ({ icon, title, subtitle, color, onPress }) => (
    <TouchableOpacity
      style={[styles.actionCard, { borderLeftColor: color }]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <View style={styles.actionText}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
    </TouchableOpacity>
  );

  // -----------------------------------------------------------------
  // MAIN RENDER
  // -----------------------------------------------------------------
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ==== HERO ==== */}
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>Ghana</Text>
        <Text style={styles.heroTitle}>Ghana Promise Guardian</Text>
        <Text style={styles.heroSubtitle}>
          Hold Leaders Accountable • Build Our Future
        </Text>
      </View>

      {/* ==== FLAG COLORS ==== */}
      <View style={styles.flagColors}>
        <View style={[styles.flagStripe, { backgroundColor: '#DC2626' }]} />
        <View style={[styles.flagStripe, { backgroundColor: '#FCD34D' }]} />
        <View style={[styles.flagStripe, { backgroundColor: '#10B981' }]} />
      </View>

      {/* ==== WELCOME CARD ==== */}
      <View style={styles.welcomeCard}>
        <Text style={styles.greeting}>Welcome, Guardian! Wave</Text>
        <Text style={styles.guardianId}>
          Your Guardian ID:{' '}
          <Text style={styles.bold}>{uid?.slice(0, 12)}...</Text>
        </Text>

        {/* ==== LOGOUT BUTTON (inside welcome card) ==== */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.mission}>
          "Track government promises, report issues, and build community
          accountability. Inspired by Ghana's independence legacy—let's
          safeguard our future together!"
        </Text>
      </View>

      {/* ==== STATISTICS ==== */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>National Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{quickStats.promises}</Text>
            <Text style={styles.statLabel}>Total Promises</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#10B981' }]}>
              {quickStats.fulfilled}
            </Text>
            <Text style={styles.statLabel}>Fulfilled</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#F59E0B' }]}>
              {quickStats.inProgress}
            </Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#DC2626' }]}>
              {quickStats.reports}
            </Text>
            <Text style={styles.statLabel}>Reports Filed</Text>
          </View>
        </View>
      </View>

      {/* ==== QUICK ACTIONS ==== */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <QuickActionCard
          icon="stats-chart"
          title="View Dashboard"
          subtitle="Track all government promises"
          color="#3B82F6"
          onPress={() => navigation.navigate('Dashboard')}
        />

        <QuickActionCard
          icon="map"
          title="Explore Map"
          subtitle="See promise locations across Ghana"
          color="#10B981"
          onPress={() => navigation.navigate('Map')}
        />

        <QuickActionCard
          icon="megaphone"
          title="Report an Issue"
          subtitle="File a promise breach report"
          color="#DC2626"
          onPress={() => navigation.navigate('Report')}
        />

        <QuickActionCard
          icon="person-circle"
          title="My Profile"
          subtitle="View your contributions"
          color="#8B5CF6"
          onPress={() => navigation.navigate('Profile')}
        />
      </View>

      {/* ==== VISION ==== */}
      <View style={styles.visionCard}>
        <Text style={styles.visionTitle}>Our Vision</Text>
        <Text style={styles.visionText}>
          A Ghana where every promise is kept, every voice is heard, and every
          citizen is empowered to hold their leaders accountable. Together, we
          build the nation our founders dreamed of.
        </Text>
      </View>

      {/* ==== FOOTER ==== */}
      <Text style={styles.footer}>
        Powered by Youth • For Ghana's Future Ghana
      </Text>
    </ScrollView>
  );
}

/* ==============================================================
   STYLES
   ============================================================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },

  /* ---- Hero ---- */
  hero: {
    backgroundColor: '#DC2626',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroEmoji: { fontSize: 48, marginBottom: 10 },
  heroTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#FED7AA',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },

  /* ---- Flag ---- */
  flagColors: {
    flexDirection: 'row',
    height: 8,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 4,
    overflow: 'hidden',
  },
  flagStripe: { flex: 1 },

  /* ---- Welcome Card ---- */
  welcomeCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  guardianId: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    textAlign: 'center',
  },
  bold: { fontWeight: 'bold', color: '#DC2626' },

  /* ---- Logout Button ---- */
  logoutButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 16,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  mission: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  /* ---- Stats ---- */
  statsContainer: { marginHorizontal: 20, marginTop: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBox: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: '#DC2626' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 4 },

  /* ---- Quick Actions ---- */
  actionsContainer: { marginHorizontal: 20, marginTop: 24 },
  actionCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionText: { flex: 1 },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  actionSubtitle: { fontSize: 13, color: '#6B7280' },

  /* ---- Vision ---- */
  visionCard: {
    backgroundColor: '#FEF3C7',
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FCD34D',
  },
  visionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
  },
  visionText: { fontSize: 14, color: '#78350F', lineHeight: 20 },

  /* ---- Footer ---- */
  footer: {
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 40,
    color: '#6B7280',
    fontSize: 14,
    fontStyle: 'italic',
  },
});