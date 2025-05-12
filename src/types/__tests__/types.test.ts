import { Entry, Category, User } from '../types';

describe('Types', () => {
  describe('Entry', () => {
    it('has required properties', () => {
      const entry: Entry = {
        id: '1',
        title: 'Test Entry',
        description: 'Test Description',
        categoryId: 'personal',
        userId: 'user123',
        createdAt: new Date(),
      };

      expect(entry).toHaveProperty('id');
      expect(entry).toHaveProperty('title');
      expect(entry).toHaveProperty('description');
      expect(entry).toHaveProperty('categoryId');
      expect(entry).toHaveProperty('userId');
      expect(entry).toHaveProperty('createdAt');
    });

    it('has optional properties', () => {
      const entry: Entry = {
        id: '1',
        title: 'Test Entry',
        description: 'Test Description',
        categoryId: 'personal',
        userId: 'user123',
        createdAt: new Date(),
        fileUrl: 'https://example.com/test.jpg',
        updatedAt: new Date(),
      };

      expect(entry).toHaveProperty('fileUrl');
      expect(entry).toHaveProperty('updatedAt');
    });

    it('has correct property types', () => {
      const entry: Entry = {
        id: '1',
        title: 'Test Entry',
        description: 'Test Description',
        categoryId: 'personal',
        userId: 'user123',
        createdAt: new Date(),
        fileUrl: 'https://example.com/test.jpg',
        updatedAt: new Date(),
      };

      expect(typeof entry.id).toBe('string');
      expect(typeof entry.title).toBe('string');
      expect(typeof entry.description).toBe('string');
      expect(typeof entry.categoryId).toBe('string');
      expect(typeof entry.userId).toBe('string');
      expect(entry.createdAt instanceof Date).toBe(true);
      expect(typeof entry.fileUrl).toBe('string');
      expect(entry.updatedAt instanceof Date).toBe(true);
    });
  });

  describe('Category', () => {
    it('has required properties', () => {
      const category: Category = {
        id: 'personal',
        name: 'Personal Information',
        description: 'Store your personal information',
      };

      expect(category).toHaveProperty('id');
      expect(category).toHaveProperty('name');
      expect(category).toHaveProperty('description');
    });

    it('has correct property types', () => {
      const category: Category = {
        id: 'personal',
        name: 'Personal Information',
        description: 'Store your personal information',
      };

      expect(typeof category.id).toBe('string');
      expect(typeof category.name).toBe('string');
      expect(typeof category.description).toBe('string');
    });
  });

  describe('User', () => {
    it('has required properties', () => {
      const user: User = {
        uid: 'user123',
        email: 'test@test.com',
      };

      expect(user).toHaveProperty('uid');
      expect(user).toHaveProperty('email');
    });

    it('has correct property types', () => {
      const user: User = {
        uid: 'user123',
        email: 'test@test.com',
      };

      expect(typeof user.uid).toBe('string');
      expect(typeof user.email).toBe('string');
    });

    it('validates email format', () => {
      const user: User = {
        uid: 'user123',
        email: 'test@test.com',
      };

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(user.email).toMatch(emailRegex);
    });
  });
}); 