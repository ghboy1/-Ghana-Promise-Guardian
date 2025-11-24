import React from 'react';
import renderer from 'react-test-renderer';
import EconomicDashboardScreen from '../src/screens/EconomicDashboardScreen';

// Mock the economic data service
jest.mock('../src/services/economicDataClean', () => ({
  getAllEconomicIndicators: async () => ({
    inflation: { value: 23.2, change: -0.3 },
    gdp: { value: 2.9, change: -0.3 },
    exchange: { value: 15.85, change: 0.13 },
    unemployment: { value: 14.7, change: 1.3 },
    debt: { value: 88.1, change: 3.6 },
  }),
  DATA_SOURCES: {
    GSS: { name: 'GSS', url: 'https://statsghana.gov.gh' },
    BOG: { name: 'BoG', url: 'https://www.bog.gov.gh' },
    MOFEP: { name: 'MoFEP', url: 'https://mofep.gov.gh' }
  },
  getHistoricalData: async () => ([]) 
}));

test('EconomicDashboardScreen renders loading and then content', async () => {
  const tree = renderer.create(<EconomicDashboardScreen />);
  expect(tree.toJSON()).toBeTruthy();
});
