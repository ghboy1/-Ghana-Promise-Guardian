// firebase.js - Fixed version
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
  appId: "1:1087896809855:android:com.ghanapromiseguardian"
};

// Initialize Firebase only if not already initialized
let app;
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized (compat mode)');
} else {
  app = firebase.app();
}

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Enable offline persistence for Firestore
db.enablePersistence()
  .then(() => {
    console.log('✅ Firestore offline persistence enabled');
  })
  .catch((err) => {
    console.log('❌ Firestore persistence error:', err);
  });

// Set auth persistence
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(() => {
    console.log('✅ Auth persistence enabled');
  })
  .catch((error) => {
    console.log('❌ Auth persistence error:', error);
  });

console.log('✅ Auth, Firestore, and Storage initialized');

export { auth, db, storage, firebase };