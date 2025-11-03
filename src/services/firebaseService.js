import { db, storage, firebase } from '../firebase';

export const submitReport = async (reportData) => {
  try {
    const docRef = await db.collection('reports').add({
      ...reportData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      status: 'pending',
      votes: 0,
    });
    console.log('✅ Report submitted:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error submitting report:', error);
    throw error;
  }
};

export const getPromises = async () => {
  try {
    const snapshot = await db.collection('promises')
      .orderBy('priority', 'desc')
      .limit(50)
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('❌ Error getting promises:', error);
    throw error;
  }
};

export const getReports = async () => {
  try {
    const snapshot = await db.collection('reports')
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('❌ Error getting reports:', error);
    throw error;
  }
};