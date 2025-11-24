// jest.setup.js
// Minimal setup for react-native Jest environment
import 'react-native-gesture-handler/jestSetup';

// Silence timer warnings
jest.useFakeTimers && jest.useFakeTimers();
