import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { Entry, Category } from '../types';

const COLLECTION_NAME = 'entries';

export async function createEntry(
  userId: string,
  category: Category,
  title: string,
  description: string,
  file?: File
): Promise<Entry> {
  let fileUrl: string | undefined;

  if (file) {
    const storageRef = ref(storage, `entries/${userId}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    fileUrl = await getDownloadURL(storageRef);
  }

  const entryData = {
    userId,
    category,
    title,
    description,
    fileUrl,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), entryData);
  
  return {
    id: docRef.id,
    ...entryData,
    createdAt: entryData.createdAt.toDate(),
    updatedAt: entryData.updatedAt.toDate(),
  };
}

export async function updateEntry(
  entryId: string,
  userId: string,
  updates: Partial<Omit<Entry, 'id' | 'userId' | 'createdAt'>>,
  newFile?: File
): Promise<Entry> {
  const entryRef = doc(db, COLLECTION_NAME, entryId);
  const entryDoc = await getDocs(query(
    collection(db, COLLECTION_NAME),
    where('__name__', '==', entryId),
    where('userId', '==', userId)
  ));

  if (entryDoc.empty) {
    throw new Error('Entry not found or unauthorized');
  }

  const entry = entryDoc.docs[0].data() as Entry;
  let fileUrl = entry.fileUrl;

  if (newFile) {
    // Delete old file if exists
    if (entry.fileUrl) {
      const oldFileRef = ref(storage, entry.fileUrl);
      await deleteObject(oldFileRef);
    }

    // Upload new file
    const storageRef = ref(storage, `entries/${userId}/${Date.now()}_${newFile.name}`);
    await uploadBytes(storageRef, newFile);
    fileUrl = await getDownloadURL(storageRef);
  }

  const updateData = {
    ...updates,
    fileUrl,
    updatedAt: Timestamp.now(),
  };

  await updateDoc(entryRef, updateData);

  return {
    ...entry,
    ...updateData,
    id: entryId,
    updatedAt: updateData.updatedAt.toDate(),
  };
}

export async function deleteEntry(entryId: string, userId: string): Promise<void> {
  const entryDoc = await getDocs(query(
    collection(db, COLLECTION_NAME),
    where('__name__', '==', entryId),
    where('userId', '==', userId)
  ));

  if (entryDoc.empty) {
    throw new Error('Entry not found or unauthorized');
  }

  const entry = entryDoc.docs[0].data() as Entry;

  // Delete file if exists
  if (entry.fileUrl) {
    const fileRef = ref(storage, entry.fileUrl);
    await deleteObject(fileRef);
  }

  await deleteDoc(doc(db, COLLECTION_NAME, entryId));
}

export async function getEntries(userId: string, category: Category): Promise<Entry[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId),
    where('category', '==', category),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
  })) as Entry[];
} 