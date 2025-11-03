// src/screens/MapScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

export default function MapScreen() {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapType, setMapType] = useState('standard');

  // Ghana coordinates
  const GHANA_REGION = {
    latitude: 7.9465,
    longitude: -1.0232,
    latitudeDelta: 8,
    longitudeDelta: 8,
  };

  // Sample markers (replace with Firestore data)
  const markers = [
    {
      id: 1,
      title: 'Accra - Free SHS Implementation',
      description: 'Status: Fulfilled',
      coordinate: { latitude: 5.6037, longitude: -0.1870 },
      type: 'fulfilled',
      category: 'Education',
    },
    {
      id: 2,
      title: 'Kumasi - 1D1F Textile Factory',
      description: 'Status: In Progress (65%)',
      coordinate: { latitude: 6.6885, longitude: -1.6244 },
      type: 'progress',
      category: 'Economy',
    },
    {
      id: 3,
      title: 'Tamale - Rural Clinic Construction',
      description: 'Status: In Progress',
      coordinate: { latitude: 9.4008, longitude: -0.8393 },
      type: 'progress',
      category: 'Health',
    },
    {
      id: 4,
      title: 'Cape Coast - Digital Hub',
      description: 'Status: Fulfilled',
      coordinate: { latitude: 5.1053, longitude: -1.2466 },
      type: 'fulfilled',
      category: 'Technology',
    },
    {
      id: 5,
      title: 'Takoradi - Port Expansion',
      description: 'Status: In Progress',
      coordinate: { latitude: 4.8960, longitude: -1.7535 },
      type: 'progress',
      category: 'Infrastructure',
    },
    {
      id: 6,
      title: 'Sunyani - Agriculture Hub',
      description: 'Status: Fulfilled',
      coordinate: { latitude: 7.3390, longitude: -2.3322 },
      type: 'fulfilled',
      category: 'Agriculture',
    },
    {
      id: 7,
      title: 'Ho - Road Construction Project',
      description: 'Status: Broken Promise',
      coordinate: { latitude: 6.6108, longitude: 0.4709 },
      type: 'broken',
      category: 'Infrastructure',
    },
  ];

  const getMarkerColor = (type) => {
    switch (type) {
      case 'fulfilled': return '#10B981';
      case 'progress': return '#F59E0B';
      case 'broken': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={GHANA_REGION}
        mapType={mapType}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            pinColor={getMarkerColor(marker.type)}
            onPress={() => setSelectedMarker(marker)}
          >
            <View style={[styles.customMarker, { backgroundColor: getMarkerColor(marker.type) }]}>
              <Ionicons name="location" size={24} color="white" />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Map Type Toggle */}
      <View style={styles.mapTypeContainer}>
        <TouchableOpacity
          style={[styles.mapTypeBtn, mapType === 'standard' && styles.mapTypeBtnActive]}
          onPress={() => setMapType('standard')}
        >
          <Text style={[styles.mapTypeText, mapType === 'standard' && styles.mapTypeTextActive]}>
            Standard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.mapTypeBtn, mapType === 'satellite' && styles.mapTypeBtnActive]}
          onPress={() => setMapType('satellite')}
        >
          <Text style={[styles.mapTypeText, mapType === 'satellite' && styles.mapTypeTextActive]}>
            Satellite
          </Text>
        </TouchableOpacity>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
          <Text style={styles.legendText}>Fulfilled</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
          <Text style={styles.legendText}>In Progress</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
          <Text style={styles.legendText}>Broken</Text>
        </View>
      </View>

      {/* Selected Marker Info */}
      {selectedMarker && (
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={[styles.infoDot, { backgroundColor: getMarkerColor(selectedMarker.type) }]} />
            <Text style={styles.infoCategory}>{selectedMarker.category}</Text>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSelectedMarker(null)}
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <Text style={styles.infoTitle}>{selectedMarker.title}</Text>
          <Text style={styles.infoDescription}>{selectedMarker.description}</Text>
          <TouchableOpacity style={styles.detailsBtn}>
            <Text style={styles.detailsBtnText}>View Details</Text>
            <Ionicons name="arrow-forward" size={16} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* Stats Summary */}
      {!selectedMarker && (
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>📍 Ghana Promise Map</Text>
          <Text style={styles.statsText}>{markers.length} promises tracked nationwide</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{markers.filter(m => m.type === 'fulfilled').length}</Text>
              <Text style={styles.statLabel}>Fulfilled</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#F59E0B' }]}>
                {markers.filter(m => m.type === 'progress').length}
              </Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#EF4444' }]}>
                {markers.filter(m => m.type === 'broken').length}
              </Text>
              <Text style={styles.statLabel}>Broken</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  customMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  // Map Type
  mapTypeContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  mapTypeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  mapTypeBtnActive: {
    backgroundColor: '#DC2626',
  },
  mapTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  mapTypeTextActive: {
    color: 'white',
  },

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
    color: '#10B981',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
});