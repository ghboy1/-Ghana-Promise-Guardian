// src/firebase.js - COMPAT MODE (Most Stable for Expo)
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBQnWEQhgecYykfkEUhD99fIudUiJWjF9g",
  authDomain: "ghana-promise-guardian.firebaseapp.com",
  projectId: "ghana-promise-guardian",
  storageBucket: "ghana-promise-guardian.appspot.com",
  messagingSenderId: "1087896809855",
  appId: "1:1087896809855:android:xxxxxxxxxxxx"
};

// Initialize Firebase only if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized (compat mode)');
}

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

console.log('✅ Auth, Firestore, and Storage ready');

export { auth, db, storage, firebase };