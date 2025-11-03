// src/services/firestore.js
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const PROMISES_COLLECTION = 'promises';

export const seedPromises = async () => {
  const sample = [
    {
      title: "Build 200 rural clinics",
      description: "NPP 2024 manifesto – 50 in Northern Region",
      status: "In Progress",
      region: "Northern",
      district: "Tamale",
      timeline: { start: "2025-01", end: "2027-12" },
      evidence: []
    },
    // …add 4 more
  ];

  for (const p of sample) {
    await addDoc(collection(db, PROMISES_COLLECTION), p);
  }
  console.log('Seeded');
};