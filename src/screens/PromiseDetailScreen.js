// src/screens/PromiseDetailScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PromiseDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { promise } = route.params;

  if (!promise) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No promise data available</Text>
      </SafeAreaView>
    );
  }

  const handleReportBreach = () => {
    Alert.alert(
      "Report Breach",
      "Would you like to report a breach of this promise?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Report", onPress: () => navigation.navigate('ReportBreach', { promise }) }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>{promise.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(promise.status) }]}>
            <Text style={styles.statusText}>{promise.status?.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{promise.description}</Text>
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>{promise.category}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Impact</Text>
            <Text style={styles.detailValue}>{promise.impact}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Date Promised</Text>
            <Text style={styles.detailValue}>{promise.datePromised}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Region</Text>
            <Text style={styles.detailValue}>{promise.region}</Text>
          </View>
        </View>

        {promise.progress !== undefined && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Progress</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${promise.progress}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{promise.progress}% Complete</Text>
          </View>
        )}

        <TouchableOpacity style={styles.reportButton} onPress={handleReportBreach}>
          <Text style={styles.reportButtonText}>Report Breach</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'fulfilled': return '#4CAF50';
    case 'progress': return '#2196F3';
    case 'broken': return '#F44336';
    case 'partial': return '#FF9800';
    default: return '#9E9E9E';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  detailItem: {
    width: '48%',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  reportButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PromiseDetailScreen;