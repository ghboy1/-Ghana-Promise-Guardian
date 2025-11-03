// src/services/auth.js
import { auth } from '../firebase';
import { signInAnonymously } from 'firebase/auth';

export const loginAnonymously = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    console.log("Logged in anonymously:", userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error("Anonymous login failed:", error);
    throw error;
  }
};