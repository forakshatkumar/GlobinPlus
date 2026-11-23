
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDYgnHGhKGNmbyhvBTq5GhZ-qTFxrpk38c",
  authDomain: "globinplus-anoky.firebaseapp.com",
  projectId: "globinplus-anoky",
  storageBucket: "globinplus-anoky.firebasestorage.app",
  messagingSenderId: "330762058972",
  appId: "1:330762058972:web:a2372d0fb190f6f2700819",
  measurementId: "G-HWSF4EZ09F"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
// Automatically use a compatible Firestore transport on restricted networks.
export const db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });

export const storage = getStorage(app);
