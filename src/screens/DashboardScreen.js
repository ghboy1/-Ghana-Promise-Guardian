// src/screens/DashboardScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Image,
  Linking,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import parliamentImage from '../../assets/images/parliament.png';
import { getPromises, submitReport } from '../../firebase';
const { width } = Dimensions.get('window');

// Local fallback data
const localPromises = [
  {
    id: '1',
    title: 'Free Senior High School (SHS) Policy',
    description: 'Provide free secondary education for all Ghanaian students nationwide',
    status: 'fulfilled',
    category: 'Education',
    impact: 'High',
    datePromised: '2017-01-07',
    progress: 100,
    region: 'National',
    government: 'npp2017',
    beneficiaries: '1.2M students',
    budget: 'GH₵2.8B annually',
    achievement: 'Successfully enrolled over 1.2 million students in free SHS',
  },
  {
    id: '2',
    title: 'One District, One Factory (1D1F)',
    description: 'Establish at least one factory in each district to boost industrialization',
    status: 'progress',
    category: 'Economy',
    impact: 'High',
    datePromised: '2017-01-07',
    progress: 65,
    region: 'National',
    government: 'npp2017',
    factoriesBuilt: 181,
    target: 260,
    jobsCreated: '128,000+',
  },
  {
    id: '3',
    title: 'Scrap E-Levy within first 100 days',
    description: 'Remove the electronic levy on mobile money transactions to reduce the burden on Ghanaians',
    status: 'pending',
    category: 'Economy',
    impact: 'High',
    datePromised: '2025-01-07',
    progress: 0,
    region: 'National',
    government: 'current',
  },
];

