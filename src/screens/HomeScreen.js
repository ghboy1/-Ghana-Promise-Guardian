// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../firebase';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation, uid }) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // -----------------------------------------------------------------
  // LOGOUT HANDLER
  // -----------------------------------------------------------------
  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await auth.signOut();
              Alert.alert('Success', 'You have been logged out successfully');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  // -----------------------------------------------------------------
  // QUICK STATS (replace with real data from Firestore later)
  // -----------------------------------------------------------------
  const quickStats = {
    promises: 45,
    fulfilled: 12,
    inProgress: 28,
    reports: 156,
    fulfillmentRate: 27, // percentage
    activeUsers: '12.5K',
  };

  // -----------------------------------------------------------------
  // REUSABLE QUICK-ACTION CARD
  // -----------------------------------------------------------------
  const QuickActionCard = ({ icon, title, subtitle, color, onPress, badge }) => (
    <TouchableOpacity
      style={styles.actionCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.actionIconContainer, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={32} color={color} />
        {badge && (
          <View style={[styles.badge, { backgroundColor: color }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={24} color="#9CA3AF" />
    </TouchableOpacity>
  );

  // -----------------------------------------------------------------
  // NEWS/UPDATES CARD
  // -----------------------------------------------------------------
  const NewsCard = ({ title, date, type }) => (
    <View style={styles.newsCard}>
      <View style={[styles.newsIndicator, { backgroundColor: type === 'promise' ? '#10B981' : '#F59E0B' }]} />
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle}>{title}</Text>
        <Text style={styles.newsDate}>{date}</Text>
      </View>
      <Ionicons name="arrow-forward" size={20} color="#6B7280" />
    </View>
  );

  // -----------------------------------------------------------------
  // MAIN RENDER
  // -----------------------------------------------------------------
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ==== GHANA FLAG HEADER WITH ANIMATED GRADIENT ==== */}
      <View style={styles.flagHeader}>
        {/* Red Stripe */}
        
        
        {/* Yellow Stripe with Black Star */}
        <View style={[styles.flagStripe, { backgroundColor: '#FCD116' }]}>
          <View style={styles.blackStarContainer}>
            <Ionicons name="star" size={30} color="#000000" />
          </View>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <Text style={styles.mainTitle}>Ghana Promise Guardian</Text>
            <Text style={styles.mainSubtitle}>Accountability • Transparency • Progress</Text>
          </Animated.View>
        </View>
        
        {/* Green Stripe */}
        <View style={[styles.flagStripe, { backgroundColor: '#016239ff' }]} />
      </View>

      {/* ==== WELCOME SECTION ==== */}
      <View style={styles.welcomeSection}>
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeHeader}>
            <View>
              <Text style={styles.welcomeGreeting}>Welcome Back, Guardian! 👋</Text>
              <Text style={styles.guardianId}>ID: {uid?.slice(0, 8)}...{uid?.slice(-4)}</Text>
            </View>
            <TouchableOpacity 
              style={styles.logoutIcon}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={24} color="#ffffffff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.impactCard}>
            <Ionicons name="trending-up" size={34} color="#0fbd83ff" />
            <View style={styles.impactText}>
              <Text style={styles.impactTitle}>Your Impact</Text>
              <Text style={styles.impactDesc}>You're helping build Ghana's future</Text>
            </View>
          </View>
        </View>

        {/* Mission Statement */}
        <View style={styles.missionCard}>
          <Ionicons name="shield-checkmark" size={34} color="#2563EB" />
          <Text style={styles.missionText}>
            Track promises, report issues, and hold leaders accountable. Together, we safeguard Ghana's progress!
          </Text>
        </View>
      </View>

      {/* ==== LIVE STATISTICS DASHBOARD ==== */}
      <View style={styles.statsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📊 Live Statistics</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All →</Text>
          </TouchableOpacity>
        </View>

        {/* Main Stats Grid */}
        <View style={styles.statsGrid}>
          <TouchableOpacity 
            style={[styles.statCard, styles.statCardLarge]}
            onPress={() => navigation.navigate('Dashboard')}
          >
            <View style={styles.statIconLarge}>
              <Ionicons name="document-text" size={42} color="#2563EB" />
            </View>
            <Text style={styles.statNumberLarge}>{quickStats.promises}</Text>
            <Text style={styles.statLabel}>Total Promises</Text>
            <View style={styles.statBadge}>
              <Text style={styles.statBadgeText}>National</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.statColumn}>
            <TouchableOpacity style={[styles.statCard, styles.statCardSmall, { borderLeftColor: '#10B981' }]}>
              <Text style={[styles.statNumber, { color: '#10B981' }]}>{quickStats.fulfilled}</Text>
              <Text style={styles.statLabelSmall}>Fulfilled ✓</Text>
              <Text style={styles.statPercent}>{quickStats.fulfillmentRate}%</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.statCard, styles.statCardSmall, { borderLeftColor: '#F59E0B' }]}>
              <Text style={[styles.statNumber, { color: '#F59E0B' }]}>{quickStats.inProgress}</Text>
              <Text style={styles.statLabelSmall}>In Progress ⏳</Text>
              <Text style={styles.statPercent}>62%</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Secondary Stats */}
        <View style={styles.secondaryStats}>
          <View style={styles.secondaryStatCard}>
            <Ionicons name="megaphone" size={34} color="#DC2626" />
            <View style={styles.secondaryStatText}>
              <Text style={styles.secondaryStatNumber}>{quickStats.reports}</Text>
              <Text style={styles.secondaryStatLabel}>Reports Filed</Text>
            </View>
          </View>

          <View style={styles.secondaryStatCard}>
            <Ionicons name="people" size={34} color="#0ecd74ff" />
            <View style={styles.secondaryStatText}>
              <Text style={styles.secondaryStatNumber}>{quickStats.activeUsers}</Text>
              <Text style={styles.secondaryStatLabel}>Active Guardians</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ==== QUICK ACTIONS GRID ==== */}
      <View style={styles.actionsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
        </View>

        <QuickActionCard
          icon="stats-chart"
          title="Promise Dashboard"
          subtitle="Track all government commitments"
          color="#2563EB"
          badge="45"
          onPress={() => navigation.navigate('Dashboard')}
        />

        <QuickActionCard
          icon="map"
          title="Live Map"
          subtitle="View promise locations nationwide"
          color="#10B981"
          onPress={() => navigation.navigate('Map')}
        />

        <QuickActionCard
          icon="megaphone"
          title="Report Issue"
          subtitle="File a new accountability report"
          color="#DC2626"
          badge="New"
          onPress={() => navigation.navigate('Report')}
        />

        <QuickActionCard
          icon="person-circle"
          title="My Profile"
          subtitle="View your contributions & reports"
          color="#8B5CF6"
          onPress={() => navigation.navigate('Profile')}
        />
      </View>

      {/* ==== RECENT UPDATES ==== */}
      <View style={styles.updatesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📢 Recent Updates</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <NewsCard
          title="Free SHS enrollment reaches 1.2M students"
          date="2 days ago"
          type="promise"
        />
        <NewsCard
          title="Agenda 111: 28 hospitals completed"
          date="5 days ago"
          type="promise"
        />
        <NewsCard
          title="New report filed in Accra Region"
          date="1 week ago"
          type="report"
        />
      </View>

      {/* ==== ABOUT SECTION ==== */}
      <View style={styles.aboutSection}>
        <View style={styles.aboutCard}>
          <View style={styles.aboutHeader}>
            <Ionicons name="information-circle" size={28} color="#2563EB" />
            <Text style={styles.aboutTitle}>About Promise Guardian</Text>
          </View>
          <Text style={styles.aboutText}>
            Ghana Promise Guardian is a citizen-powered platform dedicated to tracking government promises and fostering accountability. Together, we ensure transparency and progress for Ghana's future.
          </Text>
          
          <View style={styles.aboutStats}>
            <View style={styles.aboutStat}>
              <Text style={styles.aboutStatNumber}>2025</Text>
              <Text style={styles.aboutStatLabel}>Launched</Text>
            </View>
            <View style={styles.aboutStat}>
              <Text style={styles.aboutStatNumber}>16</Text>
              <Text style={styles.aboutStatLabel}>Regions</Text>
            </View>
            <View style={styles.aboutStat}>
              <Text style={styles.aboutStatNumber}>100%</Text>
              <Text style={styles.aboutStatLabel}>Transparent</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ==== FOOTER ==== */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Built with ❤️ for Ghana 🇬🇭 Future</Text>
        <Text style={styles.footerSubtext}>Powered by Rauf Husein • For the People of Ghana 🇬🇭 </Text>
      </View>
    </ScrollView>
  );
}

