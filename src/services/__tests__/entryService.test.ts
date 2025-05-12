import {
  createEntry,
  updateEntry,
  deleteEntry,
  getEntries,
} from '../entryService';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

jest.mock('firebase/firestore');
jest.mock('firebase/storage');

describe('entryService', () => {
  const mockUserId = 'user123';
  const mockCategoryId = 'category123';
  const mockEntryId = 'entry123';
  const mockFile = {
    uri: 'file://test.jpg',
    name: 'test.jpg',
    type: 'image/jpeg',
  };
  const mockEntry = {
    title: 'Test Entry',
    description: 'Test Description',
    categoryId: mockCategoryId,
    userId: mockUserId,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createEntry', () => {
    it('creates entry without file', async () => {
      const mockDocRef = { id: mockEntryId };
      (addDoc as jest.Mock).mockResolvedValueOnce(mockDocRef);

      const result = await createEntry(mockEntry, mockUserId);

      expect(addDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          ...mockEntry,
          userId: mockUserId,
          createdAt: expect.any(Date),
        })
      );
      expect(result).toEqual({
        ...mockEntry,
        id: mockEntryId,
        createdAt: expect.any(Date),
      });
    });

    it('creates entry with file', async () => {
      const mockDocRef = { id: mockEntryId };
      const mockDownloadUrl = 'https://example.com/test.jpg';
      (addDoc as jest.Mock).mockResolvedValueOnce(mockDocRef);
      (uploadBytes as jest.Mock).mockResolvedValueOnce({});
      (getDownloadURL as jest.Mock).mockResolvedValueOnce(mockDownloadUrl);

      const result = await createEntry(mockEntry, mockUserId, mockFile);

      expect(uploadBytes).toHaveBeenCalled();
      expect(getDownloadURL).toHaveBeenCalled();
      expect(addDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          ...mockEntry,
          userId: mockUserId,
          fileUrl: mockDownloadUrl,
          createdAt: expect.any(Date),
        })
      );
      expect(result).toEqual({
        ...mockEntry,
        id: mockEntryId,
        fileUrl: mockDownloadUrl,
        createdAt: expect.any(Date),
      });
    });
  });

  describe('updateEntry', () => {
    it('updates entry without file', async () => {
      const mockDocRef = { id: mockEntryId };
      (doc as jest.Mock).mockReturnValueOnce(mockDocRef);
      (updateDoc as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await updateEntry(mockEntryId, mockEntry, mockUserId);

      expect(updateDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          ...mockEntry,
          updatedAt: expect.any(Date),
        })
      );
      expect(result).toEqual({
        ...mockEntry,
        id: mockEntryId,
        updatedAt: expect.any(Date),
      });
    });

    it('updates entry with new file', async () => {
      const mockDocRef = { id: mockEntryId };
      const mockDownloadUrl = 'https://example.com/test.jpg';
      (doc as jest.Mock).mockReturnValueOnce(mockDocRef);
      (uploadBytes as jest.Mock).mockResolvedValueOnce({});
      (getDownloadURL as jest.Mock).mockResolvedValueOnce(mockDownloadUrl);
      (updateDoc as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await updateEntry(mockEntryId, mockEntry, mockUserId, mockFile);

      expect(uploadBytes).toHaveBeenCalled();
      expect(getDownloadURL).toHaveBeenCalled();
      expect(updateDoc).toHaveBeenCalledWith(
        mockDocRef,
        expect.objectContaining({
          ...mockEntry,
          fileUrl: mockDownloadUrl,
          updatedAt: expect.any(Date),
        })
      );
      expect(result).toEqual({
        ...mockEntry,
        id: mockEntryId,
        fileUrl: mockDownloadUrl,
        updatedAt: expect.any(Date),
      });
    });

    it('throws error if user is not authorized', async () => {
      const mockDocRef = { id: mockEntryId };
      (doc as jest.Mock).mockReturnValueOnce(mockDocRef);
      (getDocs as jest.Mock).mockResolvedValueOnce({
        empty: true,
      });

      await expect(updateEntry(mockEntryId, mockEntry, 'different-user')).rejects.toThrow(
        'Not authorized to update this entry'
      );
    });
  });

  describe('deleteEntry', () => {
    it('deletes entry without file', async () => {
      const mockDocRef = { id: mockEntryId };
      (doc as jest.Mock).mockReturnValueOnce(mockDocRef);
      (getDocs as jest.Mock).mockResolvedValueOnce({
        docs: [{ data: () => ({ userId: mockUserId }) }],
      });
      (deleteDoc as jest.Mock).mockResolvedValueOnce(undefined);

      await deleteEntry(mockEntryId, mockUserId);

      expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
    });

    it('deletes entry with file', async () => {
      const mockDocRef = { id: mockEntryId };
      const mockStorageRef = { path: 'test.jpg' };
      (doc as jest.Mock).mockReturnValueOnce(mockDocRef);
      (ref as jest.Mock).mockReturnValueOnce(mockStorageRef);
      (getDocs as jest.Mock).mockResolvedValueOnce({
        docs: [{ data: () => ({ userId: mockUserId, fileUrl: 'https://example.com/test.jpg' }) }],
      });
      (deleteDoc as jest.Mock).mockResolvedValueOnce(undefined);
      (deleteObject as jest.Mock).mockResolvedValueOnce(undefined);

      await deleteEntry(mockEntryId, mockUserId);

      expect(deleteObject).toHaveBeenCalledWith(mockStorageRef);
      expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
    });

    it('throws error if user is not authorized', async () => {
      const mockDocRef = { id: mockEntryId };
      (doc as jest.Mock).mockReturnValueOnce(mockDocRef);
      (getDocs as jest.Mock).mockResolvedValueOnce({
        docs: [{ data: () => ({ userId: 'different-user' }) }],
      });

      await expect(deleteEntry(mockEntryId, mockUserId)).rejects.toThrow(
        'Not authorized to delete this entry'
      );
    });
  });

  describe('getEntries', () => {
    it('retrieves entries for user and category', async () => {
      const mockEntries = [
        { id: '1', data: () => ({ ...mockEntry, createdAt: new Date() }) },
        { id: '2', data: () => ({ ...mockEntry, createdAt: new Date() }) },
      ];
      (getDocs as jest.Mock).mockResolvedValueOnce({
        docs: mockEntries,
      });

      const result = await getEntries(mockUserId, mockCategoryId);

      expect(query).toHaveBeenCalledWith(
        expect.anything(),
        where('userId', '==', mockUserId),
        where('categoryId', '==', mockCategoryId),
        orderBy('createdAt', 'desc')
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('createdAt');
    });
  });
}); 