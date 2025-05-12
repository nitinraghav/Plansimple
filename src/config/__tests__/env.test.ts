import { config } from '../env';

describe('Environment Variables', () => {
  it('has required Firebase configuration', () => {
    expect(config.firebase).toHaveProperty('apiKey');
    expect(config.firebase).toHaveProperty('authDomain');
    expect(config.firebase).toHaveProperty('projectId');
    expect(config.firebase).toHaveProperty('storageBucket');
    expect(config.firebase).toHaveProperty('messagingSenderId');
    expect(config.firebase).toHaveProperty('appId');
  });

  it('has valid Firebase configuration values', () => {
    const { firebase } = config;

    // Check if values are non-empty strings
    Object.values(firebase).forEach(value => {
      expect(typeof value).toBe('string');
      expect(value).not.toBe('');
    });

    // Check if apiKey is a valid format
    expect(firebase.apiKey).toMatch(/^AIza[A-Za-z0-9_-]{35}$/);

    // Check if authDomain is a valid Firebase domain
    expect(firebase.authDomain).toMatch(/^[a-zA-Z0-9-]+\.firebaseapp\.com$/);

    // Check if projectId is a valid format
    expect(firebase.projectId).toMatch(/^[a-zA-Z0-9-]+$/);

    // Check if storageBucket is a valid Firebase storage bucket
    expect(firebase.storageBucket).toMatch(/^[a-zA-Z0-9-]+\.appspot\.com$/);

    // Check if messagingSenderId is a valid numeric string
    expect(firebase.messagingSenderId).toMatch(/^\d+$/);

    // Check if appId is a valid format
    expect(firebase.appId).toMatch(/^1:\d+:\w+:\w+$/);
  });

  it('has required app configuration', () => {
    expect(config.app).toHaveProperty('name');
    expect(config.app).toHaveProperty('version');
    expect(config.app).toHaveProperty('environment');
  });

  it('has valid app configuration values', () => {
    const { app } = config;

    // Check app name
    expect(typeof app.name).toBe('string');
    expect(app.name).toBe('Plansimple');

    // Check version format (semantic versioning)
    expect(typeof app.version).toBe('string');
    expect(app.version).toMatch(/^\d+\.\d+\.\d+$/);

    // Check environment
    expect(typeof app.environment).toBe('string');
    expect(['development', 'staging', 'production']).toContain(app.environment);
  });

  it('has required API configuration', () => {
    expect(config.api).toHaveProperty('baseUrl');
    expect(config.api).toHaveProperty('timeout');
  });

  it('has valid API configuration values', () => {
    const { api } = config;

    // Check baseUrl
    expect(typeof api.baseUrl).toBe('string');
    expect(api.baseUrl).toMatch(/^https?:\/\/.+/);

    // Check timeout
    expect(typeof api.timeout).toBe('number');
    expect(api.timeout).toBeGreaterThan(0);
  });

  it('has required storage configuration', () => {
    expect(config.storage).toHaveProperty('maxFileSize');
    expect(config.storage).toHaveProperty('allowedTypes');
  });

  it('has valid storage configuration values', () => {
    const { storage } = config;

    // Check maxFileSize (in bytes)
    expect(typeof storage.maxFileSize).toBe('number');
    expect(storage.maxFileSize).toBeGreaterThan(0);
    expect(storage.maxFileSize).toBeLessThanOrEqual(10 * 1024 * 1024); // 10MB max

    // Check allowedTypes
    expect(Array.isArray(storage.allowedTypes)).toBe(true);
    expect(storage.allowedTypes.length).toBeGreaterThan(0);
    storage.allowedTypes.forEach(type => {
      expect(typeof type).toBe('string');
      expect(type).toMatch(/^image\/(jpeg|png|gif)$/);
    });
  });

  it('has required security configuration', () => {
    expect(config.security).toHaveProperty('minPasswordLength');
    expect(config.security).toHaveProperty('passwordRegex');
  });

  it('has valid security configuration values', () => {
    const { security } = config;

    // Check minPasswordLength
    expect(typeof security.minPasswordLength).toBe('number');
    expect(security.minPasswordLength).toBeGreaterThanOrEqual(6);

    // Check passwordRegex
    expect(typeof security.passwordRegex).toBe('string');
    expect(new RegExp(security.passwordRegex)).toBeTruthy();

    // Test password regex with valid and invalid passwords
    const passwordRegex = new RegExp(security.passwordRegex);
    expect(passwordRegex.test('ValidPass123!')).toBe(true);
    expect(passwordRegex.test('weak')).toBe(false);
  });
}); 