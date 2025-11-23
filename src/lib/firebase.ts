import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Collection references
export const studyTasksCollection = collection(db, 'study_tasks');
export const flashCardsCollection = collection(db, 'flash_cards');

// Helper functions
export const firestoreHelpers = {
  // Study Tasks
  async getStudyTasks(dayOfWeek?: number) {
    let q;
    if (dayOfWeek !== undefined) {
      q = query(studyTasksCollection, where('day_of_week', '==', dayOfWeek), orderBy('created_at', 'desc'));
    } else {
      q = query(studyTasksCollection, orderBy('created_at', 'desc'));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async addStudyTask(task: any) {
    const now = new Date().toISOString();
    // Remove undefined values (Firebase doesn't accept undefined)
    const cleanTask = Object.fromEntries(
      Object.entries(task).filter(([_, v]) => v !== undefined)
    );
    const docRef = await addDoc(studyTasksCollection, {
      ...cleanTask,
      created_at: now,
      updated_at: now
    });
    return { id: docRef.id, ...cleanTask, created_at: now, updated_at: now };
  },

  async updateStudyTask(id: string, updates: any) {
    const docRef = doc(db, 'study_tasks', id);
    const updated_at = new Date().toISOString();
    // Remove undefined values (Firebase doesn't accept undefined)
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await updateDoc(docRef, { ...cleanUpdates, updated_at });
    return { id, ...cleanUpdates, updated_at };
  },

  async deleteStudyTask(id: string) {
    const docRef = doc(db, 'study_tasks', id);
    await deleteDoc(docRef);
  },

  // Flash Cards
  async getFlashCards() {
    const q = query(flashCardsCollection, orderBy('created_at', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async addFlashCard(card: any) {
    const now = new Date().toISOString();
    // Remove undefined values (Firebase doesn't accept undefined)
    const cleanCard = Object.fromEntries(
      Object.entries(card).filter(([_, v]) => v !== undefined)
    );
    const docRef = await addDoc(flashCardsCollection, {
      ...cleanCard,
      review_count: 0,
      mastered: false,
      created_at: now,
      updated_at: now
    });
    return { id: docRef.id, ...cleanCard, review_count: 0, mastered: false, created_at: now, updated_at: now };
  },

  async updateFlashCard(id: string, updates: any) {
    const docRef = doc(db, 'flash_cards', id);
    const updated_at = new Date().toISOString();
    // Remove undefined values (Firebase doesn't accept undefined)
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await updateDoc(docRef, { ...cleanUpdates, updated_at });
    return { id, ...cleanUpdates, updated_at };
  },

  async deleteFlashCard(id: string) {
    const docRef = doc(db, 'flash_cards', id);
    await deleteDoc(docRef);
  }
};

export { query, where, orderBy, Timestamp };