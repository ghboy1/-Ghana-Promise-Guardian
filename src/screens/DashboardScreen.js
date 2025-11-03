// src/screens/DashboardScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPromises } from '../services/firestore';

export default function DashboardScreen() {
  const [promises, setPromises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, fulfilled, progress, broken

  // Sample data (replace with Firebase data)
  const samplePromises = [
    {
      id: 1,
      title: 'Free Senior High School (SHS) Policy',
      description: 'Provide free secondary education for all Ghanaian students',
      status: 'fulfilled',
      category: 'Education',
      impact: 'High',
      datePromised: '2017-01-07',
      progress: 100,
      region: 'National',
    },
    {
      id: 2,
      title: 'One District, One Factory (1D1F)',
      description: 'Establish at least one factory in each district',
      status: 'progress',
      category: 'Economy',
      impact: 'High',
      datePromised: '2017-01-07',
      progress: 65,
      region: 'National',
      factoriesBuilt: 76,
      target: 260,
    },
    {
      id: 3,
      title: 'Digital Ghana Agenda',
      description: 'Transform Ghana into a digital economy',
      status: 'progress',
      category: 'Technology',
      impact: 'High',
      datePromised: '2018-03-15',
      progress: 75,
      region: 'National',
    },
    {
      id: 4,
      title: 'Planting for Food and Jobs',
      description: 'Boost agricultural production and create jobs',
      status: 'fulfilled',
      category: 'Agriculture',
      impact: 'High',
      datePromised: '2017-04-19',
      progress: 100,
      region: 'National',
    },
    {
      id: 5,
      title: 'National Health Insurance',
      description: 'Universal healthcare coverage for all citizens',
      status: 'progress',
      category: 'Health',
      impact: 'High',
      datePromised: '2008-01-01',
      progress: 60,
      region: 'National',
    },
    {
      id: 6,
      title: 'Rural Electrification Program',
      description: 'Provide electricity to rural communities',
      status: 'progress',
      category: 'Infrastructure',
      impact: 'Medium',
      datePromised: '2020-06-10',
      progress: 45,
      region: 'Northern Region',
    },
    {
      id: 7,
      title: '$1 Million Per Constituency',
      description: 'Infrastructure development fund for each constituency',
      status: 'broken',
      category: 'Infrastructure',
      impact: 'Medium',
      datePromised: '2020-12-01',
      progress: 15,
      region: 'National',
    },
  ];

  useEffect(() => {
    loadPromises();
  }, []);

  const loadPromises = async () => {
    setLoading(true);
    try {
      // Try to load from Firestore
      // const data = await getPromises();
      // setPromises(data);
      
      // For now, use sample data
      setPromises(samplePromises);
    } catch (error) {
      console.error('Error loading promises:', error);
      setPromises(samplePromises);
    }
    setLoading(false);
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

  const FilterButton = ({ value, label, count }) => (
    <TouchableOpacity
      style={[styles.filterBtn, filter === value && styles.filterBtnActive]}
      onPress={() => setFilter(value)}
    >
      <Text style={[styles.filterText, filter === value && styles.filterTextActive]}>
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );

  const PromiseCard = ({ promise }) => (
    <TouchableOpacity
      style={styles.promiseCard}
      onPress={() => Alert.alert(promise.title, promise.description)}
    >
      <View style={styles.promiseHeader}>
        <View style={styles.promiseCategory}>
          <Ionicons name="pricetag" size={14} color="#6B7280" />
          <Text style={styles.categoryText}>{promise.category}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(promise.status) + '20' }]}>
          <Ionicons name={getStatusIcon(promise.status)} size={16} color={getStatusColor(promise.status)} />
          <Text style={[styles.statusText, { color: getStatusColor(promise.status) }]}>
            {getStatusLabel(promise.status)}
          </Text>
        </View>
      </View>

      <Text style={styles.promiseTitle}>{promise.title}</Text>
      <Text style={styles.promiseDescription} numberOfLines={2}>{promise.description}</Text>

      {/* Progress Bar */}
      {promise.status === 'progress' && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${promise.progress}%`, backgroundColor: getStatusColor(promise.status) }]} />
          </View>
          <Text style={styles.progressText}>{promise.progress}%</Text>
        </View>
      )}

      {/* Additional Info */}
      {promise.factoriesBuilt && (
        <Text style={styles.additionalInfo}>
          {promise.factoriesBuilt} of {promise.target} factories built
        </Text>
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
  );

  return (
    <View style={styles.container}>
      {/* Header Stats */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>National Promises</Text>
        <Text style={styles.headerSubtitle}>Track government commitments</Text>
      </View>

      {/* Filter Buttons */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        <FilterButton
          value="all"
          label="All"
          count={promises.length}
        />
        <FilterButton
          value="fulfilled"
          label="Fulfilled"
          count={promises.filter(p => p.status === 'fulfilled').length}
        />
        <FilterButton
          value="progress"
          label="In Progress"
          count={promises.filter(p => p.status === 'progress').length}
        />
        <FilterButton
          value="broken"
          label="Broken"
          count={promises.filter(p => p.status === 'broken').length}
        />
      </ScrollView>

      {/* Promises List */}
      <ScrollView
        style={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadPromises} colors={['#DC2626']} />
        }
      >
        {filteredPromises.length > 0 ? (
          filteredPromises.map(promise => (
            <PromiseCard key={promise.id} promise={promise} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="folder-open-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>No promises found in this category</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },

  // Filters
  filterContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterBtnActive: {
    backgroundColor: '#DC2626',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTextActive: {
    color: 'white',
  },

  // List
  listContainer: {
    flex: 1,
    padding: 16,
  },
  promiseCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  promiseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  promiseCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  promiseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  promiseDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },

  // Progress
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    width: 40,
  },
  additionalInfo: {
    fontSize: 13,
    color: '#059669',
    marginBottom: 8,
    fontWeight: '500',
  },

  // Footer
  promiseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  promiseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 16,
  },
});