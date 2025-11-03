// src/screens/ProfileScreen.js
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { logout } from '../services/auth';

export default function ProfileScreen({ uid, navigation }) {
  const [userStats] = useState({
    reportsSubmitted: 12,
    promisesTracked: 45,
    daysActive: 87,
    rank: 'Bronze Guardian',
  });

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              Alert.alert('Logged Out', 'See you soon, Guardian!');
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: '🇬🇭 Join me as a Ghana Promise Guardian! Track government promises and hold leaders accountable. Download the app now!',
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const MenuOption = ({ icon, title, subtitle, color, onPress, badge }) => (
    <TouchableOpacity style={styles.menuOption} onPress={onPress}>
      <View style={[styles.menuIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.menuText}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color="white" />
          </View>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>🥉</Text>
          </View>
        </View>
        <Text style={styles.userName}>Guardian {uid?.slice(0, 8)}</Text>
        <Text style={styles.userRank}>{userStats.rank}</Text>
        <Text style={styles.userJoined}>Member for {userStats.daysActive} days</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>📊 My Contributions</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="megaphone" size={32} color="#DC2626" />
            <Text style={styles.statNumber}>{userStats.reportsSubmitted}</Text>
            <Text style={styles.statLabel}>Reports Filed</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="eye" size={32} color="#3B82F6" />
            <Text style={styles.statNumber}>{userStats.promisesTracked}</Text>
            <Text style={styles.statLabel}>Promises Tracked</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={32} color="#F59E0B" />
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Guardian Points</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="people" size={32} color="#10B981" />
            <Text style={styles.statNumber}>2.1k</Text>
            <Text style={styles.statLabel}>Community</Text>
          </View>
        </View>
      </View>

      {/* Achievement Banner */}
      <View style={styles.achievementBanner}>
        <Ionicons name="ribbon" size={24} color="#DC2626" />
        <View style={styles.achievementText}>
          <Text style={styles.achievementTitle}>Next Rank: Silver Guardian</Text>
          <Text style={styles.achievementSubtitle}>Submit 8 more reports to unlock</Text>
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>⚙️ Account</Text>
        
        <MenuOption
          icon="notifications"
          title="Notifications"
          subtitle="Manage your alerts"
          color="#F59E0B"
          onPress={() => Alert.alert('Coming Soon', 'Notification settings will be available soon!')}
        />

        <MenuOption
          icon="bookmark"
          title="Saved Promises"
          subtitle="View your bookmarks"
          color="#3B82F6"
          badge="5"
          onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon!')}
        />

        <MenuOption
          icon="document-text"
          title="My Reports"
          subtitle="View your submission history"
          color="#10B981"
          onPress={() => Alert.alert('Coming Soon', 'Report history coming soon!')}
        />

        <MenuOption
          icon="shield-checkmark"
          title="Privacy & Security"
          subtitle="Your data is safe with us"
          color="#8B5CF6"
          onPress={() => Alert.alert('Privacy', 'We value your privacy. All reports are anonymous and secure.')}
        />
      </View>

      {/* Community Section */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>🌍 Community</Text>
        
        <MenuOption
          icon="share-social"
          title="Invite Friends"
          subtitle="Spread the word"
          color="#EC4899"
          onPress={handleShare}
        />

        <MenuOption
          icon="information-circle"
          title="About Us"
          subtitle="Our mission and vision"
          color="#6366F1"
          onPress={() => Alert.alert(
            'About Ghana Promise Guardian',
            'We are a youth-led initiative dedicated to holding government leaders accountable. Inspired by Ghana\'s independence legacy, we empower citizens to track promises and report issues.'
          )}
        />

        <MenuOption
          icon="help-circle"
          title="Help & Support"
          subtitle="Get assistance"
          color="#14B8A6"
          onPress={() => Alert.alert('Support', 'Email: support@ghanaprominse.org')}
        />
      </View>

      {/* Danger Zone */}
      <View style={styles.dangerZone}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color="#DC2626" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Ghana Promise Guardian v1.0.0</Text>
        <Text style={styles.footerText}>Made with ❤️ for Ghana 🇬🇭</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  // Header
  header: {
    backgroundColor: '#DC2626',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  rankBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#DC2626',
  },
  rankText: {
    fontSize: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  userRank: {
    fontSize: 16,
    color: '#FED7AA',
    fontWeight: '600',
  },
  userJoined: {
    fontSize: 13,
    color: '#FCA5A5',
    marginTop: 4,
  },

  // Stats
  statsSection: {
    padding: 20,
  },
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
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },

  // Achievement
  achievementBanner: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FCD34D',
  },
  achievementText: {
    flex: 1,
    marginLeft: 12,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
  },
  achievementSubtitle: {
    fontSize: 13,
    color: '#78350F',
    marginTop: 2,
  },

  // Menu
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  menuOption: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Danger Zone
  dangerZone: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC2626',
    marginLeft: 8,
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
});