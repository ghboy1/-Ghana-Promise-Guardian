// src/screens/EconomicDashboardScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getAllEconomicIndicators, DATA_SOURCES } from '../services/economicDataClean';

const { width } = Dimensions.get('window');

export default function EconomicDashboardScreen({ navigation }) {
  const [indicators, setIndicators] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    loadData();
    animateIn();
  }, []);

  const animateIn = () => {
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
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAllEconomicIndicators();
      setIndicators(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading indicators:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const IndicatorCard = ({ icon, title, value, unit, change, color, source }) => {
    const isPositive = change >= 0;
    // For inflation, debt, and unemployment, positive change is bad
    const changeColor = title.includes('Inflation') || title.includes('Debt') || title.includes('Unemployment')
      ? (isPositive ? '#EF4444' : '#10B981')
      : (isPositive ? '#10B981' : '#EF4444');

    return (
      <Animated.View
        style={[
          styles.indicatorCard,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <LinearGradient
          colors={['white', '#F9FAFB']}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
              <Ionicons name={icon} size={28} color={color} />
            </View>
            <View style={styles.changeContainer}>
              <Ionicons
                name={isPositive ? 'trending-up' : 'trending-down'}
                size={20}
                color={changeColor}
              />
              <Text style={[styles.changeText, { color: changeColor }]}>
                {isPositive ? '+' : ''}{change}%
              </Text>
            </View>
          </View>

          <Text style={styles.indicatorTitle}>{title}</Text>
          
          <View style={styles.valueRow}>
            <Text style={styles.indicatorValue}>{value}</Text>
            <Text style={styles.indicatorUnit}>{unit}</Text>
          </View>

          <View style={styles.sourceContainer}>
            <Ionicons name="shield-checkmark" size={14} color="#10B981" />
            <Text style={styles.sourceText}>{source}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  const DataSourceCard = ({ name, url, indicators, frequency }) => (
    <View style={styles.sourceCard}>
      <View style={styles.sourceHeader}>
        <Ionicons name="globe" size={24} color="#3B82F6" />
        <View style={styles.sourceInfo}>
          <Text style={styles.sourceName}>{name}</Text>
          <Text style={styles.sourceFrequency}>{frequency} updates</Text>
        </View>
      </View>
      <View style={styles.indicatorTags}>
        {indicators.map((indicator, index) => (
          <View key={index} style={styles.indicatorTag}>
            <Text style={styles.tagText}>{indicator}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.sourceLink}>
        <Text style={styles.linkText}>View Source</Text>
        <Ionicons name="open-outline" size={16} color="#3B82F6" />
      </TouchableOpacity>
    </View>
  );

  if (loading && !indicators) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text style={styles.loadingText}>Loading economic data...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#DC2626']} />
      }
    >
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
        
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Ionicons name="stats-chart" size={48} color="white" />
          </View>
          <Text style={styles.headerTitle}>Economic Dashboard</Text>
          <Text style={styles.headerSubtitle}>Real-time indicators from official sources</Text>
        </View>

        {lastUpdated && (
          <View style={styles.updateBadge}>
            <Ionicons name="time" size={14} color="white" />
            <Text style={styles.updateText}>
              Updated {new Date(lastUpdated).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        )}
      </LinearGradient>

      {/* Key Indicators */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEmoji}>📊</Text>
          <Text style={styles.sectionTitle}>Key Economic Indicators</Text>
        </View>

        <View style={styles.indicatorsGrid}>
          {indicators?.inflation && (
            <IndicatorCard
              icon="flame"
              title="Inflation Rate"
              value={indicators.inflation.value}
              unit="%"
              change={indicators.inflation.change}
              color="#EF4444"
              source="GSS"
            />
          )}

          {indicators?.gdp && (
            <IndicatorCard
              icon="trending-up"
              title="GDP Growth"
              value={indicators.gdp.value}
              unit="%"
              change={indicators.gdp.change}
              color="#10B981"
              source="GSS"
            />
          )}

          {indicators?.exchange && (
            <IndicatorCard
              icon="cash"
              title="USD/GHS Rate"
              value={indicators.exchange.value}
              unit="GHS"
              change={indicators.exchange.change}
              color="#F59E0B"
              source="BoG"
            />
          )}

          {indicators?.unemployment && (
            <IndicatorCard
              icon="people"
              title="Unemployment"
              value={indicators.unemployment.value}
              unit="%"
              change={indicators.unemployment.change}
              color="#8B5CF6"
              source="GSS"
            />
          )}

          {indicators?.debt && (
            <IndicatorCard
              icon="warning"
              title="Public Debt"
              value={indicators.debt.value}
              unit="% of GDP"
              change={indicators.debt.change}
              color="#DC2626"
              source="MoFEP"
            />
          )}
        </View>
      </View>

      {/* Data Sources */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEmoji}>🌐</Text>
          <Text style={styles.sectionTitle}>Official Data Sources</Text>
        </View>

        <DataSourceCard
          name={DATA_SOURCES.GSS.name}
          url={DATA_SOURCES.GSS.url}
          indicators={['Inflation', 'GDP', 'Unemployment', 'CPI']}
          frequency="Quarterly"
        />

        <DataSourceCard
          name={DATA_SOURCES.BOG.name}
          url={DATA_SOURCES.BOG.url}
          indicators={['Exchange Rate', 'Interest Rates', 'Foreign Reserves']}
          frequency="Monthly"
        />

        <DataSourceCard
          name={DATA_SOURCES.MOFEP.name}
          url={DATA_SOURCES.MOFEP.url}
          indicators={['Public Debt', 'Budget Deficit', 'Revenue']}
          frequency="Annual"
        />
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Ionicons name="information-circle" size={24} color="#3B82F6" />
        <Text style={styles.infoText}>
          Data is sourced from official government agencies and updated in real-time to provide accurate promise tracking.
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  header: {
    padding: 40,
    paddingTop: 60,
    paddingBottom: 50,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerIcon: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    textAlign: 'center',
  },
  updateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    gap: 6,
  },
  updateText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    padding: 24,
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
  indicatorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  indicatorCard: {
    width: (width - 64) / 2,
    margin: 8,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  indicatorTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  indicatorValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
    marginRight: 4,
  },
  indicatorUnit: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sourceText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  sourceCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sourceInfo: {
    marginLeft: 12,
    flex: 1,
  },
  sourceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  sourceFrequency: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  indicatorTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  indicatorTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
  },
  sourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  linkText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '700',
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 20,
    fontWeight: '500',
  },
});