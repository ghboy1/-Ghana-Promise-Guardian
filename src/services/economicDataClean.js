// src/services/economicDataClean.js
/**
 * Clean economic data service used while original economicData.js is being repaired.
 * Provides the same API surface: getInflationData, getGDPGrowthData, getExchangeRateData,
 * getUnemploymentData, getPublicDebtData, getAllEconomicIndicators, getHistoricalData, DATA_SOURCES
 */

import { collection, addDoc, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';

// Simple in-memory mock for tests/runtime when network not available
const MOCK = {
  inflation: { indicator: 'inflation', value: 23.2, change: -0.3, date: '2024' },
  gdp_growth: { indicator: 'gdp_growth', value: 2.9, change: -0.3, date: '2024' },
  usd_ghs: { indicator: 'usd_ghs', value: 15.85, change: 0.13, date: '2024-10-01' },
  unemployment: { indicator: 'unemployment', value: 14.7, change: 1.3, date: '2024' },
  public_debt: { indicator: 'public_debt', value: 88.1, change: 3.6, date: '2024' }
};

export const DATA_SOURCES = {
  GSS: { name: 'GSS', url: 'https://statsghana.gov.gh' },
  BOG: { name: 'BoG', url: 'https://www.bog.gov.gh' },
  MOFEP: { name: 'MoFEP', url: 'https://mofep.gov.gh' }
};

export const getInflationData = async () => MOCK.inflation;
export const getGDPGrowthData = async () => MOCK.gdp_growth;
export const getExchangeRateData = async () => MOCK.usd_ghs;
export const getUnemploymentData = async () => MOCK.unemployment;
export const getPublicDebtData = async () => MOCK.public_debt;

export const getAllEconomicIndicators = async () => ({
  inflation: MOCK.inflation,
  gdp: MOCK.gdp_growth,
  exchange: MOCK.usd_ghs,
  unemployment: MOCK.unemployment,
  debt: MOCK.public_debt,
  lastUpdated: new Date().toISOString()
});

export const saveEconomicIndicator = async (indicatorData) => {
  try {
    const docRef = await addDoc(collection(db, 'economicData'), { ...indicatorData, savedAt: new Date().toISOString() });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getHistoricalData = async (indicatorId, limitCount = 12) => [];

export default {
  getInflationData,
  getGDPGrowthData,
  getExchangeRateData,
  getUnemploymentData,
  getPublicDebtData,
  getAllEconomicIndicators,
  saveEconomicIndicator,
  getHistoricalData,
  DATA_SOURCES
};
