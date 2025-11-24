import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MapScreen() {
  const [selectedMarker] = useState(null); // Always null on web (no interaction)
  const [mapType] = useState('standard'); // Unused on web

  const markers = [
    { id: 1, title: 'Accra - Free SHS Implementation', description: 'Status: Fulfilled', coordinate: { latitude: 5.6037, longitude: -0.1870 }, type: 'fulfilled', category: 'Education' },
    { id: 2, title: 'Kumasi - 1D1F Textile Factory', description: 'Status: In Progress (65%)', coordinate: { latitude: 6.6885, longitude: -1.6244 }, type: 'progress', category: 'Economy' },
    { id: 3, title: 'Tamale - Rural Clinic Construction', description: 'Status: In Progress', coordinate: { latitude: 9.4008, longitude: -0.8393 }, type: 'progress', category: 'Health' },
    { id: 4, title: 'Cape Coast - Digital Hub', description: 'Status: Fulfilled', coordinate: { latitude: 5.1053, longitude: -1.2466 }, type: 'fulfilled', category: 'Technology' },
    { id: 5, title: 'Takoradi - Port Expansion', description: 'Status: In Progress', coordinate: { latitude: 4.8960, longitude: -1.7535 }, type: 'progress', category: 'Infrastructure' },
    { id: 6, title: 'Sunyani - Agriculture Hub', description: 'Status: Fulfilled', coordinate: { latitude: 7.3390, longitude: -2.3322 }, type: 'fulfilled', category: 'Agriculture' },
    { id: 7, title: 'Ho - Road Construction Project', description: 'Status: Broken Promise', coordinate: { latitude: 6.6108, longitude: 0.4709 }, type: 'broken', category: 'Infrastructure' },
  ];

  const getMarkerColor = (type) => {
    switch (type) {
      case 'fulfilled': return '#10B981';
      case 'progress': return '#F59E0B';
      case 'broken': return '#EF4444';
      default: return '#6B7280';
    }
  };

  // Hardcoded stats based on your markers data
  const stats = { fulfilled: 3, progress: 3, broken: 1 };

  return (
    <View style={styles.container}>
      <View style={[styles.map, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="map-outline" size={64} color="#6B7280" />
        <Text style={{ fontSize: 16, color: '#6B7280', textAlign: 'center', marginTop: 8 }}>
          Map view is not available on web.
        </Text>
        <Text style={{ fontSize: 14, color: '#9CA3AF', textAlign: 'center', marginTop: 4 }}>
          Use the mobile app for interactive mapping of promises across Ghana.
        </Text>
      </View>

      {/* Legend (static on web) */}
      <View style={styles.legend}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#1F2937' }}>Legend</Text>
        {Object.entries({ fulfilled: 'Fulfilled', progress: 'In Progress', broken: 'Broken' }).map(([type, label]) => (
          <View key={type} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: getMarkerColor(type) }]} />
            <Text style={styles.legendText}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Info Card (hidden on web since no selection) */}
      {selectedMarker && (
        <View style={styles.infoCard}>
          {/* Your existing info card JSX here */}
        </View>
      )}

      {/* Stats Card (static on web) */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Promise Statistics</Text>
        <Text style={styles.statsText}>Overview of tracked promises across Ghana</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#10B981' }]}>{stats.fulfilled}</Text>
            <Text style={styles.statLabel}>Fulfilled</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#F59E0B' }]}>{stats.progress}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#EF4444' }]}>{stats.broken}</Text>
            <Text style={styles.statLabel}>Broken</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject, backgroundColor: '#F3F4F6' },
  // Legend
  legend: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },

  // Info Card
  infoCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  infoCategory: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  closeBtn: {
    padding: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  detailsBtn: {
    flexDirection: 'row',
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },

  // Stats Card
  statsCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statsText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
});