export default function DashboardScreen({ navigation }) {
  const [promises, setPromises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedGovernment, setSelectedGovernment] = useState('current');

  // Government periods data
  const governments = [
    {
      id: 'current',
      name: 'Current Administration',
      party: 'NDC',
      period: '2025 - Present',
      president: 'John Mahama',
      color: '#0a7908ff',
    },
    {
      id: 'npp2017',
      name: 'NPP Administration',
      party: 'NPP',
      period: '2017 - 2024',
      president: 'Nana Akufo-Addo',
      color: '#073fa7ff',
    },
    {
      id: 'all',
      name: 'All Administrations',
      party: 'All',
      period: '2000 - Present',
      president: 'All Presidents',
      color: '#00d4feff',
    },
  ];

  useEffect(() => {
    loadPromises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGovernment]);

  // Try dynamic import of either service file (so bundler won't crash if one is missing)
  const loadPromises = async () => {
    setLoading(true);
    try {
      let data = [];

      // Try ../services/firestore -> getAllPromisesFromDB
      try {
        const fs = await import('../services/firestore-old');
        if (fs && typeof fs.getAllPromisesFromDB === 'function') {
          data = await fs.getAllPromisesFromDB();
          console.log('Loaded from services/firestore:', data?.length ?? 0);
        }
      } catch (err) {
        console.log('services/firestore not available or failed:', err.message || err);
      }

      // If nothing yet, try ../firebase -> getPromises
      if (!data || data.length === 0) {
        try {
          const fb = await import('../firebase');
          if (fb && typeof fb.getPromises === 'function') {
            data = await fb.getPromises();
            console.log('Loaded from firebase:', data?.length ?? 0);
          }
        } catch (err) {
          console.log('firebase module not available or failed:', err.message || err);
        }
      }

      // Use local fallback when cloud fails or returns empty
      if (!data || data.length === 0) {
        console.log('Using local fallback data');
        data = localPromises;
      }

      // Filter by government selection if not 'all'
      const filteredByGov = selectedGovernment === 'all' ? data : data.filter(p => p.government === selectedGovernment);

      setPromises(filteredByGov);
    } catch (error) {
      console.error('Error loading promises:', error);
      Alert.alert('Error', 'Could not load promises. Showing local data.');
      const fallback = selectedGovernment === 'all' ? localPromises : localPromises.filter(p => p.government === selectedGovernment);
      setPromises(fallback);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'fulfilled': return '#10B981';
      case 'progress': return '#F59E0B';
      case 'broken': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'fulfilled': return 'checkmark-circle';
      case 'progress': return 'time';
      case 'broken': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'fulfilled': return 'Fulfilled';
      case 'progress': return 'In Progress';
      case 'broken': return 'Broken';
      default: return 'Unknown';
    }
  };

  const filteredPromises = promises.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const stats = {
    total: filteredPromises.length,
    fulfilled: filteredPromises.filter(p => p.status === 'fulfilled').length,
    progress: filteredPromises.filter(p => p.status === 'progress').length,
    broken: filteredPromises.filter(p => p.status === 'broken').length,
  };

  const openBudget = () => {
    const url = 'https://mofep.gov.gh/sites/default/files/budget-statements/2026-Budget-Statement-and-Economic-Policy.pdf';
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open the budget PDF'));
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text style={styles.loadingText}>Loading Promises from Cloud...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🇬🇭 National Promises</Text>
        <Text style={styles.headerSubtitle}>Track Government Commitments & Achievements</Text>

        {/* Stats */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsContainer}>
          <View style={[styles.statCard, { borderLeftColor: '#2563EB' }]}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Promises</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#10B981' }]}>
            <Text style={[styles.statNumber, { color: '#10B981' }]}>{stats.fulfilled}</Text>
            <Text style={styles.statLabel}>Fulfilled</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#F59E0B' }]}>
            <Text style={[styles.statNumber, { color: '#F59E0B' }]}>{stats.progress}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          {stats.broken > 0 && (
            <View style={[styles.statCard, { borderLeftColor: '#EF4444' }]}>
              <Text style={[styles.statNumber, { color: '#EF4444' }]}>{stats.broken}</Text>
              <Text style={styles.statLabel}>Broken</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Government selector */}
      <View style={styles.govSelectorSection}>
        <Text style={styles.sectionTitle}>Select Administration Period</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {governments.map(gov => {
            const isSelected = selectedGovernment === gov.id;
            return (
              <TouchableOpacity
                key={gov.id}
                style={[styles.govCard, isSelected && { borderColor: gov.color, borderWidth: 2 }]}
                onPress={() => setSelectedGovernment(gov.id)}
              >
                <View style={[styles.govIndicator, { backgroundColor: gov.color }]} />
                <View style={styles.govInfo}>
                  <Text style={styles.govName}>{gov.name}</Text>
                  <Text style={styles.govPeriod}>{gov.period}</Text>
                  <Text style={styles.govPresident}>{gov.president}</Text>
                </View>
                {isSelected && <Ionicons name="checkmark-circle" size={20} color={gov.color} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Filters */}
      <View style={styles.filterSection}>
        <Text style={styles.sectionTitle}>Filter by Status</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          <TouchableOpacity style={[styles.filterCard, filter === 'all' && styles.filterCardActive]} onPress={() => setFilter('all')}>
            <Text style={[styles.filterNumber, { color: '#2563EB' }]}>{stats.total}</Text>
            <Text style={styles.filterLabel}>ALL</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.filterCard, filter === 'fulfilled' && styles.filterCardActive]} onPress={() => setFilter('fulfilled')}>
            <Text style={[styles.filterNumber, { color: '#10B981' }]}>{stats.fulfilled}</Text>
            <Text style={styles.filterLabel}>FULFILLED</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.filterCard, filter === 'progress' && styles.filterCardActive]} onPress={() => setFilter('progress')}>
            <Text style={[styles.filterNumber, { color: '#F59E0B' }]}>{stats.progress}</Text>
            <Text style={styles.filterLabel}>IN PROGRESS</Text>
          </TouchableOpacity>

          {stats.broken > 0 && (
            <TouchableOpacity style={[styles.filterCard, filter === 'broken' && styles.filterCardActive]} onPress={() => setFilter('broken')}>
              <Text style={[styles.filterNumber, { color: '#EF4444' }]}>{stats.broken}</Text>
              <Text style={styles.filterLabel}>BROKEN</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      {/* List */}
      <ScrollView
        style={styles.listContainer}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadPromises} colors={['#DC2626']} />}
      >
        <Image source={parliamentImage} style={styles.hero} />

        <TouchableOpacity style={styles.pdfButton} onPress={openBudget}>
          <Text style={styles.pdfText}>Open 2026 Budget (Official PDF)</Text>
        </TouchableOpacity>

        {filteredPromises.length > 0 ? (
          filteredPromises.map((promise) => (
            <TouchableOpacity
              key={promise.id}
              style={styles.promiseCard}
              onPress={() => navigation?.navigate && navigation.navigate('PromiseDetail', { promise })}
              onLongPress={() => {
                const details = `
${promise.description}

Status: ${getStatusLabel(promise.status)}
Category: ${promise.category}
Region: ${promise.region}
Date Promised: ${promise.datePromised}
${promise.beneficiaries ? `\nBeneficiaries: ${promise.beneficiaries}` : ''}
${promise.jobsCreated ? `\nJobs Created: ${promise.jobsCreated}` : ''}
${promise.budget ? `\nBudget: ${promise.budget}` : ''}
${promise.achievement ? `\n\nAchievement: ${promise.achievement}` : ''}
                `.trim();
                Alert.alert(promise.title, details);
              }}
            >
              <View style={styles.promiseHeader}>
                <View style={styles.promiseCategory}>
                  <Ionicons name="pricetag" size={14} color="#6B7280" />
                  <Text style={styles.categoryText}>{promise.category}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(promise.status) + '20' }]}>
                  <Ionicons name={getStatusIcon(promise.status)} size={16} color={getStatusColor(promise.status)} />
                  <Text style={[styles.statusText, { color: getStatusColor(promise.status) }]}>{getStatusLabel(promise.status)}</Text>
                </View>
              </View>

              <Text style={styles.promiseTitle}>{promise.title}</Text>
              <Text style={styles.promiseDescription} numberOfLines={2}>{promise.description}</Text>

              {promise.status === 'progress' && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${promise.progress || 0}%`, backgroundColor: getStatusColor(promise.status) }]} />
                  </View>
                  <Text style={styles.progressText}>{promise.progress || 0}%</Text>
                </View>
              )}

              {(promise.factoriesBuilt || promise.hospitalsCompleted || promise.beneficiaries) && (
                <View style={styles.metricsContainer}>
                  {promise.factoriesBuilt && (
                    <View style={styles.metric}>
                      <Ionicons name="business" size={16} color="#059669" />
                      <Text style={styles.metricText}>{promise.factoriesBuilt}/{promise.target || '-'} factories</Text>
                    </View>
                  )}
                  {promise.hospitalsCompleted && (
                    <View style={styles.metric}>
                      <Ionicons name="medical" size={16} color="#DC2626" />
                      <Text style={styles.metricText}>{promise.hospitalsCompleted}/{promise.target || '-'} hospitals</Text>
                    </View>
                  )}
                  {promise.beneficiaries && (
                    <View style={styles.metric}>
                      <Ionicons name="people" size={16} color="#2563EB" />
                      <Text style={styles.metricText}>{promise.beneficiaries}</Text>
                    </View>
                  )}
                </View>
              )}

              {promise.achievement && (
                <View style={styles.achievementBadge}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={styles.achievementText} numberOfLines={2}>{promise.achievement}</Text>
                </View>
              )}

              <View style={styles.promiseFooter}>
                <View style={styles.promiseInfo}>
                  <Ionicons name="location" size={14} color="#6B7280" />
                  <Text style={styles.infoText}>{promise.region}</Text>
                </View>
                <View style={styles.promiseInfo}>
                  <Ionicons name="flag" size={14} color="#6B7280" />
                  <Text style={styles.infoText}>Impact: {promise.impact}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="folder-open-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>No promises found in this category</Text>
            <Text style={styles.emptySubtext}>Try selecting a different filter or administration</Text>
          </View>
        )}

        <View style={styles.footerNote}>
          <Ionicons name="information-circle" size={20} color="#6B7280" />
          <Text style={styles.footerText}>
            Data sourced from official government reports and verified public records
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 20, fontSize: 16, color: '#065F46' },
  header: { backgroundColor: 'white', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1F2937' },
  headerSubtitle: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  statsContainer: { flexDirection: 'row', marginTop: 12 },
  statCard: { backgroundColor: '#F9FAFB', padding: 12, borderRadius: 10, marginRight: 10, minWidth: 100, borderLeftWidth: 4 },
  statNumber: { fontSize: 22, fontWeight: 'bold', color: '#2563EB' },
  statLabel: { fontSize: 11, color: '#6B7280', marginTop: 2, fontWeight: '500' },
  govSelectorSection: { backgroundColor: 'white', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#e70c0cff', marginBottom: 8 },
  govCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 10, padding: 10, marginRight: 10, minWidth: 240, borderWidth: 1, borderColor: '#E5E7EB' },
  govIndicator: { width: 4, height: 45, borderRadius: 2, marginRight: 10 },
  govInfo: { flex: 1 },
  govName: { fontSize: 13, fontWeight: 'bold', color: '#1F2937' },
  govPeriod: { fontSize: 11, color: '#6B7280', marginTop: 1 },
  govPresident: { fontSize: 11, color: '#9CA3AF', marginTop: 1 },
  filterSection: { backgroundColor: 'white', padding: 12, borderBottomWidth: 1, borderBottomColor: '#06305bff' },
  filterContainer: { flexDirection: 'row' },
  filterCard: { backgroundColor: '#06305bff', padding: 12, borderRadius: 10, marginRight: 10, minWidth: 100, borderLeftWidth: 4, alignItems: 'center' },
  filterCardActive: { backgroundColor: '#099d3fff', transform: [{ scale: 1.05 }] },
  filterNumber: { fontSize: 22, fontWeight: 'bold', color: '#ffffff' },
  filterLabel: { fontSize: 11, color: '#f9fafdff', marginTop: 2, fontWeight: '700', textAlign: 'center' },
  listContainer: { flex: 1, padding: 16 },
  hero: { width: width - 32, height: 180, resizeMode: 'cover', borderRadius: 12, marginBottom: 12, alignSelf: 'center' },
  pdfButton: { backgroundColor: '#DC2626', marginVertical: 8, padding: 12, borderRadius: 12, alignSelf: 'center', width: '85%' },
  pdfText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  promiseCard: { backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  promiseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  promiseCategory: { flexDirection: 'row', alignItems: 'center' },
  categoryText: { fontSize: 12, color: '#f60202ff', marginLeft: 6, fontWeight: '600' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14 },
  statusText: { fontSize: 12, fontWeight: '700', marginLeft: 4 },
  promiseTitle: { fontSize: 17, fontWeight: 'bold', color: '#1F2937', marginBottom: 6, lineHeight: 24 },
  promiseDescription: { fontSize: 14, color: '#6B7280', lineHeight: 20, marginBottom: 12 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  progressBar: { flex: 1, height: 10, backgroundColor: '#E5E7EB', borderRadius: 5, overflow: 'hidden', marginRight: 8 },
  progressFill: { height: '100%', borderRadius: 5 },
  progressText: { fontSize: 13, fontWeight: '700', color: '#1F2937', width: 45 },
  metricsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  metric: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginRight: 8, marginBottom: 6 },
  metricText: { fontSize: 12, fontWeight: '600', color: '#1F2937', marginLeft: 6 },
  achievementBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', padding: 10, borderRadius: 8, marginBottom: 12 },
  achievementText: { fontSize: 12, color: '#92400E', marginLeft: 6, flex: 1, fontWeight: '500' },
  promiseFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  promiseInfo: { flexDirection: 'row', alignItems: 'center' },
  infoText: { fontSize: 12, color: '#6B7280', marginLeft: 4, fontWeight: '500' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, color: '#6B7280', marginTop: 16, fontWeight: '600' },
  emptySubtext: { fontSize: 14, color: '#9CA3AF', marginTop: 8 },
  footerNote: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', padding: 16, borderRadius: 12, marginTop: 8, marginBottom: 20 },
  footerText: { fontSize: 12, color: '#1E40AF', marginLeft: 8, flex: 1, lineHeight: 18 },
});
