import { db, USE_MOCK } from '../config/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { mockChildren, delay } from './mockData';

export const getChildren = async () => {
  if (USE_MOCK) {
    await delay(300);
    return [...mockChildren];
  }
  const querySnapshot = await getDocs(collection(db, 'children'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addChild = async (child) => {
  if (USE_MOCK) {
    await delay(300);
    const newChild = { ...child, id: 'c' + Date.now() };
    mockChildren.push(newChild);
    return newChild;
  }
  const docRef = await addDoc(collection(db, 'children'), child);
  return { id: docRef.id, ...child };
};
