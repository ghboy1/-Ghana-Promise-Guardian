// src/services/auth.js
/**
 * Comprehensive Firebase Auth Service
 * Handles authentication with graceful fallback to demo mode
 * Works with both Firebase initialized and uninitialized states
 */

import { auth } from '../firebase';

class AuthService {
  constructor() {
    this.auth = auth;
  }

  /**
   * Sign in anonymously
   * Falls back to demo user if Firebase not initialized
   */
  async loginAnonymously() {
    try {
      if (!this.auth) {
        console.warn('⚠️ Firebase auth not initialized. Using demo user.');
        return this.createDemoUser();
      }
      
      const userCredential = await this.auth.signInAnonymously();
      console.log("✅ Logged in anonymously:", userCredential.user.uid);
      return userCredential.user;
    } catch (error) {
      console.error("❌ Anonymous login failed:", error.message);
      return this.createDemoUser(error.message);
    }
  }

  /**
   * Listen to auth state changes
   * Simulates login with demo user if Firebase not initialized
   */
  onAuthStateChanged(callback) {
    if (!this.auth) {
      console.warn('⚠️ Firebase auth not initialized. Using demo user.');
      // Simulate async callback
      setTimeout(() => {
        callback(this.createDemoUser());
      }, 100);
      return () => {}; // Return empty unsubscribe function
    }
    
    return this.auth.onAuthStateChanged(callback);
  }

  /**
   * Get current user
   * Returns demo user if Firebase not initialized or no user signed in
   */
  getCurrentUser() {
    if (!this.auth) {
      return this.createDemoUser();
    }
    return this.auth.currentUser || this.createDemoUser();
  }

  /**
   * Create a demo user object
   */
  createDemoUser(error = null) {
    return { 
      uid: 'demo-user-' + Date.now(), 
      isDemo: true,
      email: 'demo@ghanapromise.app',
      error: error || null
    };
  }

  /**
   * Sign out user
   */
  async signOut() {
    if (!this.auth) {
      console.warn('⚠️ Firebase auth not initialized for sign out');
      return;
    }
    
    try {
      await this.auth.signOut();
      console.log('✅ User signed out');
    } catch (error) {
      console.error('❌ Sign out error:', error.message);
    }
  }
}

// Export singleton instance
export default new AuthService();