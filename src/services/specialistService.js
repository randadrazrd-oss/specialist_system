import { db, USE_MOCK } from '../config/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { mockSpecialists, delay } from './mockData';

const COLLECTION_NAME = 'specialists';

export const getSpecialists = async () => {
  if (USE_MOCK) {
    await delay(300);
    return [...mockSpecialists];
  }
  const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addSpecialist = async (specialist) => {
  if (USE_MOCK) {
    await delay(300);
    const newSpec = { ...specialist, id: 's' + Date.now() };
    mockSpecialists.push(newSpec);
    return newSpec;
  }
  const docRef = await addDoc(collection(db, COLLECTION_NAME), specialist);
  return { id: docRef.id, ...specialist };
};
