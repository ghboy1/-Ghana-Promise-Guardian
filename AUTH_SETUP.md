# Authentication Setup Documentation

## Overview
This app uses a robust Firebase authentication service with graceful fallback to demo mode. This means the app works whether Firebase is initialized or not.

## Architecture

### 1. **firebase.js** (Root Firebase Config)
- **Location**: `firebase.js` (root directory)
- **Purpose**: Initialize Firebase with compat SDK (v9+)
- **Key Features**:
  - Graceful initialization with try-catch
  - Returns `null` for auth/db/storage if initialization fails
  - Exports compat functions: `signInAnonymously()`, `onAuthStateChanged()`
  - **Demo Mode**: If Firebase fails to initialize, the app continues in demo mode

### 2. **AuthService Class** (Business Logic)
- **Location**: `src/services/auth.js`
- **Class**: `AuthService` (singleton instance exported as default)
- **Methods**:
  - `loginAnonymously()`: Sign in with Firebase or return demo user
  - `onAuthStateChanged(callback)`: Listen to auth state changes
  - `getCurrentUser()`: Get current user or demo user
  - `createDemoUser(error?)`: Create a demo user object
  - `signOut()`: Sign out user

**Demo User Example**:
```javascript
{
  uid: 'demo-user-1732081234567',
  isDemo: true,
  email: 'demo@ghanapromise.app',
  error: null
}
```

### 3. **AuthContext** (Global State)
- **Location**: `src/context/AuthContext.js`
- **Exports**:
  - `AuthProvider`: Wrapper component to provide auth state
  - `useAuth()`: Hook to access auth state from any component

**Context Value**:
```javascript
{
  currentUser,      // { uid, isDemo, email, error }
  loading,          // boolean
  error,            // error message or null
  logout(),         // async function to sign out
  loginAnonymously() // async function to login
}
```

### 4. **App.js** (Integration)
- **Location**: `App.js` (root)
- **Structure**:
  - Wraps entire app with `AuthProvider`
  - `AppContent` component uses `useAuth()` hook
  - Passes `uid` to all screens via `initialParams`
  - Shows loading screen while auth initializes

## Usage Examples

### In Any Component:
```javascript
import { useAuth } from '../context/AuthContext';

export default function MyComponent() {
  const { currentUser, loading, logout } = useAuth();

  if (loading) return <ActivityIndicator />;

  return (
    <View>
      <Text>User ID: {currentUser.uid}</Text>
      <Text>Demo Mode: {currentUser.isDemo ? 'Yes' : 'No'}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
```

### Direct Service Access:
```javascript
import authService from '../services/auth';

// Login
const user = await authService.loginAnonymously();
console.log('User:', user);

// Get current user
const currentUser = authService.getCurrentUser();

// Sign out
await authService.signOut();
```

## Error Handling & Fallbacks

| Scenario | Behavior |
|----------|----------|
| Firebase initialized ✅ | Uses real Firebase auth |
| Firebase not initialized | Returns demo user with `isDemo: true` |
| Anonymous login fails | Returns demo user with error message |
| No user signed in | Attempts automatic anonymous login |
| Auth state listener fails | Sets demo user, continues in demo mode |

## Environment Variables (Optional)

If you want to use real Firebase, set these environment variables in `.env`:

```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Note**: The app is currently hardcoded with a Firebase config. To use environment variables, update `firebase.js`.

## File Structure

```
Ghana Promise Guardian/
├── App.js                         # Root app with AuthProvider
├── firebase.js                    # Firebase initialization
├── src/
│   ├── services/
│   │   └── auth.js                # AuthService class
│   ├── context/
│   │   └── AuthContext.js         # Context provider & useAuth hook
│   └── screens/
│       ├── DashboardScreen.js     # Uses useAuth()
│       ├── HomeScreen.js          # Uses useAuth()
│       ├── ProfileScreen.js       # Uses useAuth()
│       ├── ReportScreen.js        # Uses useAuth()
│       └── MapScreen.js           # Uses useAuth()
```

## Testing

To test auth with console logs:
```bash
npx expo start -c
# Watch console for:
# ✅ Firebase initialized (compat mode)
# ✅ Auth, Firestore, and Storage initialized
# ✅ Auth state changed: { uid: '...', isDemo: false }
```

Or in demo mode:
```
⚠️ Firebase auth not initialized. Using demo user.
✅ Auth state changed: { uid: 'demo-user-...', isDemo: true }
```

## Migration Notes

### Before (Old Pattern):
```javascript
import { auth, signInAnonymously } from './firebase';
// auth was imported directly at module level
```

### After (New Pattern):
```javascript
import { useAuth } from '../context/AuthContext';
const { currentUser, loading } = useAuth();
// Auth state managed globally via context
```

## Troubleshooting

**Problem**: "Component auth has not been registered yet"
- **Solution**: Auth initialization is now lazy and graceful. If still occurs, check firebase.js initialization logs.

**Problem**: Auth state never updates
- **Solution**: Ensure `AuthProvider` wraps your app in App.js (already done).

**Problem**: Demo user always used
- **Solution**: Check console logs for Firebase initialization errors. If Firebase fails to load, demo mode activates automatically.

**Problem**: User logs out unexpectedly
- **Solution**: Check for errors in AuthContext.js useEffect. Firebase may be disconnecting due to network issues.

## References
- [Firebase Compat SDK Docs](https://firebase.google.com/docs/reference/js/auth.Auth)
- [React Context API](https://react.dev/reference/react/createContext)
- [React Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
