import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBprt712pPy8rQBK3AaT2RT5OCdoKSOU-I",
  authDomain: "shedule-system.firebaseapp.com",
  projectId: "shedule-system",
  storageBucket: "shedule-system.firebasestorage.app",
  messagingSenderId: "68293499666",
  appId: "1:68293499666:web:378fdfbfbb91703cbaf1cb"
};

let app, db, auth, authApp2, secondaryAuth, storage;

try {
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);

    // Secondary Firebase app instance used ONLY for creating sub-accounts
    // without signing the current admin out
    authApp2 = initializeApp(firebaseConfig, "secondary");
    secondaryAuth = getAuth(authApp2);

    console.log("Firebase initialized successfully");
  } else {
    console.warn("Firebase config missing. Running in mock mode...");
  }
} catch (error) {
  console.error("Firebase initialization error", error);
}

export { db, app, auth, secondaryAuth, storage };
export const USE_MOCK = !firebaseConfig.apiKey;
