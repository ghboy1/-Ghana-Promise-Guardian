// src/firebase.js
/**
 * Firebase service module
 * Exports common Firebase operations for authentication, database, and storage
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only if config is available
let app, auth, db, storage;

try {
  if (firebaseConfig.projectId) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  }
} catch (error) {
  console.warn('⚠️ Firebase initialization skipped (missing env vars or already initialized):', error.message);
}

// Export lazy instances with fallbacks
export { auth, db, storage };

// ==================== REPORTS ====================
/**
 * Submit a report to Firestore
 * @param {Object} reportData - Report data including title, description, category, location, evidenceUrl, userId, timestamp
 * @returns {Promise<{success: boolean, reportId?: string, error?: string}>}
 */
export const submitReport = async (reportData) => {
  try {
    if (!db) {
      console.warn('⚠️ Firebase not initialized. Report saved locally only.');
      return { success: true, reportId: 'local-' + Date.now(), isLocal: true };
    }
    const reportsCollection = collection(db, 'reports');
    const docRef = await addDoc(reportsCollection, {
      ...reportData,
      createdAt: new Date(),
      status: 'pending',
      likes: 0,
      views: 0
    });
    console.log('✅ Report submitted:', docRef.id);
    return { success: true, reportId: docRef.id };
  } catch (error) {
    console.error('❌ Error submitting report:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all reports (paginated)
 * @param {number} limit - Number of reports to fetch
 * @returns {Promise<Array>}
 */
export const getReports = async (limit = 50) => {
  try {
    if (!db) return [];
    const reportsCollection = collection(db, 'reports');
    const q = query(reportsCollection);
    const snapshot = await getDocs(q);
    return snapshot.docs.slice(0, limit).map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
};

/**
 * Get reports by category
 * @param {string} category - Report category
 * @returns {Promise<Array>}
 */
export const getReportsByCategory = async (category) => {
  try {
    if (!db) return [];
    const reportsCollection = collection(db, 'reports');
    const q = query(reportsCollection, where('category', '==', category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching reports by category:', error);
    return [];
  }
};

/**
 * Get reports by user
 * @param {string} userId - User ID
 * @returns {Promise<Array>}
 */
export const getReportsByUser = async (userId) => {
  try {
    if (!db) return [];
    const reportsCollection = collection(db, 'reports');
    const q = query(reportsCollection, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching user reports:', error);
    return [];
  }
};

/**
 * Like a report
 * @param {string} reportId - Report ID
 * @returns {Promise<{success: boolean}>}
 */
export const likeReport = async (reportId) => {
  try {
    if (!db) return { success: false, error: 'Firebase not initialized' };
    const reportRef = doc(db, 'reports', reportId);
    const snapshot = await getDocs(query(collection(db, 'reports'), where('__name__', '==', reportId)));
    const currentLikes = snapshot.docs[0]?.data()?.likes || 0;
    await updateDoc(reportRef, { likes: currentLikes + 1 });
    return { success: true };
  } catch (error) {
    console.error('Error liking report:', error);
    return { success: false, error: error.message };
  }
};

// ==================== PROMISES ====================
/**
 * Get all promises
 * @returns {Promise<Array>}
 */
export const getPromises = async () => {
  try {
    if (!db) return [];
    const promisesCollection = collection(db, 'promises');
    const snapshot = await getDocs(promisesCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching promises:', error);
    return [];
  }
};

/**
 * Save a promise to Firestore
 * @param {Object} promiseData - Promise data
 * @returns {Promise<{success: boolean, id?: string}>}
 */
export const savePromise = async (promiseData) => {
  try {
    if (!db) {
      console.warn('⚠️ Firebase not initialized. Promise saved locally only.');
      return { success: true, id: 'local-' + Date.now(), isLocal: true };
    }
    const promisesCollection = collection(db, 'promises');
    const docRef = await addDoc(promisesCollection, {
      ...promiseData,
      createdAt: new Date()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving promise:', error);
    return { success: false, error: error.message };
  }
};

// ==================== DEFAULT EXPORT ====================
export default {
  submitReport,
  getReports,
  getReportsByCategory,
  getReportsByUser,
  likeReport,
  getPromises,
  savePromise,
  auth,
  db,
  storage
};
