// src/screens/AdminSeedingScreen.js
// ⚠️ USE WITH CAUTION - Admin only functionality
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  seedAllPromises,
  seedNDC2024Promises,
  seedNPP2016Promises,
  clearAllPromises,
  reseedAllPromises,
  getDatabaseStats,
} from '../services/firestore-old';
import { NDC_2024_PROMISES, NPP_2016_PROMISES } from '../data/manifestoData';

export default function AdminSeedingScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoadingStats(true);
      const data = await getDatabaseStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleSeedAll = async () => {
    Alert.alert(
      'Seed All Promises',
      `This will add ${NDC_2024_PROMISES.length + NPP_2016_PROMISES.length} promises to the database. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Seed',
          onPress: async () => {
            try {
              setLoading(true);
              const result = await seedAllPromises();
              
              if (result.success) {
                Alert.alert('Success! ✅', `Seeded ${result.count} promises`);
                await loadStats();
              } else {
                Alert.alert('Error ❌', result.error);
              }
            } catch (error) {
              Alert.alert('Error', error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleSeedNDC = async () => {
    Alert.alert(
      'Seed NDC 2024 Promises',
      `This will add ${NDC_2024_PROMISES.length} NDC promises. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Seed',
          onPress: async () => {
            try {
              setLoading(true);
              const result = await seedNDC2024Promises();
              
              if (result.success) {
                Alert.alert('Success! ✅', `Seeded ${result.count} promises`);
                await loadStats();
              } else {
                Alert.alert('Error ❌', result.error);
              }
            } catch (error) {
              Alert.alert('Error', error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleSeedNPP = async () => {
    Alert.alert(
      'Seed NPP 2016 Promises',
      `This will add ${NPP_2016_PROMISES.length} NPP promises. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Seed',
          onPress: async () => {
            try {
              setLoading(true);
              const result = await seedNPP2016Promises();
              
              if (result.success) {
                Alert.alert('Success! ✅', `Seeded ${result.count} promises`);
                await loadStats();
              } else {
                Alert.alert('Error ❌', result.error);
              }
            } catch (error) {
              Alert.alert('Error', error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleClearAll = async () => {
    Alert.alert(
      '⚠️ Clear All Data',
      'This will DELETE all promises from the database. This action cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const result = await clearAllPromises();
              
              if (result.success) {
                Alert.alert('Cleared! 🗑️', `Deleted ${result.count} promises`);
                await loadStats();
              } else {
                Alert.alert('Error ❌', result.error);
              }
            } catch (error) {
              Alert.alert('Error', error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleReseed = async () => {
    Alert.alert(
      '🔄 Re-seed Database',
      'This will clear all existing data and re-seed fresh. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Re-seed',
          onPress: async () => {
            try {
              setLoading(true);
              const result = await reseedAllPromises();
              
              if (result.success) {
                Alert.alert('Success! ✅', `Re-seeded ${result.count} promises`);
                await loadStats();
              } else {
                Alert.alert('Error ❌', result.error);
              }
            } catch (error) {
              Alert.alert('Error', error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const ActionButton = ({ icon, title, subtitle, color, onPress, destructive }) => (
    <TouchableOpacity
      style={styles.actionButton}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={destructive ? ['#FEE2E2', '#FECACA'] : [color + '15', color + '08']}
        style={styles.actionGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={[styles.actionIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={28} color={color} />
        </View>
        <View style={styles.actionText}>
          <Text style={styles.actionTitle}>{title}</Text>
          <Text style={styles.actionSubtitle}>{subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
      </LinearGradient>
    </TouchableOpacity>
  );

  const StatCard = ({ icon, label, value, color }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#DC2626', '#B91C1C', '#991B1B']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerIcon}>
          <Ionicons name="server" size={48} color="white" />
        </View>
        <Text style={styles.headerTitle}>Database Management</Text>
        <Text style={styles.headerSubtitle}>⚠️ Admin Access Only</Text>
      </LinearGradient>

      {/* Database Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Database Statistics</Text>
        
        {loadingStats ? (
          <ActivityIndicator size="large" color="#DC2626" style={{ marginVertical: 20 }} />
        ) : stats ? (
          <>
            <View style={styles.statsGrid}>
              <StatCard
                icon="documents"
                label="Total Promises"
                value={stats.totalPromises}
                color="#3B82F6"
              />
              <StatCard
                icon="megaphone"
                label="Total Reports"
                value={stats.totalReports}
                color="#F59E0B"
              />
              <StatCard
                icon="flash"
                label="Flagship"
                value={stats.flagshipPromises}
                color="#DC2626"
              />
              <StatCard
                icon="checkmark-circle"
                label="Completed"
                value={stats.byStatus.completed}
                color="#10B981"
              />
            </View>

            {/* Party Breakdown */}
            <View style={styles.breakdownCard}>
              <Text style={styles.breakdownTitle}>By Party</Text>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>🟢 NDC 2024</Text>
                <Text style={styles.breakdownValue}>{stats.byParty.NDC}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>🔵 NPP 2016</Text>
                <Text style={styles.breakdownValue}>{stats.byParty.NPP}</Text>
              </View>
            </View>

            {/* Status Breakdown */}
            <View style={styles.breakdownCard}>
              <Text style={styles.breakdownTitle}>By Status</Text>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>⏳ Pending</Text>
                <Text style={styles.breakdownValue}>{stats.byStatus.pending}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>🔄 In Progress</Text>
                <Text style={styles.breakdownValue}>{stats.byStatus.inProgress}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>⚠️ Partial</Text>
                <Text style={styles.breakdownValue}>{stats.byStatus.partial}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>❌ Broken</Text>
                <Text style={styles.breakdownValue}>{stats.byStatus.broken}</Text>
              </View>
            </View>
          </>
        ) : (
          <Text style={styles.emptyText}>No data available</Text>
        )}

        <TouchableOpacity style={styles.refreshButton} onPress={loadStats}>
          <Ionicons name="refresh" size={20} color="#3B82F6" />
          <Text style={styles.refreshText}>Refresh Stats</Text>
        </TouchableOpacity>
      </View>

      {/* Seeding Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌱 Seeding Actions</Text>
        
        <ActionButton
          icon="cloud-upload"
          title="Seed All Promises"
          subtitle={`Add ${NDC_2024_PROMISES.length + NPP_2016_PROMISES.length} promises (NDC + NPP)`}
          color="#10B981"
          onPress={handleSeedAll}
        />
        
        <ActionButton
          icon="leaf"
          title="Seed NDC 2024 Only"
          subtitle={`Add ${NDC_2024_PROMISES.length} NDC promises`}
          color="#3B82F6"
          onPress={handleSeedNDC}
        />
        
        <ActionButton
          icon="leaf"
          title="Seed NPP 2016 Only"
          subtitle={`Add ${NPP_2016_PROMISES.length} NPP promises`}
          color="#8B5CF6"
          onPress={handleSeedNPP}
        />
      </View>

      {/* Dangerous Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚠️ Dangerous Actions</Text>
        
        <ActionButton
          icon="refresh"
          title="Re-seed Database"
          subtitle="Clear and re-seed fresh data"
          color="#F59E0B"
          onPress={handleReseed}
        />
        
        <ActionButton
          icon="trash"
          title="Clear All Data"
          subtitle="Delete all promises (CANNOT UNDO)"
          color="#DC2626"
          onPress={handleClearAll}
          destructive
        />
      </View>

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#DC2626" />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 40,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  headerIcon: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    margin: '1%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
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
  breakdownCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  breakdownValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '700',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    gap: 8,
  },
  refreshText: {
    fontSize: 15,
    color: '#3B82F6',
    fontWeight: '700',
  },
  actionButton: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
    marginVertical: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
});