# 🇬🇭 Ghana Promise Guardian

git remote add origin [https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git](https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git)A mobile application that empowers Ghanaian citizens to track government promises, report issues, and build community accountability. Inspired by Ghana's independence legacy, this app helps safeguard our nation's futur

## ✨ Features

- **📊 Promise Dashboard**: Track government promises with status updates
- **🗺️ Interactive Map**: Visualize promises geographically across Ghana
- **📝 Report System**: Submit anonymous reports on broken promises
- **👤 User Profiles**: Track your contributions and earn badges
- **🔐 Anonymous Authentication**: Privacy-focused user experience
- **📱 Cross-Platform**: Works on iOS, Android, and Web

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Firebase account

### Installation

1. **Clone or download the project**
2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Set up Firebase**

   a. Go to [Firebase Console](https://console.firebase.google.com/)

   b. Create a new project named "Ghana Promise Guardian"

   c. Enable Authentication:

   - Go to Authentication > Sign-in method
   - Enable "Anonymous" authentication

   d. Enable Firestore Database:

   - Go to Firestore Database
   - Create database in production mode
   - Add these security rules:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /reports/{reportId} {
         allow read: if true;
         allow create: if request.auth != null;
       }
       match /promises/{promiseId} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

   e. Get your Firebase config:

   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Click "Web" icon (</>) to add a web app
   - Copy the configuration object
4. **Configure Firebase in your app**

   Open `src/services/auth.js` and replace the config:

   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

   Do the same in `src/services/firestore.js`
5. **Start the development server**

```bash
npx expo start --clear
```

6. **Run on your device**
   - Scan the QR code with Expo Go app (Android/iOS)
   - Press `w` for web browser
   - Press `a` for Android emulator
   - Press `i` for iOS simulator

## 📁 Project Structure

```
GhanaPromiseGuardian/
├── App.js                          # Main app entry with navigation
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js          # Landing page with quick actions
│   │   ├── DashboardScreen.js     # Promise tracking dashboard
│   │   ├── MapScreen.js           # Geographic visualization
│   │   ├── ReportScreen.js        # Report submission form
│   │   └── ProfileScreen.js       # User profile and stats
│   └── services/
│       ├── auth.js                # Firebase authentication
│       └── firestore.js           # Database operations
├── assets/                         # Images and icons
├── package.json
└── README.md
```

## 🎨 Color Scheme

The app uses Ghana's flag colors:

- **Red (#DC2626)**: Primary actions, headers
- **Yellow/Gold (#FCD34D)**: Highlights, warnings
- **Green (#10B981)**: Success states, fulfilled promises
- **Black**: Used for star icon (Ghana flag star)

## 🔧 Configuration

### Maps (Optional but Recommended)

For full map functionality:

1. **Google Maps API Key** (Android):

   - Get key from [Google Cloud Console](https://console.cloud.google.com/)
   - Add to `app.json`:

   ```json
   {
     "expo": {
       "android": {
         "config": {
           "googleMaps": {
             "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
           }
         }
       }
     }
   }
   ```
2. **Apple Maps** (iOS):

   - Works out of the box with Expo

## 📊 Firestore Data Structure

### Promises Collection

```javascript
{
  title: string,
  description: string,
  status: "fulfilled" | "progress" | "broken",
  category: string,
  impact: "High" | "Medium" | "Low",
  progress: number (0-100),
  region: string,
  datePromised: timestamp,
  priority: number
}
```

### Reports Collection

```javascript
{
  userId: string,
  title: string,
  description: string,
  category: string,
  location: string,
  evidenceUrl: string,
  status: "pending" | "verified" | "rejected",
  votes: number,
  createdAt: timestamp
}
```

## 🚀 Deployment

### Build for Production

**Android APK:**

```bash
expo build:android -t apk
```

**iOS:**

```bash
expo build:ios
```

**Web:**

```bash
expo build:web
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Report bugs or suggest features via issues
2. Submit pull requests with improvements
3. Help with documentation
4. Share the app with other Ghanaians

## 📝 License

This project is created for educational and civic engagement purposes.

## 🙏 Acknowledgments

- Inspired by Ghana's independence movement
- Built with ❤️ by Ghanaian youth
- Powered by Firebase and Expo

## 📞 Support

For support or inquiries:

- Email: support@ghanapromise.org
- Report issues on GitHub

## 🎯 Roadmap

- [ ] Push notifications for promise updates
- [ ] Social sharing of reports
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (Twi, Ga, Ewe)
- [ ] Offline mode support
- [ ] Image upload for evidence
- [ ] Community voting system
- [ ] Government official verification

---

**Made with 🇬🇭 for Ghana's Future**
