// src/services/firestore.js
import { 
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { NDC_2024_PROMISES, NPP_2016_PROMISES, ALL_MANIFESTO_PROMISES } from '../data/manifestoData';

const PROMISES_COLLECTION = 'promises';
const REPORTS_COLLECTION = 'reports';

// ==================== PROMISE SEEDING ====================

/**
 * Seed all manifesto promises to Firestore
 */
export const seedAllPromises = async () => {
  try {
    console.log('🌱 Starting to seed promises...');
    
    const promises = ALL_MANIFESTO_PROMISES;
    let seededCount = 0;
    
    // Process in smaller batches to avoid Firestore limits
    const batchSize = 500;
    for (let i = 0; i < promises.length; i += batchSize) {
      const batch = writeBatch(db);
      const batchPromises = promises.slice(i, i + batchSize);
      
      for (const promise of batchPromises) {
        const docRef = doc(collection(db, PROMISES_COLLECTION));
        
        // Add metadata
        const promiseWithMetadata = {
          ...promise,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          views: 0,
          reports: 0,
          likes: 0,
        };
        
        batch.set(docRef, promiseWithMetadata);
        seededCount++;
      }
      
      await batch.commit();
      console.log(`✅ Committed batch with ${batchPromises.length} promises`);
    }
    
    console.log(`✅ Successfully seeded ${seededCount} promises!`);
    return { success: true, count: seededCount };
  } catch (error) {
    console.error('❌ Error seeding promises:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Seed only NDC 2024 promises
 */
export const seedNDC2024Promises = async () => {
  try {
    console.log('🌱 Seeding NDC 2024 promises...');
    
    const batch = writeBatch(db);
    const promisesRef = collection(db, PROMISES_COLLECTION);
    
    for (const promise of NDC_2024_PROMISES) {
      const docRef = doc(promisesRef);
      batch.set(docRef, {
        ...promise,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        views: 0,
        reports: 0,
        likes: 0,
      });
    }
    
    await batch.commit();
    console.log(`✅ Seeded ${NDC_2024_PROMISES.length} NDC 2024 promises!`);
    return { success: true, count: NDC_2024_PROMISES.length };
  } catch (error) {
    console.error('❌ Error seeding NDC promises:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Seed only NPP 2016 promises
 */
export const seedNPP2016Promises = async () => {
  try {
    console.log('🌱 Seeding NPP 2016 promises...');
    
    const batch = writeBatch(db);
    const promisesRef = collection(db, PROMISES_COLLECTION);
    
    for (const promise of NPP_2016_PROMISES) {
      const docRef = doc(promisesRef);
      batch.set(docRef, {
        ...promise,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        views: 0,
        reports: 0,
        likes: 0,
      });
    }
    
    await batch.commit();
    console.log(`✅ Seeded ${NPP_2016_PROMISES.length} NPP 2016 promises!`);
    return { success: true, count: NPP_2016_PROMISES.length };
  } catch (error) {
    console.error('❌ Error seeding NPP promises:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Clear all promises from database
 */
export const clearAllPromises = async () => {
  try {
    console.log('🗑️  Clearing all promises...');
    
    const promisesRef = collection(db, PROMISES_COLLECTION);
    const snapshot = await getDocs(promisesRef);
    
    // Process in batches to avoid Firestore limits
    const batchSize = 500;
    for (let i = 0; i < snapshot.docs.length; i += batchSize) {
      const batch = writeBatch(db);
      const batchDocs = snapshot.docs.slice(i, i + batchSize);
      
      batchDocs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`✅ Cleared batch of ${batchDocs.length} promises`);
    }
    
    console.log(`✅ Cleared ${snapshot.docs.length} promises total`);
    return { success: true, count: snapshot.docs.length };
  } catch (error) {
    console.error('❌ Error clearing promises:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Re-seed (clear and seed fresh)
 */
export const reseedAllPromises = async () => {
  try {
    console.log('🔄 Re-seeding all promises...');
    
    // Clear existing
    const clearResult = await clearAllPromises();
    if (!clearResult.success) {
      throw new Error('Failed to clear promises: ' + clearResult.error);
    }
    
    // Seed fresh
    const seedResult = await seedAllPromises();
    
    console.log('✅ Re-seeding complete!');
    return seedResult;
  } catch (error) {
    console.error('❌ Error re-seeding:', error);
    return { success: false, error: error.message };
  }
};

// ==================== PROMISE QUERIES ====================

/**
 * Get all promises - FIXED VERSION
 */
export const getAllPromisesFromDB = async () => {
  try {
    const promisesRef = collection(db, PROMISES_COLLECTION);
    const snapshot = await getDocs(promisesRef);
    
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
    const promisesRef = collection(db, PROMISES_COLLECTION);
    const q = query(
      promisesRef,
      where('category', '==', category)
    );
    
    const snapshot = await getDocs(q);
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
    const promisesRef = collection(db, PROMISES_COLLECTION);
    const q = query(
      promisesRef,
      where('party', '==', party)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching promises by party:', error);
    return [];
  }
};

/**
 * Get promises by status
 */
export const getPromisesByStatus = async (status) => {
  try {
    const promisesRef = collection(db, PROMISES_COLLECTION);
    const q = query(
      promisesRef,
      where('status', '==', status)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching promises by status:', error);
    return [];
  }
};

/**
 * Get flagship promises
 */
export const getFlagshipPromises = async () => {
  try {
    const promisesRef = collection(db, PROMISES_COLLECTION);
    const q = query(
      promisesRef,
      where('priority', '==', 'flagship')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching flagship promises:', error);
    return [];
  }
};

/**
 * Search promises by keyword
 */
export const searchPromises = async (keyword) => {
  try {
    const promises = await getAllPromisesFromDB();
    
    const lowerKeyword = keyword.toLowerCase();
    return promises.filter(p =>
      p.title?.toLowerCase().includes(lowerKeyword) ||
      p.description?.toLowerCase().includes(lowerKeyword) ||
      p.category?.toLowerCase().includes(lowerKeyword)
    );
  } catch (error) {
    console.error('Error searching promises:', error);
    return [];
  }
};

// ==================== REPORT SUBMISSION ====================

/**
 * Submit a breach report
 */
export const submitReport = async (reportData) => {
  try {
    const reportsRef = collection(db, REPORTS_COLLECTION);
    
    const report = {
      ...reportData,
      createdAt: serverTimestamp(),
      status: 'pending',
      verified: false,
      upvotes: 0,
      downvotes: 0,
    };
    
    const docRef = await addDoc(reportsRef, report);
    console.log('✅ Report submitted:', docRef.id);
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('❌ Error submitting report:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get reports for a specific promise
 */
export const getReportsForPromise = async (promiseId) => {
  try {
    const reportsRef = collection(db, REPORTS_COLLECTION);
    const q = query(
      reportsRef,
      where('promiseId', '==', promiseId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
};

// ==================== STATISTICS ====================

/**
 * Get database statistics
 */
export const getDatabaseStats = async () => {
  try {
    const promisesRef = collection(db, PROMISES_COLLECTION);
    const reportsRef = collection(db, REPORTS_COLLECTION);
    
    const [promisesSnapshot, reportsSnapshot] = await Promise.all([
      getDocs(promisesRef),
      getDocs(reportsRef)
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
  // Seeding
  seedAllPromises,
  seedNDC2024Promises,
  seedNPP2016Promises,
  clearAllPromises,
  reseedAllPromises,
  
  // Queries
  getAllPromisesFromDB,
  getPromisesByCategory,
  getPromisesByParty,
  getPromisesByStatus,
  getFlagshipPromises,
  searchPromises,
  
  // Reports
  submitReport,
  getReportsForPromise,
  
  // Stats
  getDatabaseStats,
};