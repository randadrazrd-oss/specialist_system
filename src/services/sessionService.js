import { db, USE_MOCK } from '../config/firebase';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { mockSessions, delay } from './mockData';
import { format } from 'date-fns';

export const getSessionsByDate = async (dateObj) => {
  const dateStr = format(dateObj, 'yyyy-MM-dd');
  if (USE_MOCK) {
    await delay(200);
    return mockSessions.filter(s => s.date === dateStr);
  }
  
  const q = query(collection(db, 'sessions'), where("date", "==", dateStr));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addSession = async (sessionData) => {
  if (USE_MOCK) {
    await delay(400);
    const newSession = { ...sessionData, id: 'sess' + Date.now() };
    mockSessions.push(newSession); // this modifies the array in-place, persisting in memory
    return newSession;
  }
  const docRef = await addDoc(collection(db, 'sessions'), sessionData);
  return { id: docRef.id, ...sessionData };
};
