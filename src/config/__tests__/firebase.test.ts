import { initializeApp, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from '../firebase';

// Mock Firebase modules
jest.mock('firebase/app');
jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('firebase/storage');

describe('Firebase Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('has required configuration properties', () => {
    expect(firebaseConfig).toHaveProperty('apiKey');
    expect(firebaseConfig).toHaveProperty('authDomain');
    expect(firebaseConfig).toHaveProperty('projectId');
    expect(firebaseConfig).toHaveProperty('storageBucket');
    expect(firebaseConfig).toHaveProperty('messagingSenderId');
    expect(firebaseConfig).toHaveProperty('appId');
  });

  it('initializes Firebase app', () => {
    require('../firebase'); // This will run the initialization code

    expect(initializeApp).toHaveBeenCalledWith(firebaseConfig);
  });

  it('gets Firebase app instance', () => {
    require('../firebase'); // This will run the initialization code

    expect(getApp).toHaveBeenCalled();
  });

  it('initializes Firebase services', () => {
    require('../firebase'); // This will run the initialization code

    expect(getAuth).toHaveBeenCalled();
    expect(getFirestore).toHaveBeenCalled();
    expect(getStorage).toHaveBeenCalled();
  });

  it('handles app already initialized', () => {
    // Mock getApp to throw an error (simulating app already initialized)
    (getApp as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Firebase app already initialized');
    });

    // Mock initializeApp to return a mock app
    const mockApp = {};
    (initializeApp as jest.Mock).mockReturnValueOnce(mockApp);

    require('../firebase'); // This will run the initialization code

    expect(initializeApp).toHaveBeenCalledWith(firebaseConfig);
  });

  it('validates configuration values', () => {
    // Check if configuration values are non-empty strings
    Object.values(firebaseConfig).forEach(value => {
      expect(typeof value).toBe('string');
      expect(value).not.toBe('');
    });

    // Check if apiKey is a valid format (usually starts with 'AIza')
    expect(firebaseConfig.apiKey).toMatch(/^AIza[A-Za-z0-9_-]{35}$/);

    // Check if authDomain is a valid Firebase domain
    expect(firebaseConfig.authDomain).toMatch(/^[a-zA-Z0-9-]+\.firebaseapp\.com$/);

    // Check if projectId is a valid format
    expect(firebaseConfig.projectId).toMatch(/^[a-zA-Z0-9-]+$/);

    // Check if storageBucket is a valid Firebase storage bucket
    expect(firebaseConfig.storageBucket).toMatch(/^[a-zA-Z0-9-]+\.appspot\.com$/);

    // Check if messagingSenderId is a valid numeric string
    expect(firebaseConfig.messagingSenderId).toMatch(/^\d+$/);

    // Check if appId is a valid format (usually starts with '1:')
    expect(firebaseConfig.appId).toMatch(/^1:\d+:\w+:\w+$/);
  });
}); 