// src/screens/ProfileScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { logout } from '../services/auth';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ uid, navigation }) {
  const [userStats] = useState({
    reportsSubmitted: 12,
    promisesTracked: 45,
    daysActive: 87,
    rank: 'Bronze Guardian',
    progress: 60, // Progress to next rank (%)
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: userStats.progress,
      duration: 1500,
      delay: 300,
      useNativeDriver: false,
    }).start();
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
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
    ]);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          '🇬🇭 Join me as a Ghana Promise Guardian! Track government promises and hold leaders accountable. Download the app now!',
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const MenuOption = ({ icon, title, subtitle, color, onPress, badge }) => {
    const pressAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(pressAnim, {
        toValue: 0.96,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(pressAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View style={{ transform: [{ scale: pressAnim }] }}>
        <TouchableOpacity
          style={styles.menuOption}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <LinearGradient
            colors={[color + '15', color + '08']}
            style={styles.menuIconGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name={icon} size={26} color={color} />
          </LinearGradient>
          <View style={styles.menuText}>
            <Text style={styles.menuTitle}>{title}</Text>
            {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
          </View>
          {badge && (
            <View style={[styles.badge, { backgroundColor: color }]}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={22} color="#D1D5DB" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const StatCard = ({ icon, number, label, color, delay }) => {
    const animValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(animValue, {
        toValue: 1,
        duration: 600,
        delay: delay,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.statCard,
          {
            opacity: animValue,
            transform: [
              {
                translateY: animValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['white', '#F9FAFB']}
          style={styles.statCardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={[styles.statIconContainer, { backgroundColor: color + '15' }]}>
            <Ionicons name={icon} size={32} color={color} />
          </View>
          <Text style={styles.statNumber}>{number}</Text>
          <Text style={styles.statLabel}>{label}</Text>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Premium Profile Header */}
      <LinearGradient
        colors={['#DC2626', '#B91C1C', '#991B1B']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Background Pattern */}
        <View style={styles.headerPattern}>
          <View style={[styles.patternCircle, { top: -50, left: -50 }]} />
          <View style={[styles.patternCircle, { bottom: -30, right: -30 }]} />
        </View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            alignItems: 'center',
          }}
        >
          {/* Avatar with Rings */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarRing1} />
            <View style={styles.avatarRing2} />
            <LinearGradient
              colors={['#EF4444', '#DC2626']}
              style={styles.avatar}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="person" size={56} color="white" />
            </LinearGradient>
            <View style={styles.rankBadge}>
              <Text style={styles.rankEmoji}>🥉</Text>
            </View>
          </View>

          <Text style={styles.userName}>Guardian {uid?.slice(0, 8)}</Text>
          <View style={styles.rankContainer}>
            <LinearGradient
              colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.15)']}
              style={styles.rankPill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="shield" size={16} color="white" />
              <Text style={styles.userRank}>{userStats.rank}</Text>
            </LinearGradient>
          </View>
          <Text style={styles.userJoined}>
            <Ionicons name="time" size={14} /> Member for {userStats.daysActive} days
          </Text>
        </Animated.View>
      </LinearGradient>

      {/* Stats Grid */}
      <Animated.View
        style={[
          styles.statsSection,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEmoji}>📊</Text>
          <Text style={styles.sectionTitle}>My Contributions</Text>
        </View>
        <View style={styles.statsGrid}>
          <StatCard
            icon="megaphone"
            number={userStats.reportsSubmitted}
            label="Reports Filed"
            color="#DC2626"
            delay={100}
          />
          <StatCard
            icon="eye"
            number={userStats.promisesTracked}
            label="Promises Tracked"
            color="#3B82F6"
            delay={200}
          />
          <StatCard
            icon="trophy"
            number="156"
            label="Guardian Points"
            color="#F59E0B"
            delay={300}
          />
          <StatCard
            icon="people"
            number="2.1k"
            label="Community"
            color="#10B981"
            delay={400}
          />
        </View>
      </Animated.View>

      {/* Achievement Progress Banner */}
      <Animated.View
        style={[
          styles.achievementBanner,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <LinearGradient
          colors={['#FEF3C7', '#FDE68A']}
          style={styles.achievementGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.achievementContent}>
            <View style={styles.achievementIcon}>
              <Ionicons name="ribbon" size={28} color="#DC2626" />
            </View>
            <View style={styles.achievementTextContainer}>
              <Text style={styles.achievementTitle}>Next Rank: Silver Guardian</Text>
              <Text style={styles.achievementSubtitle}>
                Submit 8 more reports to unlock
              </Text>
              {/* Progress Bar */}
              <View style={styles.progressBarContainer}>
                <Animated.View
                  style={[
                    styles.progressBar,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                >
                  <LinearGradient
                    colors={['#DC2626', '#B91C1C']}
                    style={styles.progressGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </Animated.View>
                <Text style={styles.progressText}>{userStats.progress}%</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Menu Options - Account */}
      <Animated.View
        style={[
          styles.menuSection,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEmoji}>⚙️</Text>
          <Text style={styles.sectionTitle}>Account</Text>
        </View>

        <MenuOption
          icon="notifications"
          title="Notifications"
          subtitle="Manage your alerts"
          color="#F59E0B"
          onPress={() =>
            Alert.alert('Coming Soon', 'Notification settings will be available soon!')
          }
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
          onPress={() =>
            Alert.alert(
              'Privacy',
              'We value your privacy. All reports are anonymous and secure.'
            )
          }
        />
      </Animated.View>

      {/* Community Section */}
      <Animated.View
        style={[
          styles.menuSection,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEmoji}>🌍</Text>
          <Text style={styles.sectionTitle}>Community</Text>
        </View>

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
          onPress={() =>
            Alert.alert(
              'About Ghana Promise Guardian',
              "We are a youth-led initiative dedicated to holding government leaders accountable. Inspired by Ghana's independence legacy, we empower citizens to track promises and report issues."
            )
          }
        />

        <MenuOption
          icon="help-circle"
          title="Help & Support"
          subtitle="Get assistance"
          color="#14B8A6"
          onPress={() => Alert.alert('Support', 'Email: support@ghanaprominse.org')}
        />
      </Animated.View>

      {/* Danger Zone */}
      <Animated.View
        style={[
          styles.dangerZone,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <LinearGradient
            colors={['#FEE2E2', '#FECACA']}
            style={styles.logoutGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="log-out" size={22} color="#DC2626" />
            <Text style={styles.logoutText}>Logout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Premium Footer */}
      <View style={styles.footer}>
        <View style={styles.footerDivider} />
        <Text style={styles.footerVersion}>Ghana Promise Guardian v1.0.0</Text>
        <View style={styles.footerLove}>
          <Text style={styles.footerText}>Made with</Text>
          <Ionicons name="heart" size={14} color="#DC2626" style={{ marginHorizontal: 4 }} />
          <Text style={styles.footerText}>for Ghana</Text>
          <Text style={styles.footerFlag}>🇬🇭</Text>
        </View>
      </View>

      {/* Bottom Padding */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // Premium Header
  header: {
    paddingVertical: 50,
    paddingHorizontal: 20,
    paddingBottom: 60,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
  },
  headerPattern: {
    ...StyleSheet.absoluteFillObject,
  },
  patternCircle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRing1: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderStyle: 'dashed',
  },
  avatarRing2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  rankBadge: {
    position: 'absolute',
    bottom: -5,
    right: width / 2 - 75,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#DC2626',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  rankEmoji: {
    fontSize: 24,
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  rankContainer: {
    marginBottom: 8,
  },
  rankPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  userRank: {
    fontSize: 15,
    color: 'white',
    fontWeight: '700',
  },
  userJoined: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    fontWeight: '500',
  },

  // Stats Section
  statsSection: {
    padding: 24,
    marginTop: -30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  statCardGradient: {
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 20,
  },
  statIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
  },

  // Achievement Banner
  achievementBanner: {
    marginHorizontal: 24,
    marginBottom: 28,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  achievementGradient: {
    borderWidth: 2,
    borderColor: '#FCD34D',
    borderRadius: 20,
  },
  achievementContent: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  achievementIcon: {
    marginRight: 16,
  },
  achievementTextContainer: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#92400E',
    marginBottom: 4,
  },
  achievementSubtitle: {
    fontSize: 14,
    color: '#78350F',
    marginBottom: 12,
    fontWeight: '500',
  },
  progressBarContainer: {
    position: 'relative',
    height: 8,
    backgroundColor: 'rgba(146, 64, 14, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressGradient: {
    flex: 1,
  },
  progressText: {
    position: 'absolute',
    right: 8,
    top: -20,
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },

  // Menu Section
  menuSection: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  menuOption: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  menuIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '800',
  },

  // Danger Zone
  dangerZone: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  logoutBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderWidth: 2,
    borderColor: '#FCA5A5',
    borderRadius: 16,
    gap: 10,
  },
  logoutText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#DC2626',
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  footerDivider: {
    width: 60,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 20,
  },
  footerVersion: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 8,
    fontWeight: '600',
  },
  footerLove: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  footerFlag: {
    fontSize: 16,
    marginLeft: 4,
  },
});