/* ==============================================================
   STYLES
   ============================================================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },

  /* ---- Ghana Flag Header ---- */
  flagHeader: {
    height: 170,
  },
  flagStripe: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flagHeaderText: {
    fontSize: 50,
  },
  blackStarContainer: {
    position: 'absolute',
    top: 1,
  },
  mainTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginTop: 10,
  },
  mainSubtitle: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '600',
  },

  /* ---- Welcome Section ---- */
  welcomeSection: {
    marginTop: -70,
    paddingHorizontal: 20,
  },
  welcomeCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  welcomeGreeting: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  guardianId: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontFamily: 'monospace',
  },
  logoutIcon: {
    backgroundColor: '#069139ff',
    padding: 8,
    borderRadius: 10,
  },
  impactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  impactText: {
    marginLeft: 12,
    flex: 1,
  },
  impactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
  },
  impactDesc: {
    fontSize: 14,
    color: '#059669',
    marginTop: 2,
  },

  /* ---- Mission Card ---- */
  missionCard: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  missionText: {
    flex: 1,
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
    marginLeft: 12,
  },

  /* ---- Statistics Section ---- */
  statsSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  seeAll: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statColumn: {
    flex: 1,
    gap: 12,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statCardLarge: {
    flex: 1,
    alignItems: 'center',
  },
  statCardSmall: {
    flex: 1,
    borderLeftWidth: 4,
  },
  statIconLarge: {
    backgroundColor: '#EFF6FF',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumberLarge: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
  statLabelSmall: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
  statPercent: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  statBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  statBadgeText: {
    fontSize: 10,
    color: '#2563EB',
    fontWeight: '600',
  },

  /* ---- Secondary Stats ---- */
  secondaryStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  secondaryStatCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryStatText: {
    marginLeft: 12,
  },
  secondaryStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  secondaryStatLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },

  /* ---- Quick Actions ---- */
  actionsSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },

  /* ---- Recent Updates ---- */
  updatesSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  newsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  newsIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  newsDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  /* ---- About Section ---- */
  aboutSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  aboutCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  aboutText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 16,
  },
  aboutStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  aboutStat: {
    alignItems: 'center',
  },
  aboutStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  aboutStatLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },

  /* ---- Footer ---- */
  footer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '600',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
});