import 'react-native-gesture-handler/jestSetup';

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({
    canceled: false,
    assets: [{
      uri: 'test-uri',
      type: 'image/jpeg',
    }],
  })),
  MediaTypeOptions: {
    All: 'All',
    Images: 'Images',
    Videos: 'Videos',
  },
}));

// Mock Firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  Timestamp: {
    now: jest.fn(() => ({ toDate: () => new Date() })),
  },
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
  deleteObject: jest.fn(),
}));

// Mock react-native-paper
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  
  return {
    Provider: ({ children }) => <View>{children}</View>,
    Button: ({ onPress, children, ...props }) => (
      <TouchableOpacity onPress={onPress} {...props}>
        <Text>{children}</Text>
      </TouchableOpacity>
    ),
    TextInput: ({ value, onChangeText, ...props }) => (
      <TextInput
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
    ),
    Card: ({ children, ...props }) => (
      <View {...props}>{children}</View>
    ),
    FAB: ({ onPress, ...props }) => (
      <TouchableOpacity onPress={onPress} {...props} />
    ),
    IconButton: ({ onPress, ...props }) => (
      <TouchableOpacity onPress={onPress} {...props} />
    ),
    Portal: ({ children }) => <View>{children}</View>,
    Dialog: ({ visible, children }) => visible ? <View>{children}</View> : null,
    useTheme: () => ({
      colors: {
        primary: '#2196F3',
        error: '#B00020',
      },
    }),
  };
});

// Mock react-navigation
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }) => <View>{children}</View>,
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

// Suppress console errors during tests
console.error = jest.fn(); 