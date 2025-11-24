// src/components/HistoricalChart.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const HistoricalChart = ({ title, data, color = '#006B3F' }) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.noData}>
          <Text style={styles.noDataText}>No historical data available</Text>
        </View>
      </View>
    );
  }

  const chartData = {
    labels: data.map(item => {
      // Shorten date labels for better display
      const date = item.date;
      if (date.includes('Q')) return date.replace('202', "'2"); // Q1 '23
      return date.split(' ')[0]; // Jan, Feb, etc.
    }),
    datasets: [
      {
        data: data.map(item => item.value),
        color: () => color,
        strokeWidth: 2,
      },
    ],
    legend: [title]
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 107, 63, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '3',
      strokeWidth: '1',
      stroke: color
    },
    propsForLabels: {
      fontSize: 10
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <LineChart
        data={chartData}
        width={width - 48}
        height={160}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withVerticalLines={false}
        withHorizontalLines={true}
        withInnerLines={false}
        withOuterLines={false}
        fromZero={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 8,
    marginVertical: 4,
  },
  noData: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: '#999',
    fontSize: 14,
  },
});

export default HistoricalChart;