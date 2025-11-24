// src/services/firestore-compat.js
import { db, firebase } from '../firebase';

const PROMISES_COLLECTION = 'promises';
const REPORTS_COLLECTION = 'reports';

// ==================== PROMISE QUERIES ====================

/**
 * Get all promises - COMPAT VERSION
 */
export const getAllPromisesFromDB = async () => {
  try {
    console.log('Firestore: Attempting to load promises...');
    
    if (!db) {
      console.warn('Firestore: db not available');
      return [];
    }

    const snapshot = await db.collection(PROMISES_COLLECTION).get();
    
    const promises = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log('Firestore: Loaded', promises.length, 'promises');
    return promises;
  } catch (error) {
    console.error('Firestore: Error getting promises:', error);
    return []; // Always return an array, never undefined
  }
};

/**
 * Get promises by category
 */
export const getPromisesByCategory = async (category) => {
  try {
    const snapshot = await db.collection(PROMISES_COLLECTION)
      .where('category', '==', category)
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching promises by category:', error);
    return [];
  }
};

/**
 * Get promises by party
 */
export const getPromisesByParty = async (party) => {
  try {
    const snapshot = await db.collection(PROMISES_COLLECTION)
      .where('party', '==', party)
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching promises by party:', error);
    return [];
  }
};

/**
 * Submit a breach report
 */
export const submitReport = async (reportData) => {
  try {
    const report = {
      ...reportData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      status: 'pending',
      verified: false,
      upvotes: 0,
      downvotes: 0,
    };
    
    const docRef = await db.collection(REPORTS_COLLECTION).add(report);
    console.log('✅ Report submitted:', docRef.id);
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('❌ Error submitting report:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get database statistics
 */
export const getDatabaseStats = async () => {
  try {
    const [promisesSnapshot, reportsSnapshot] = await Promise.all([
      db.collection(PROMISES_COLLECTION).get(),
      db.collection(REPORTS_COLLECTION).get()
    ]);
    
    const promises = promisesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Calculate stats
    const stats = {
      totalPromises: promises.length,
      totalReports: reportsSnapshot.docs.length,
      byParty: {
        NDC: promises.filter(p => p.party === 'NDC').length,
        NPP: promises.filter(p => p.party === 'NPP').length,
      },
      byStatus: {
        pending: promises.filter(p => p.status === 'pending').length,
        progress: promises.filter(p => p.status === 'progress').length,
        fulfilled: promises.filter(p => p.status === 'fulfilled').length,
        broken: promises.filter(p => p.status === 'broken').length,
        partial: promises.filter(p => p.status === 'partial').length,
      },
      byCategory: {
        economy: promises.filter(p => p.category === 'economy').length,
        education: promises.filter(p => p.category === 'education').length,
        health: promises.filter(p => p.category === 'health').length,
        infrastructure: promises.filter(p => p.category === 'infrastructure').length,
        agriculture: promises.filter(p => p.category === 'agriculture').length,
        governance: promises.filter(p => p.category === 'governance').length,
        energy: promises.filter(p => p.category === 'energy').length,
      },
      flagshipPromises: promises.filter(p => p.priority === 'flagship').length,
    };
    
    return stats;
  } catch (error) {
    console.error('Error getting stats:', error);
    return null;
  }
};

export default {
  getAllPromisesFromDB,
  getPromisesByCategory,
  getPromisesByParty,
  submitReport,
  getDatabaseStats,
};