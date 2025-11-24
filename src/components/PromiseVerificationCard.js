// src/components/PromiseVerificationCard.js
/**
 * Promise Verification Card
 * Shows real-time economic data linked to specific promises
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  getInflationData,
  getGDPGrowthData,
  getExchangeRateData,
  getUnemploymentData,
  getPublicDebtData,
} from '../services/economicDataClean';

export default function PromiseVerificationCard({ promise }) {
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVerificationData();
  }, [promise]);

  const loadVerificationData = async () => {
    try {
      setLoading(true);
      
      // Map promise to relevant indicator
      const indicator = detectRelevantIndicator(promise);
      
      if (indicator) {
        const data = await fetchIndicatorData(indicator);
        setVerification({
          indicator,
          data,
          status: evaluatePromiseStatus(promise, data),
        });
      }
    } catch (error) {
      console.error('Error loading verification:', error);
    } finally {
      setLoading(false);
    }
  };

  const detectRelevantIndicator = (promise) => {
    const title = promise.title.toLowerCase();
    const description = promise.description.toLowerCase();
    const combined = title + ' ' + description;

    // Map keywords to indicators
    if (combined.includes('inflation') || combined.includes('price')) {
      return 'inflation';
    }
    if (combined.includes('gdp') || combined.includes('growth') || combined.includes('economy')) {
      return 'gdp';
    }
    if (combined.includes('cedi') || combined.includes('exchange') || combined.includes('dollar')) {
      return 'exchange';
    }
    if (combined.includes('unemployment') || combined.includes('jobs') || combined.includes('employment')) {
      return 'unemployment';
    }
    if (combined.includes('debt') || combined.includes('borrow')) {
      return 'debt';
    }

    return null;
  };

  const fetchIndicatorData = async (indicator) => {
    switch (indicator) {
      case 'inflation':
        return await getInflationData();
      case 'gdp':
        return await getGDPGrowthData();
      case 'exchange':
        return await getExchangeRateData();
      case 'unemployment':
        return await getUnemploymentData();
      case 'debt':
        return await getPublicDebtData();
      default:
        return null;
    }
  };

  const evaluatePromiseStatus = (promise, data) => {
    if (!data) return 'unknown';

    // Example: For inflation reduction promise
    if (data.indicator === 'inflation') {
      // If inflation is decreasing, promise is on track
      if (data.change < 0) {
        return 'on-track';
      } else {
        return 'off-track';
      }
    }

    // Example: For GDP growth promise
    if (data.indicator === 'gdp_growth') {
      // If GDP is growing
      if (data.value > 0 && data.change >= 0) {
        return 'on-track';
      } else {
        return 'off-track';
      }
    }

    // Add more evaluation logic for other indicators
    return 'monitoring';
  };

  const getIndicatorIcon = (indicator) => {
    const icons = {
      inflation: 'flame',
      gdp: 'trending-up',
      exchange: 'cash',
      unemployment: 'people',
      debt: 'warning',
    };
    return icons[indicator] || 'stats-chart';
  };

  const getIndicatorName = (indicator) => {
    const names = {
      inflation: 'Inflation Rate',
      gdp: 'GDP Growth',
      exchange: 'Exchange Rate',
      unemployment: 'Unemployment',
      debt: 'Public Debt',
    };
    return names[indicator] || 'Economic Indicator';
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'on-track':
        return {
          color: '#10B981',
          icon: 'checkmark-circle',
          text: 'On Track',
          bg: '#D1FAE5',
        };
      case 'off-track':
        return {
          color: '#EF4444',
          icon: 'close-circle',
          text: 'Off Track',
          bg: '#FEE2E2',
        };
      case 'monitoring':
        return {
          color: '#F59E0B',
          icon: 'eye',
          text: 'Monitoring',
          bg: '#FEF3C7',
        };
      default:
        return {
          color: '#6B7280',
          icon: 'help-circle',
          text: 'No Data',
          bg: '#F3F4F6',
        };
    }
  };

  if (!verification || !verification.indicator) {
    return null; // Don't show card if promise not linked to data
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#DC2626" />
        <Text style={styles.loadingText}>Verifying with real-time data...</Text>
      </View>
    );
  }

  const statusInfo = getStatusInfo(verification.status);
  const { data } = verification;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[statusInfo.bg, statusInfo.bg + 'CC']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconContainer, { backgroundColor: statusInfo.color + '30' }]}>
              <Ionicons name={getIndicatorIcon(verification.indicator)} size={24} color={statusInfo.color} />
            </View>
            <View>
              <Text style={styles.verificationLabel}>Real-Time Verification</Text>
              <Text style={styles.indicatorName}>{getIndicatorName(verification.indicator)}</Text>
            </View>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
            <Ionicons name={statusInfo.icon} size={16} color="white" />
            <Text style={styles.statusText}>{statusInfo.text}</Text>
          </View>
        </View>

        {/* Data Display */}
        {data && (
          <View style={styles.dataContainer}>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Current Value</Text>
              <View style={styles.valueContainer}>
                <Text style={styles.dataValue}>{data.value?.toFixed(2)}</Text>
                <Text style={styles.dataUnit}>{data.indicator === 'usd_ghs' ? 'GHS' : '%'}</Text>
              </View>
            </View>

            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Change</Text>
              <View style={styles.changeContainer}>
                <Ionicons
                  name={data.change >= 0 ? 'trending-up' : 'trending-down'}
                  size={16}
                  color={data.change >= 0 ? '#EF4444' : '#10B981'}
                />
                <Text style={[
                  styles.changeValue,
                  { color: data.change >= 0 ? '#EF4444' : '#10B981' }
                ]}>
                  {data.change >= 0 ? '+' : ''}{data.change?.toFixed(2)}%
                </Text>
              </View>
            </View>

            {/* Source */}
            <View style={styles.sourceRow}>
              <Ionicons name="shield-checkmark" size={16} color="#10B981" />
              <Text style={styles.sourceText}>
                Source: {data.source}
              </Text>
            </View>

            {/* Last Updated */}
            <View style={styles.updateRow}>
              <Ionicons name="time" size={14} color="#6B7280" />
              <Text style={styles.updateText}>
                Updated: {new Date(data.date).toLocaleDateString()}
              </Text>
            </View>
          </View>
        )}

        {/* Interpretation */}
        <View style={styles.interpretation}>
          <Text style={styles.interpretationTitle}>What this means:</Text>
          <Text style={styles.interpretationText}>
            {getInterpretation(verification)}
          </Text>
        </View>

        {/* View Details Button */}
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>View Historical Data</Text>
          <Ionicons name="chevron-forward" size={20} color={statusInfo.color} />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

function getInterpretation(verification) {
  const { indicator, data, status } = verification;

  if (indicator === 'inflation') {
    if (status === 'on-track') {
      return `Inflation is decreasing (${data.change.toFixed(2)}%), indicating progress toward economic stability.`;
    } else {
      return `Inflation is increasing (${data.change.toFixed(2)}%), suggesting the economy needs attention.`;
    }
  }

  if (indicator === 'gdp') {
    if (status === 'on-track') {
      return `GDP is growing at ${data.value.toFixed(1)}%, showing positive economic momentum.`;
    } else {
      return `GDP growth at ${data.value.toFixed(1)}% indicates economic challenges.`;
    }
  }

  if (indicator === 'exchange') {
    if (data.change < 0) {
      return `The cedi has strengthened against the dollar, a positive sign for the economy.`;
    } else {
      return `The cedi has weakened (${data.change.toFixed(2)}%), impacting purchasing power.`;
    }
  }

  if (indicator === 'unemployment') {
    if (data.change < 0) {
      return `Unemployment is decreasing, indicating job creation progress.`;
    } else {
      return `Unemployment has increased by ${data.change.toFixed(1)}%, requiring policy attention.`;
    }
  }

  if (indicator === 'debt') {
    if (data.change < 0) {
      return `Public debt is decreasing as a percentage of GDP, showing fiscal improvement.`;
    } else {
      return `Public debt has increased to ${data.value.toFixed(1)}% of GDP, raising sustainability concerns.`;
    }
  }

  return 'Monitoring economic indicators for progress tracking.';
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  gradient: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  verificationLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  indicatorName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'white',
  },
  dataContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dataLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  dataValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginRight: 4,
  },
  dataUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  changeValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  sourceText: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '600',
  },
  updateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  updateText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  interpretation: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  interpretationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  interpretationText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 21,
    fontWeight: '500',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  detailsButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
});